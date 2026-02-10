import { sendEmail } from "@/utils/mailer";
import { verifyRecaptcha } from "@/utils/recaptcha";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { recaptchaToken, ...formData } = body;

    // Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success) {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA verification failed" },
        { status: 403 }
      );
    }

    // Helper function to format boolean values
    const formatBoolean = (value) => (value ? "Yes" : "No");

    // Build existing business section if it has data
    let existingBusinessHtml = "";
    let existingBusinessText = "";

    const hasExistingBusinessData = Object.values(
      formData.existingBusiness
    ).some((val) => val && val !== "" && val !== false);

    if (hasExistingBusinessData) {
      existingBusinessHtml = `
        <div style="margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #333; margin-bottom: 10px;">Existing Business Needs</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            ${formData.existingBusiness.contracts ? `<li><strong>Contracts:</strong> Yes</li>` : ""}
            ${formData.existingBusiness.compliance ? `<li><strong>Compliance:</strong> Yes</li>` : ""}
            ${formData.existingBusiness.disputes ? `<li><strong>Disputes:</strong> Yes</li>` : ""}
            ${formData.existingBusiness.other ? `<li><strong>Other:</strong> Yes</li>` : ""}
            ${formData.existingBusiness.otherText ? `<li><strong>Details:</strong> ${formData.existingBusiness.otherText}</li>` : ""}
          </ul>
        </div>
      `;

      existingBusinessText = `
EXISTING BUSINESS NEEDS
----------------------
${formData.existingBusiness.contracts ? "- Contracts: Yes\n" : ""}${formData.existingBusiness.compliance ? "- Compliance: Yes\n" : ""}${formData.existingBusiness.disputes ? "- Disputes: Yes\n" : ""}${formData.existingBusiness.other ? "- Other: Yes\n" : ""}${formData.existingBusiness.otherText ? "- Details: " + formData.existingBusiness.otherText + "\n" : ""}`;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">New Business Inquiry</h1>
        
        <div style="margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #333; margin-bottom: 10px;">Personal Information</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            <li><strong>Name:</strong> ${formData.personalInfo.firstName} ${formData.personalInfo.lastName}</li>
            ${formData.personalInfo.email ? `<li><strong>Email:</strong> ${formData.personalInfo.email}</li>` : ""}
            ${formData.personalInfo.phone ? `<li><strong>Phone:</strong> ${formData.personalInfo.phone}</li>` : ""}
            ${formData.personalInfo.currentCountry ? `<li><strong>Current Country:</strong> ${formData.personalInfo.currentCountry}</li>` : ""}
          </ul>
        </div>
        
        <div style="margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #333; margin-bottom: 10px;">Business Details</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            ${formData.businessType ? `<li><strong>Business Type:</strong> ${formData.businessType}</li>` : ""}
            ${formData.createType ? `<li><strong>Create Type:</strong> ${formData.createType}</li>` : ""}
            ${formData.companyStructure ? `<li><strong>Company Structure:</strong> ${formData.companyStructure}</li>` : ""}
            ${formData.needAdvice !== undefined ? `<li><strong>Need Advice:</strong> ${formatBoolean(formData.needAdvice)}</li>` : ""}
            ${formData.businessSector ? `<li><strong>Business Sector:</strong> ${formData.businessSector}</li>` : ""}
            ${formData.timeline ? `<li><strong>Timeline:</strong> ${formData.timeline}</li>` : ""}
          </ul>
        </div>
        
        ${existingBusinessHtml}
        
        ${
          formData.other
            ? `
        <div style="margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #333; margin-bottom: 10px;">Other Information</h3>
          <p>${formData.other}</p>
        </div>
        `
            : ""
        }
        
        <p style="color: #7f8c8d; font-size: 0.9em; margin-top: 20px; border-top: 1px solid #ecf0f1; padding-top: 10px;">
          Submitted on: ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    const textContent = `
NEW BUSINESS INQUIRY
===================

PERSONAL INFORMATION
-------------------
Name: ${formData.personalInfo.firstName} ${formData.personalInfo.lastName}
${formData.personalInfo.email ? "Email: " + formData.personalInfo.email + "\n" : ""}${formData.personalInfo.phone ? "Phone: " + formData.personalInfo.phone + "\n" : ""}${formData.personalInfo.currentCountry ? "Current Country: " + formData.personalInfo.currentCountry : ""}

BUSINESS DETAILS
--------------
${formData.businessType ? "Business Type: " + formData.businessType + "\n" : ""}${formData.createType ? "Create Type: " + formData.createType + "\n" : ""}${formData.companyStructure ? "Company Structure: " + formData.companyStructure + "\n" : ""}${formData.needAdvice !== undefined ? "Need Advice: " + formatBoolean(formData.needAdvice) + "\n" : ""}${formData.businessSector ? "Business Sector: " + formData.businessSector + "\n" : ""}${formData.timeline ? "Timeline: " + formData.timeline + "\n" : ""}

${existingBusinessText}

${formData.other ? `OTHER INFORMATION\n----------------\n${formData.other}\n` : ""}

Submitted on: ${new Date().toLocaleString()}
    `;

    const result = await sendEmail(
      "New Business Inquiry",
      htmlContent,
      textContent
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Business form submitted successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Business form error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
