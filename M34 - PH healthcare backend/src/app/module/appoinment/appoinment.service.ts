import { text } from "node:stream/consumers";
import {
  AppointmentStatus,
  PaymentStatus,
} from "../../../generated/prisma/enums";
import config from "../../config";
import { getBkashIdToken } from "../../lib/bkash";
import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../middleware/checkAuth";

// create a new appointment & related payment intent
const bookAppointment = async (payload: any, user: RequestUser) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    //creating appointment
    const appoinment = await tx.appointment.create({
      data: {
        status: AppointmentStatus.PENDING,
      },
    });

    //creating bkash intent for payment
    const bkashIdToken = await getBkashIdToken();

    if (!bkashIdToken) throw new Error("No Bkash Access token found.");

    const bkashCreatePaymentResponse = await fetch(
      `${config.bkash_base_url}/tokenized/checkout/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: bkashIdToken,
          "X-App-Key": config.bkash_app_key,
        },
        body: JSON.stringify({
          mode: "0011",
          payerReference: user.email,
          callbackURL: `${config.bkash_callback_url}/appointment/book-appoinment/payment/callback`,
          amount: "12",
          currency: "BDT",
          intent: "sale",
          merchantInvoiceNumber: appoinment.id, //place appointment ID
        }),
      },
    );

    const bkashCreatePaymentResult = await bkashCreatePaymentResponse.json();

    // inserting payemnt data
    await tx.payment.create({
      data: {
        marchantInvoiceNumber: bkashCreatePaymentResult.merchantInvoiceNumber,
        appointmentId: appoinment.id,
        amount: "12",
        gatewayResponse: bkashCreatePaymentResult,
        bkashPaymentId: bkashCreatePaymentResult.paymentID,
        payerReference: user.email,
      },
    });
    return {
      paymentUrl: bkashCreatePaymentResult.bkashURL,
    };
  });

  return transactionResult;
};

// complete payment and save info in DB
const bookAppointmentCallback = async (query: Record<string, any>) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const paymentID = query.paymentID || query.paymentId;
    const status = query.status;

    if (!paymentID) {
      throw new Error("Payment ID missing from callback query.");
    }

    // 1. Guard against non-success statuses (cancel, failure, etc.)
    if (status !== "success") {
      return {
        statusCode: "400",
        statusMessage: `Payment ${status || "failed"} by user.`,
        paymentID,
      };
    }

    // 2. Retrieve bKash ID Token
    const bkashIdToken = await getBkashIdToken();
    if (!bkashIdToken) {
      throw new Error("No Bkash Access token found.");
    }

    // 3. Execute Payment
    const executedPaymentResponse = await fetch(
      `${config.bkash_base_url}/tokenized/checkout/execute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: bkashIdToken,
          "X-App-Key": config.bkash_app_key,
        },
        body: JSON.stringify({
          paymentID: paymentID,
        }),
      },
    );

    const executedPaymentResult = await executedPaymentResponse.json();

    if (status === "success") {
      await tx.appointment.update({
        where: {
          id: executedPaymentResult.merchantInvoiceNumber,
        },
        data: {
          status: AppointmentStatus.CONFIRMED,
        },
      });

      await tx.payment.update({
        where: {
          bkashPaymentId: paymentID,
        },
        data: {
          status: PaymentStatus.PAID,
          bkashTrxId: executedPaymentResult.bkashTrxId,
          paidAt: executedPaymentResult.paymentExecteTime,
          gatewayResponse: executedPaymentResult,
        },
      });
      return {
        redirectUrl: `${config.frontend_url}/dashboard/my-appointments?status=success`,
      };
    } else if (status === "failure") {
      await tx.payment.update({
        where: {
          bkashPaymentId: paymentID,
        },
        data: {
          status: PaymentStatus.FAILED,
          gatewayResponse: executedPaymentResult,
        },
      });
      return {
        redirectUrl: `${config.frontend_url}/dashboard/my-appointments?status=failure`,
      };
    } else if (status === "cancel") {
      await tx.payment.update({
        where: {
          bkashPaymentId: paymentID,
        },
        data: {
          status: PaymentStatus.CANCELED,
          gatewayResponse: executedPaymentResult,
        },
      });
      return {
        redirectUrl: `${config.frontend_url}/dashboard/my-appointments?status=cancel`,
      };
    } else {
      return {
        redirectUrl: `${config.frontend_url}/dashboard/my-appointments?error=payment-failed`,
      };
    }
  });

  return transactionResult;
};

