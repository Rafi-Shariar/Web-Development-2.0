import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { SubscriptionStatus } from "../../../generated/prisma/enums";


export const getPeriodEnd = (payload : Stripe.Subscription) =>{
    const currentPeriodEndInMs = payload.items.data[0]?.current_period_end!;
    const currentPeriodEnd = new Date(currentPeriodEndInMs * 1000);
    return currentPeriodEnd;

}

export const handleCheckoutCompleted = async (session : Stripe.Checkout.Session) =>{
      
    // console.log("session Object : ", session);

      const userId = session.metadata?.userId;
      const stripeCustomerId = session.customer as string;
      const stripeSubscriptionId = session.subscription as string;

      // Replace your current IF statement with this temporary debug block
      if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
        throw new Error(`Webhook Failed: Missing required session data.`,);
      }

      const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
      const currentPeriodEnd = getPeriodEnd(stripeSubscription);

  
      //console.log(currentPeriodEnd, "end");

      await prisma.subscription.upsert({
        where : {userId},
        create : {
          userId,
          stripeCustomerId,
          stripeSubscriptionId,
          status : "ACTIVE",
          currentPeriodEnd
        },
        update : {
          stripeCustomerId,
          stripeSubscriptionId,
          status : "ACTIVE",
          currentPeriodEnd
        }
      })
      

}

export const handleChangeSubscription = async (payload : Stripe.Subscription) =>{
  const stripeSubscriptionId = payload.id;
  const status = payload.status === "active" ? SubscriptionStatus.ACTIVE :
                payload.status === "trialing" ? SubscriptionStatus.ACTIVE :
                payload.status === "canceled" ? SubscriptionStatus.CANCELED :
                SubscriptionStatus.EXPIRED

  const currentPeriodEnd = getPeriodEnd(payload)

  const isSubscriptionExist = await prisma.subscription.findUnique({
    where : {stripeSubscriptionId}
  })

  if(!isSubscriptionExist){
    console.log(`Webhook : No subsction found  for ${stripeSubscriptionId}!`);
    
  }

  await prisma.subscription.update({
    where : {stripeSubscriptionId},
    data : {
      status,
      currentPeriodEnd
    }
  })


  //stripe subscriptions cancel sub_ID - for checking  

}