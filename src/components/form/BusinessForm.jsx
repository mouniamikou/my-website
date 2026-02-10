"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import PersonalInfoForm from "./PersonalInfo";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/translations";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import SuccessMessage from "../SuccessMessage";

const BusinessForm = ({ onSubmit }) => {
  const { language } = useLanguage();
  const t =
    translations[language]?.businessForm || translations.en.businessForm;
  const { getToken } = useRecaptcha();

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      currentCountry: "",
    },
    businessType: "",
    createType: "",
    companyStructure: "",
    needAdvice: false,
    existingBusiness: {
      contracts: false,
      compliance: false,
      disputes: false,
      other: false,
      otherText: "",
    },
    businessSector: "",
    timeline: "",
    other: "",
    termsAccepted: false,
    name: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const recaptchaToken = await getToken("business_form");

      const response = await fetch("/api/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        setFormData({
          personalInfo: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            currentCountry: "",
          },
          businessType: "",
          createType: "",
          companyStructure: "",
          needAdvice: false,
          existingBusiness: {
            contracts: false,
            compliance: false,
            disputes: false,
            other: false,
            otherText: "",
          },
          businessSector: "",
          timeline: "",
          other: "",
          termsAccepted: false,
          name: "",
          message: "",
        });
        if (onSubmit) {
          onSubmit();
        }
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (submitStatus === "success") {
    return <SuccessMessage />;
  }

  return (
    <div
      className="max-w-2xl mx-auto p-6 mb-4 bg-white rounded-xl shadow-lg"
      style={{
        backgroundImage: "url('/blob-scene-haikei (2).svg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <motion.form
        initial="hidden"
        animate="visible"
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        {submitStatus === "error" && (
          <div className="error-message">
            There was an error submitting your form. Please try again.
          </div>
        )}

        <PersonalInfoForm
          formData={formData}
          onFormDataChange={setFormData}
          formType="business"
        />

        {/* Business Type Selection */}
        <motion.section variants={fadeIn} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {t?.businessNeeds || "Your Business Needs"}
          </h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="businessType"
                required
                value="create"
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                onChange={handleChange}
                checked={formData.businessType === "create"}
              />
              <span className="text-gray-700">
                {t?.createBusiness || "Create a business in Portugal"}
              </span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="businessType"
                required
                value="assist"
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                onChange={handleChange}
                checked={formData.businessType === "assist"}
              />
              <span className="text-gray-700">
                {t?.assistBusiness ||
                  "Get assistance with existing Portuguese business"}
              </span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="businessType"
                required
                value="other"
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                onChange={handleChange}
                checked={formData.businessType === "other"}
              />
              <span className="text-gray-700">{t?.other || "Other"}</span>
            </label>
          </div>
        </motion.section>

        {/* Create Business Section */}
        {formData.businessType === "create" && (
          <motion.section variants={fadeIn} className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800">
              {t?.businessStructure || "Business Structure"}
            </h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="createType"
                  value="self-employed"
                  required
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  onChange={handleChange}
                  checked={formData.createType === "self-employed"}
                />
                <span className="text-gray-700">
                  {t?.selfEmployed || "As self-employed"}
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="createType"
                  required
                  value="company"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  onChange={handleChange}
                  checked={formData.createType === "company"}
                />
                <span className="text-gray-700">
                  {t?.createCompany || "Create a company"}
                </span>
              </label>

              {formData.createType === "company" && (
                <div className="ml-7 space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="companyStructure"
                      required
                      value="alone"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      onChange={handleChange}
                      checked={formData.companyStructure === "alone"}
                    />
                    <span className="text-gray-700">
                      {t?.soleOwner || "As sole owner"}
                    </span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="companyStructure"
                      required
                      value="partners"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      onChange={handleChange}
                      checked={formData.companyStructure === "partners"}
                    />
                    <span className="text-gray-700">
                      {t?.withPartners || "With partners"}
                    </span>
                  </label>
                </div>
              )}

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  onChange={(e) =>
                    setFormData({ ...formData, needAdvice: e.target.checked })
                  }
                  checked={formData.needAdvice}
                />
                <span className="text-gray-700">
                  {t?.needAdvice || "Need advice on this choice"}
                </span>
              </label>
            </div>
          </motion.section>
        )}

        {/* Existing Business Section */}
        {formData.businessType === "assist" && (
          <motion.section variants={fadeIn} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">
              {t?.assistanceNeeded || "Assistance Needed With"}
            </h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      existingBusiness: {
                        ...formData.existingBusiness,
                        contracts: e.target.checked,
                      },
                    })
                  }
                />
                <span className="text-gray-700">
                  {t?.contracts || "Contracts"}
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      existingBusiness: {
                        ...formData.existingBusiness,
                        compliance: e.target.checked,
                      },
                    })
                  }
                />
                <span className="text-gray-700">
                  {t?.compliance || "Compliance"}
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      existingBusiness: {
                        ...formData.existingBusiness,
                        disputes: e.target.checked,
                      },
                    })
                  }
                />
                <span className="text-gray-700">
                  {t?.disputes || "Dispute resolution"}
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      existingBusiness: {
                        ...formData.existingBusiness,
                        other: e.target.checked,
                      },
                    })
                  }
                />
                <span className="text-gray-700">{t?.other || "Other"}</span>
              </label>

              {formData.existingBusiness.other && (
                <div className="ml-7">
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={t?.pleaseSpecify || "Please specify"}
                    value={formData.existingBusiness.otherText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        existingBusiness: {
                          ...formData.existingBusiness,
                          otherText: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Business Sector */}
        <motion.section variants={fadeIn} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">
            {t?.businessSector || "Business Sector"}
          </h3>
          <div>
            <input
              required
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder={
                t?.specifyBusinessSector ||
                "Please specify your business sector"
              }
              value={formData.businessSector}
              onChange={(e) =>
                setFormData({ ...formData, businessSector: e.target.value })
              }
            />
          </div>
        </motion.section>

        {/* Timeline */}
        <motion.section variants={fadeIn} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">
            {t?.timeline || "Timeline"}
          </h3>
          <div className="space-y-2">
            {[
              {
                value: "<1month",
                label: t?.lessThan1Month || "Less than 1 month",
              },
              {
                value: "1-3months",
                label: t?.oneToThreeMonths || "1-3 months",
              },
              {
                value: ">3months",
                label: t?.moreThan3Months || "More than 3 months",
              },
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="timeline"
                  required
                  value={option.value}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  onChange={handleChange}
                  checked={formData.timeline === option.value}
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </motion.section>

        {/* Other Section */}
        <motion.section variants={fadeIn} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">
            {t?.other || "Other"}
          </h3>
          <div>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder={
                t?.otherRequirements ||
                "Please specify any other requirements or information"
              }
              value={formData.other}
              onChange={(e) =>
                setFormData({ ...formData, other: e.target.value })
              }
            />
          </div>
        </motion.section>

        {/* Terms Acceptance */}
        <motion.section variants={fadeIn} className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              required
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              onChange={(e) =>
                setFormData({ ...formData, termsAccepted: e.target.checked })
              }
              checked={formData.termsAccepted}
            />
            <span className="text-gray-700">
              {t?.terms ||
                "By checking this box, I acknowledge that I have read and agree to the terms and conditions. I consent to the collection and processing of my personal data solely for the purpose of being contacted regarding my inquiry. My information will not be shared with third parties or used for any other purposes beyond this request."}
            </span>
          </label>
        </motion.section>

        <motion.div variants={fadeIn} className="pt-6">
          <button
            type="submit"
            className="w-full bg-[#039B9B] text-white px-6 py-3 rounded-lg hover:bg-[#028787] transition-colors font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : t?.submit || "Submit Request"}
          </button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default BusinessForm;