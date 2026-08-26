import { success } from "zod";
import config from "../../config";
import { getBkashIdToken } from "../../lib/bkash";

const bookAppointment = async () => {
  //bussiness Login

  const bkashIdToken = await getBkashIdToken();

//   console.log(bkashIdToken);
  

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
        // agreementID: "TokenizedMerchant01L3IKB6H1565072174986",
        mode: "0011",
        payerReference: "01723888888",
        callbackURL: `${config.bkash_callback_url}/appointment/book-appoinment/payment/callback`,
        // merchantAssociationInfo: "MI05MID54RF09123456One",
        amount: "12",
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: "Inv0124",
      }),
    },
  );

  const bkashCreatePaymentResult = await bkashCreatePaymentResponse.json()

  return bkashCreatePaymentResult
};

const bookAppointmentCallback = async () => {
    return {
        success : true
    }
}

export const AppointmentServices = {
    bookAppointment,
    bookAppointmentCallback
};
