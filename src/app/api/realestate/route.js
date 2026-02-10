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

    // Helper function to format boolean values as Yes/No
    const formatBoolean = (value) => (value ? "Yes" : "No");

    // Helper function to format date if it exists
    const formatDate = (date) => (date ? date : "");

    // Build project stage section only with filled values
    let projectStageHtml = "";
    let projectStageText = "";

    const hasProjectStageData = Object.values(formData.projectStage).some(
      (val) => val
    );

    if (hasProjectStageData) {
      projectStageHtml = `
        <div style="margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #333; margin-bottom: 10px;">Project Stage</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            ${formData.projectStage.searching ? `<li><strong>Searching:</strong> Yes</li>` : ""}
            ${formData.projectStage.identifiedProperty ? `<li><strong>Identified Property:</strong> Yes</li>` : ""}
            ${formData.projectStage.submittedOffer ? `<li><strong>Submitted Offer:</strong> Yes</li>` : ""}
            ${formData.projectStage.offerAccepted ? `<li><strong>Offer Accepted:</strong> Yes</li>` : ""}
            ${formData.projectStage.promiseSigned ? `<li><strong>Promise Signed:</strong> Yes</li>` : ""}
            ${formData.projectStage.deedSigned ? `<li><strong>Deed Signed:</strong> Yes</li>` : ""}
            ${formData.projectStage.promiseDate ? `<li><strong>Promise Date:</strong> ${formData.projectStage.promiseDate}</li>` : ""}
            ${formData.projectStage.deedDate ? `<li><strong>Deed Date:</strong> ${formData.projectStage.deedDate}</li>` : ""}
          </ul>
        </div>
      `;

      projectStageText = `
Project Stage:
${formData.projectStage.searching ? "- Searching: Yes\n" : ""}${formData.projectStage.identifiedProperty ? "- Identified Property: Yes\n" : ""}${formData.projectStage.submittedOffer ? "- Submitted Offer: Yes\n" : ""}${formData.projectStage.offerAccepted ? "- Offer Accepted: Yes\n" : ""}${formData.projectStage.promiseSigned ? "- Promise Signed: Yes\n" : ""}${formData.projectStage.deedSigned ? "- Deed Signed: Yes\n" : ""}${formData.projectStage.promiseDate ? "- Promise Date: " + formData.projectStage.promiseDate + "\n" : ""}${formData.projectStage.deedDate ? "- Deed Date: " + formData.projectStage.deedDate + "\n" : ""}`;
    }

    // Build selling stage section only with filled values
    let sellingStageHtml = "";
    let sellingStageText = "";

    const hasSellingStageData = Object.values(formData.sellingStage).some(
      (val) => val
    );

    if (hasSellingStageData) {
      sellingStageHtml = `
        <div style="margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #333; margin-bottom: 10px;">Selling Stage</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            ${formData.sellingStage.considering ? `<li><strong>Considering:</strong> Yes</li>` : ""}
            ${formData.sellingStage.listed ? `<li><strong>Listed:</strong> Yes</li>` : ""}
            ${formData.sellingStage.offerAccepted ? `<li><strong>Offer Accepted:</strong> Yes</li>` : ""}
            ${formData.sellingStage.promiseSigned ? `<li><strong>Promise Signed:</strong> Yes</li>` : ""}
            ${formData.sellingStage.deedSigned ? `<li><strong>Deed Signed:</strong> Yes</li>` : ""}
            ${formData.sellingStage.promiseDate ? `<li><strong>Promise Date:</strong> ${formData.sellingStage.promiseDate}</li>` : ""}
            ${formData.sellingStage.deedDate ? `<li><strong>Deed Date:</strong> ${formData.sellingStage.deedDate}</li>` : ""}
          </ul>
        </div>
      `;

      sellingStageText = `
Selling Stage:
${formData.sellingStage.considering ? "- Considering: Yes\n" : ""}${formData.sellingStage.listed ? "- Listed: Yes\n" : ""}${formData.sellingStage.offerAccepted ? "- Offer Accepted: Yes\n" : ""}${formData.sellingStage.promiseSigned ? "- Promise Signed: Yes\n" : ""}${formData.sellingStage.deedSigned ? "- Deed Signed: Yes\n" : ""}${formData.sellingStage.promiseDate ? "- Promise Date: " + formData.sellingStage.promiseDate + "\n" : ""}${formData.sellingStage.deedDate ? "- Deed Date: " + formData.sellingStage.deedDate + "\n" : ""}`;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">New Real Estate Inquiry</h1>
        
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
          <h3 style="color: #333; margin-bottom: 10px;">Request Details</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            ${formData.projectStatus ? `<li><strong>Project Status:</strong> ${formData.projectStatus}</li>` : ""}
            ${formData.transactionType ? `<li><strong>Transaction Type:</strong> ${formData.transactionType}</li>` : ""}
            ${formData.budget ? `<li><strong>Budget:</strong> ${formData.budget}</li>` : ""}
            ${formData.propertyType ? `<li><strong>Property Type:</strong> ${formData.propertyType}</li>` : ""}
          </ul>
        </div>
        
        ${projectStageHtml}
        ${sellingStageHtml}
        
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
NEW REAL ESTATE INQUIRY
=====================

PERSONAL INFORMATION
-------------------
Name: ${formData.personalInfo.firstName} ${formData.personalInfo.lastName}
${formData.personalInfo.email ? "Email: " + formData.personalInfo.email + "\n" : ""}${formData.personalInfo.phone ? "Phone: " + formData.personalInfo.phone + "\n" : ""}${formData.personalInfo.currentCountry ? "Current Country: " + formData.personalInfo.currentCountry : ""}

REQUEST DETAILS
--------------
${formData.projectStatus ? "Project Status: " + formData.projectStatus + "\n" : ""}${formData.transactionType ? "Transaction Type: " + formData.transactionType + "\n" : ""}${formData.budget ? "Budget: " + formData.budget + "\n" : ""}${formData.propertyType ? "Property Type: " + formData.propertyType : ""}

${projectStageText}
${sellingStageText}

${formData.other ? `OTHER INFORMATION\n----------------\n${formData.other}\n` : ""}

Submitted on: ${new Date().toLocaleString()}
    `;

    const result = await sendEmail(
      "New Real Estate Inquiry",
      htmlContent,
      textContent
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Real Estate form submitted successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Real Estate form error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}