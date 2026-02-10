import { NextResponse } from "next/server";
import { sendEmail } from "@/utils/mailer";
import { verifyRecaptcha } from "@/utils/recaptcha";

export async function POST(req) {
  try {
    const body = await req.json();
    const { recaptchaToken, ...formData } = body;

    // Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success) {
      return NextResponse.json(
        { success: false, error: "reCAPTCHA verification failed" },
        { status: 403 }
      );
    }

    // Helper function to format boolean values
    const formatBoolean = (value) => (value ? "Yes" : "No");

    // Determine subject based on service type
    let subject = "New Inquiry - ";
    switch (formData.serviceType) {
      case "installation":
        subject += "Installation in Portugal";
        break;
      case "realEstate":
        subject += "Real Estate Services";
        break;
      case "business":
        subject += "Business Services";
        break;
      case "other":
        subject += "General Inquiry";
        break;
      default:
        subject += "Website Contact Form";
    }

    // Build installation details section if applicable
    let installationHtml = "";
    let installationText = "";

    if (formData.serviceType === "installation" && formData.installation) {
      installationHtml = `
        <div style="margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #333; margin-bottom: 10px;">Installation Details</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            ${formData.installation.visaType ? `<li><strong>Visa Type:</strong> ${formData.installation.visaType}</li>` : ""}
            ${formData.installation.timeline ? `<li><strong>Timeline:</strong> ${formData.installation.timeline}</li>` : ""}
            ${formData.installation.familySize ? `<li><strong>Family Size:</strong> ${formData.installation.familySize}</li>` : ""}
            ${formData.installation.additionalInfo ? `<li><strong>Additional Information:</strong> ${formData.installation.additionalInfo}</li>` : ""}
          </ul>
        </div>
      `;

      installationText = `
INSTALLATION DETAILS
-------------------
${formData.installation.visaType ? "Visa Type: " + formData.installation.visaType + "\n" : ""}${formData.installation.timeline ? "Timeline: " + formData.installation.timeline + "\n" : ""}${formData.installation.familySize ? "Family Size: " + formData.installation.familySize + "\n" : ""}${formData.installation.additionalInfo ? "Additional Information: " + formData.installation.additionalInfo : ""}
`;
    }

    // Build real estate details section if applicable
    let realEstateHtml = "";
    let realEstateText = "";

    if (formData.serviceType === "realEstate" && formData.realEstate) {
      realEstateHtml = `
        <div style="margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #333; margin-bottom: 10px;">Real Estate Details</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            ${formData.realEstate.propertyType ? `<li><strong>Property Type:</strong> ${formData.realEstate.propertyType}</li>` : ""}
            ${formData.realEstate.budget ? `<li><strong>Budget:</strong> ${formData.realEstate.budget}</li>` : ""}
            ${formData.realEstate.location ? `<li><strong>Location:</strong> ${formData.realEstate.location}</li>` : ""}
            ${formData.realEstate.timeline ? `<li><strong>Timeline:</strong> ${formData.realEstate.timeline}</li>` : ""}
            ${formData.realEstate.additionalInfo ? `<li><strong>Additional Information:</strong> ${formData.realEstate.additionalInfo}</li>` : ""}
          </ul>
        </div>
      `;

      realEstateText = `
REAL ESTATE DETAILS
------------------
${formData.realEstate.propertyType ? "Property Type: " + formData.realEstate.propertyType + "\n" : ""}${formData.realEstate.budget ? "Budget: " + formData.realEstate.budget + "\n" : ""}${formData.realEstate.location ? "Location: " + formData.realEstate.location + "\n" : ""}${formData.realEstate.timeline ? "Timeline: " + formData.realEstate.timeline + "\n" : ""}${formData.realEstate.additionalInfo ? "Additional Information: " + formData.realEstate.additionalInfo : ""}
`;
    }

    // Build business details section if applicable
    let businessHtml = "";
    let businessText = "";

    if (formData.serviceType === "business" && formData.business) {
      businessHtml = `
        <div style="margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #333; margin-bottom: 10px;">Business Details</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            ${formData.business.businessType ? `<li><strong>Business Type:</strong> ${formData.business.businessType}</li>` : ""}
            ${formData.business.timeline ? `<li><strong>Timeline:</strong> ${formData.business.timeline}</li>` : ""}
            ${formData.business.investmentAmount ? `<li><strong>Investment Amount:</strong> ${formData.business.investmentAmount}</li>` : ""}
            ${formData.business.additionalInfo ? `<li><strong>Additional Information:</strong> ${formData.business.additionalInfo}</li>` : ""}
          </ul>
        </div>
      `;

      businessText = `
BUSINESS DETAILS
---------------
${formData.business.businessType ? "Business Type: " + formData.business.businessType + "\n" : ""}${formData.business.timeline ? "Timeline: " + formData.business.timeline + "\n" : ""}${formData.business.investmentAmount ? "Investment Amount: " + formData.business.investmentAmount + "\n" : ""}${formData.business.additionalInfo ? "Additional Information: " + formData.business.additionalInfo : ""}
`;
    }

    // Build other details section if applicable
    let otherDetailsHtml = "";
    let otherDetailsText = "";

    if (formData.serviceType === "other" && formData.otherDetails) {
      otherDetailsHtml = `
        <div style="margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #333; margin-bottom: 10px;">Other Details</h3>
          <p>${formData.otherDetails}</p>
        </div>
      `;

      otherDetailsText = `
OTHER DETAILS
------------
${formData.otherDetails}
`;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">${subject}</h1>
        
        <div style="margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #333; margin-bottom: 10px;">Personal Information</h3>
          <ul style="list-style-type: none; padding-left: 0;">
            <li><strong>Name:</strong> ${formData.personalInfo.firstName} ${formData.personalInfo.lastName}</li>
            ${formData.personalInfo.email ? `<li><strong>Email:</strong> ${formData.personalInfo.email}</li>` : ""}
            ${formData.personalInfo.phone ? `<li><strong>Phone:</strong> ${formData.personalInfo.phone}</li>` : ""}
            ${formData.personalInfo.currentCountry ? `<li><strong>Current Country:</strong> ${formData.personalInfo.currentCountry}</li>` : ""}
            ${formData.projectStatus ? `<li><strong>Project Status:</strong> ${formData.projectStatus}</li>` : ""}
          </ul>
        </div>
        
        ${installationHtml}
        ${realEstateHtml}
        ${businessHtml}
        ${otherDetailsHtml}
        
        ${
          formData.additionalInfo
            ? `
        <div style="margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="color: #333; margin-bottom: 10px;">Additional Information</h3>
          <p>${formData.additionalInfo}</p>
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
${subject.toUpperCase()}
${"=".repeat(subject.length)}

PERSONAL INFORMATION
-------------------
Name: ${formData.personalInfo.firstName} ${formData.personalInfo.lastName}
${formData.personalInfo.email ? "Email: " + formData.personalInfo.email + "\n" : ""}${formData.personalInfo.phone ? "Phone: " + formData.personalInfo.phone + "\n" : ""}${formData.personalInfo.currentCountry ? "Current Country: " + formData.personalInfo.currentCountry + "\n" : ""}${formData.projectStatus ? "Project Status: " + formData.projectStatus : ""}

${installationText}${realEstateText}${businessText}${otherDetailsText}

${formData.additionalInfo ? `ADDITIONAL INFORMATION\n--------------------\n${formData.additionalInfo}\n` : ""}

Submitted on: ${new Date().toLocaleString()}
    `;

    const result = await sendEmail(subject, htmlContent, textContent);

    if (!result.success) {
      throw new Error(result.error || "Failed to send email");
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
        details: error.message,
      },
      { status: 500 }
    );
  }
}