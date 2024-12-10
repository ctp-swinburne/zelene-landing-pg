interface CaptchaResponse {
    success: boolean;
    challenge_ts?: string;
    hostname?: string;
    "error-codes"?: string[];
  }
  
  export async function verifyCaptcha(token: string | undefined): Promise<CaptchaResponse> {
    if (!token) return { success: false };
    
    try {
      const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Captcha verification error:", error);
      return { success: false };
    }
  }