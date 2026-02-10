import { sendEmail } from "@/utils/mailer";
import { verifyRecaptcha } from "@/utils/recaptcha";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { recaptchaToken, ...data } = body;

    // Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success) {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA verification failed" },
        { status: 403 }
      );
    }

    const { personalInfo, projectStatus } = data;

    // Helper function to format boolean values
    const formatBoolean = (value) => (value ? "Yes" : "No");

    // Build needs section if it has data
    let needsHtml = "";
    let needsText = "";

    const hasNeedsData = Object.values(data.needs).some((val) => val);

    if (hasNeedsData) {
      needsHtml = `
        <div style="margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #333; margin-bottom: 10px;">Client Needs</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            ${data.needs.administrative ? `<li><strong>Administrative Support:</strong> Yes</li>` : ""}
            ${data.needs.consultation ? `<li><strong>Legal Consultation:</strong> Yes</li>` : ""}
            ${data.needs.other ? `<li><strong>Other:</strong> ${data.needs.other}</li>` : ""}
          </ul>
        </div>
      `;

      needsText = `
CLIENT NEEDS
-----------
${data.needs.administrative ? "- Administrative Support: Yes\n" : ""}${data.needs.consultation ? "- Legal Consultation: Yes\n" : ""}${data.needs.other ? "- Other: " + data.needs.other + "\n" : ""}`;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">New Installation Inquiry</h1>
        
        <div style="margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #333; margin-bottom: 10px;">Personal Information</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            <li><strong>Name:</strong> ${personalInfo.firstName} ${personalInfo.lastName}</li>
            ${personalInfo.email ? `<li><strong>Email:</strong> ${personalInfo.email}</li>` : ""}
            ${personalInfo.phone ? `<li><strong>Phone:</strong> ${personalInfo.phone}</li>` : ""}
            ${personalInfo.currentCountry ? `<li><strong>Current Country:</strong> ${personalInfo.currentCountry}</li>` : ""}
          </ul>
        </div>
        
        <div style="margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #333; margin-bottom: 10px;">Installation Details</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            ${projectStatus ? `<li><strong>Project Status:</strong> ${projectStatus}</li>` : ""}
            ${data.visaType ? `<li><strong>Visa Type:</strong> ${data.visaType}</li>` : ""}
            ${data.residencyStatus ? `<li><strong>Residency Status:</strong> ${data.residencyStatus}</li>` : ""}
            ${data.portugaStatus ? `<li><strong>Portugal Status:</strong> ${data.portugaStatus}</li>` : ""}
            ${data.aimaDate ? `<li><strong>AIMA Date:</strong> ${data.aimaDate}</li>` : ""}
          </ul>
        </div>
        
        ${needsHtml}
        
        <p style="color: #7f8c8d; font-size: 0.9em; margin-top: 20px; border-top: 1px solid #ecf0f1; padding-top: 10px;">
          Submitted on: ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    const textContent = `
NEW INSTALLATION INQUIRY
=======================

PERSONAL INFORMATION
-------------------
Name: ${personalInfo.firstName} ${personalInfo.lastName}
${personalInfo.email ? "Email: " + personalInfo.email + "\n" : ""}${personalInfo.phone ? "Phone: " + personalInfo.phone + "\n" : ""}${personalInfo.currentCountry ? "Current Country: " + personalInfo.currentCountry : ""}

INSTALLATION DETAILS
------------------
${projectStatus ? "Project Status: " + projectStatus + "\n" : ""}${data.visaType ? "Visa Type: " + data.visaType + "\n" : ""}${data.residencyStatus ? "Residency Status: " + data.residencyStatus + "\n" : ""}${data.portugaStatus ? "Portugal Status: " + data.portugaStatus + "\n" : ""}${data.aimaDate ? "AIMA Date: " + data.aimaDate : ""}

${needsText}

Submitted on: ${new Date().toLocaleString()}
    `;

    const result = await sendEmail(
      "New Installation Inquiry",
      htmlContent,
      textContent
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Installation form submitted successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Installation form error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}