//retrying failed payments
const payAppointment = async (payload: any, user: RequestUser) => {
  const appointmentId = payload.appoinmentId;

  const existingAppointment = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
    },
  });

  if (existingAppointment.status !== "PENDING") {
    throw new Error("Appointment is not pending.");
  }

  const bkashIdToken = await getBkashIdToken();

  if (!bkashIdToken) throw new Error("No Bkash Access token found.");

  const bkashCreatePaymentResponse = await fetch(
    `${config.bkash_base_url}/tokenized/checkout/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: bkashIdToken,
        "X-App-Key": config.bkash_app_key,
      },
      body: JSON.stringify({
        mode: "0011",
        payerReference: user.email,
        callbackURL: `${config.bkash_callback_url}/appointment/book-appoinment/payment/callback`,
        amount: "12",
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: existingAppointment.id, //place appointment ID
      }),
    },
  );

  const bkashCreatePaymentResult = await bkashCreatePaymentResponse.json();

  await prisma.payment.update({
    where: {
      appointmentId: existingAppointment.id,
    },
    data: {
      marchantInvoiceNumber: bkashCreatePaymentResult.merchantInvoiceNumber,
      gatewayResponse: bkashCreatePaymentResult,
      bkashPaymentId: bkashCreatePaymentResult.paymentID,
    },
  });

  return {
    paymentUrl: bkashCreatePaymentResult.bkashURL,
  };
};

// cancel appointment & refund
const cancelAppointment = async (payload: any, user: RequestUser) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const appointmentId = payload.appoinmentId;

    const existingAppointment = await tx.appointment.findUniqueOrThrow({
      where: {
        id: appointmentId,
      },
      include: {
        payment: true,
      },
    });

    if (
      existingAppointment.status === "ONGOING" ||
      existingAppointment.status === "COMPLETED"
    ) {
      throw new Error(
        `Appointment is ${existingAppointment.status.toLocaleLowerCase}`,
      );
    }

    if (existingAppointment.status === "CANCELED") {
      throw new Error(`Appointment is already cancelled`);
    }

    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: existingAppointment.id,
      },
      data: {
        status: "CANCELED",
      },
    });

    const bkashIdToken = await getBkashIdToken();

    if (!bkashIdToken) throw new Error("No Bkash Access token found.");

    const bkashRefundPaymentResponse = await fetch(
      `${config.bkash_base_url}/tokenized/checkout/payment/refund`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: bkashIdToken,
          "X-App-Key": config.bkash_app_key,
        },
        body: JSON.stringify({
          paymentID: existingAppointment.payment?.bkashPaymentId,
          trxID: existingAppointment.payment?.bkashTrxId,
          amount: existingAppointment.payment?.amount,
          reason: "Patient Cancelled the appointment",
        }),
      },
    );

    const bkashRefundPaymentResult = await bkashRefundPaymentResponse.json();

    const updatedPayment = await tx.payment.update({
      where : {
        appointmentId : existingAppointment.id
      },
      data : {
        refundTrxId : bkashRefundPaymentResult.refundTrxID,
        refundedAt : bkashRefundPaymentResult.completedTime,
        refundAmount : bkashRefundPaymentResult.refundAmount,
        refundReason : bkashRefundPaymentResult.reason,
        status : PaymentStatus.REFUNDED,
        gatewayResponse : bkashRefundPaymentResult
      }
    })

    return { 
      appointment : updatedAppointment,
      payment : updatedPayment
    }
  });

  return transactionResult
};

export const AppointmentServices = {
  bookAppointment,
  bookAppointmentCallback,
  payAppointment,
  cancelAppointment
};
