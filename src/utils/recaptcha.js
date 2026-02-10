const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

export async function verifyRecaptcha(token) {
  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
      }
    );

    const data = await response.json();

    if (data.success && data.score >= 0.5) {
      return { success: true, score: data.score };
    }

    return {
      success: false,
      score: data.score || 0,
      error: "Failed reCAPTCHA verification",
    };
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return { success: false, error: error.message };
  }
}