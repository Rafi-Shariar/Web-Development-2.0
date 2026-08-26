import config from "../config";
import { redisClient } from "./redis";

export const getBkashIdToken = async () => {
  const IdtokenKey = "bkash:idToken";
  const RefreshToken = "bkash:refreshToken";

  try {
    let bkashIdToken = await redisClient.get(IdtokenKey);
    const bkashIdTokenTTL = await redisClient.ttl(IdtokenKey);

    const bkashRefreshToken = await redisClient.get(RefreshToken);
    const bkashRefreshTokenTTL = await redisClient.ttl(RefreshToken)

    // console.log({
    //   bkashIdToken,
    //   bkashIdTokenTTL,
    //   bkashRefreshToken,
    //   bkashRefreshTokenTTL

    // });
    

    //bkash Id token remaining time less than 10 minutes
    if ( (bkashIdTokenTTL <= 600 || !bkashIdToken) && bkashRefreshToken && bkashIdTokenTTL > 600) {
      const BkashRefreshTokenResponse = await fetch(
        `${config.bkash_base_url}/tokenized/checkout/token/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            username: config.bkash_username,
            password: config.bkash_password,
          },
          body: JSON.stringify({
            app_key: config.bkash_app_key,
            app_secret: config.bkash_app_secrete,
            refresh_token: bkashRefreshToken,
          }),
        },
      );

      if (!BkashRefreshTokenResponse.ok) {
      throw new Error("Bkash Refresh Token Grand Failed");
    }

      const bkashRefreshTokenResult = await BkashRefreshTokenResponse.json();

      bkashIdToken = bkashRefreshTokenResult.id_token as string;

      await redisClient.set(IdtokenKey, bkashIdToken, {
        expiration: {
          type: "EX",
          value: 60 * 60,
        },
      });

      return bkashIdToken;
    }

    if (bkashIdTokenTTL > 600) {
      return bkashIdToken;
    }

    const response = await fetch(
      `${config.bkash_base_url}/tokenized/checkout/token/grant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: config.bkash_username,
          password: config.bkash_password,
        },
        body: JSON.stringify({
          app_key: config.bkash_app_key,
          app_secret: config.bkash_app_secrete,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Bkash Access Token Grand Failed");
    }

    const result = await response.json();

    await redisClient.set(IdtokenKey, result.id_token, {
      expiration: {
        type: "EX",
        value: 60 * 60, //1 hour
      },
    });

    await redisClient.set(RefreshToken, result.refresh_token, {
      expiration: {
        type: "EX",
        value: 60 * 60 * 24 * 28, //28 days
      },
    });

    bkashIdToken = result.id_token;

    return bkashIdToken;
  } catch (error) {
    throw new Error("Can't generate bkash id token");
  }
};
