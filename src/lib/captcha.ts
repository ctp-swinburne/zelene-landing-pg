interface CaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

interface ReCaptchaVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

export async function verifyCaptcha(token: string | undefined): Promise<CaptchaResponse> {
  if (!token) {
    return { success: false };
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = (await response.json()) as ReCaptchaVerifyResponse;

    return {
      success: data.success,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
      "error-codes": data["error-codes"],
    };
  } catch (error) {
    console.error("Captcha verification error:", error);
    return { success: false };
  }
}
