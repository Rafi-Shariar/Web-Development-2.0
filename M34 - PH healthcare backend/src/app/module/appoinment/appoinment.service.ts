import config from "../../config";
import { getBkashIdToken } from "../../lib/bkash";

const bookAppointment = async () => {
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
        payerReference: "01723888888",
        callbackURL: `${config.bkash_callback_url}/appointment/book-appoinment/payment/callback`,
        amount: "12",
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: "Inv031111", //place appointment ID
      }),
    }
  );

  const bkashCreatePaymentResult = await bkashCreatePaymentResponse.json();
  return bkashCreatePaymentResult;
};

const bookAppointmentCallback = async (query: Record<string, any>) => {
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
    }
  );

  const executedPaymentResult = await executedPaymentResponse.json();

  if(status === "success"){
    return {
        executedPaymentResult,
        redirectUrl : `${config.frontend_url}/dashboard/my-appointments?status=success`
    }
  }

  if(status === "failure"){
    return {
        executedPaymentResult,
        redirectUrl : `${config.frontend_url}/dashboard/my-appointments?status=failure`
    }
  }

  if(status === "cancel"){
    return {
        executedPaymentResult,
        redirectUrl : `${config.frontend_url}/dashboard/my-appointments?status=cancel`
    }
  }


  return {
        executedPaymentResult,
        redirectUrl : `${config.frontend_url}/dashboard/my-appointments`
    }
};

export const AppointmentServices = {
  bookAppointment,
  bookAppointmentCallback,
};