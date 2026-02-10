"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/translations";
import PersonalInfoForm from "./PersonalInfo";
import { useRouter } from "next/navigation";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import SuccessMessage from "../SuccessMessage";

const FormHandler = ({ formType, FormComponent }) => {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language]?.mainForm || translations.en.mainForm;
  const { getToken } = useRecaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      currentCountry: "",
    },
    projectStatus: "",
    serviceType: formType,
    [formType]: {},
    otherDetails: "",
    additionalInfo: "",
    termsAccepted: false,
  });

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const recaptchaToken = await getToken("general_form");

      const response = await fetch("/api/general", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setSubmitStatus("error");
        throw new Error(result.error || "Failed to send email");
      }
      setSubmitStatus("success");
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return <SuccessMessage />;
  }

  return (
    <motion.section variants={fadeIn} className="space-y-6">
      {formType === "other" ? (
        <>
          <motion.form
            initial="hidden"
            animate="visible"
            className="space-y-8 max-w-4xl mx-auto"
            onSubmit={handleSubmit}
          >
            <PersonalInfoForm
              formData={formData}
              onFormDataChange={setFormData}
            />
            <h2 className="text-xl font-semibold text-gray-800">
              {t.otherServices.title}
            </h2>
            <div>
              <textarea
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#039B9B] focus:ring-[#039B9B] min-h-[200px]"
                placeholder={t.otherServices.placeholder}
                value={formData.otherDetails}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    otherDetails: e.target.value,
                  })
                }
              />
            </div>
            {/* Terms Acceptance */}
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  required
                  className="focus:ring-[#039B9B] h-4 w-4 text-[#039B9B] border-gray-300 rounded"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      termsAccepted: e.target.checked,
                    })
                  }
                  checked={formData.termsAccepted}
                />
                <span className="text-gray-700">{t.termsAndConditions}</span>
              </label>
            </div>

            <div className="flex flex-col space-y-4">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#039B9B] text-white px-6 py-3 rounded-lg hover:bg-[#028787] transition-colors font-semibold"
              >
                {isSubmitting ? "Submitting..." : t.buttons.submit}
              </motion.button>

              <motion.button
                type="button"
                className="w-full bg-gray-100 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                onClick={() => router.push("/contact")}
              >
                {t.buttons.back}
              </motion.button>
            </div>
          </motion.form>
        </>
      ) : (
        <FormComponent
          formData={formData[formType]}
          onFormDataChange={(specificFormData) =>
            setFormData({
              ...formData,
              [formType]: specificFormData,
            })
          }
          onSubmit={() => {
            window.scrollTo(0, 0);
          }}
        />
      )}
    </motion.section>
  );
};

export default FormHandler;