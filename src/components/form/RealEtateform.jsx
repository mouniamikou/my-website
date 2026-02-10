"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import PersonalInfoForm from "./PersonalInfo";
import SuccessMessage from "../SuccessMessage";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/translations";
import { useRecaptcha } from "@/hooks/useRecaptcha";

const RealEstateForm = ({ onSubmit }) => {
  const { language } = useLanguage();
  const t =
    translations[language]?.realEstateForm || translations.en.realEstateForm;
  const { getToken } = useRecaptcha();

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      currentCountry: "",
    },
    projectStatus: "",
    transactionType: "",
    budget: "",
    projectStage: {
      searching: false,
      identifiedProperty: false,
      submittedOffer: false,
      offerAccepted: false,
      promiseSigned: false,
      deedSigned: false,
      promiseDate: "",
      deedDate: "",
    },
    sellingStage: {
      considering: false,
      listed: false,
      offerAccepted: false,
      promiseSigned: false,
      deedSigned: false,
      promiseDate: "",
      deedDate: "",
    },
    other: "",
    termsAccepted: false,
    name: "",
    propertyType: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const budgetRanges = t.budget.ranges;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const recaptchaToken = await getToken("realestate_form");

      const response = await fetch("/api/realestate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        if (onSubmit) {
          onSubmit();
        }
        setFormData({
          personalInfo: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            currentCountry: "",
          },
          projectStatus: "",
          transactionType: "",
          budget: "",
          projectStage: {
            searching: false,
            identifiedProperty: false,
            submittedOffer: false,
            offerAccepted: false,
            promiseSigned: false,
            deedSigned: false,
            promiseDate: "",
            deedDate: "",
          },
          sellingStage: {
            considering: false,
            listed: false,
            offerAccepted: false,
            promiseSigned: false,
            deedSigned: false,
            promiseDate: "",
            deedDate: "",
          },
          other: "",
          termsAccepted: false,
          name: "",
          propertyType: "",
          message: "",
        });
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
          formType="realEstate"
        />

        {/* Transaction Type Selection */}
        <motion.section variants={fadeIn} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {t.transactionType.title}
          </h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                required
                type="radio"
                name="transactionType"
                value="buy"
                className="focus:ring-[#039B9B] h-4 w-4 text-[#039B9B] border-gray-300"
                onChange={(e) =>
                  setFormData({ ...formData, transactionType: e.target.value })
                }
                checked={formData.transactionType === "buy"}
              />
              <span className="text-gray-700">{t.transactionType.buy}</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                required
                name="transactionType"
                value="sell"
                className="focus:ring-[#039B9B] h-4 w-4 text-[#039B9B] border-gray-300"
                onChange={(e) =>
                  setFormData({ ...formData, transactionType: e.target.value })
                }
                checked={formData.transactionType === "sell"}
              />
              <span className="text-gray-700">{t.transactionType.sell}</span>
            </label>
          </div>
        </motion.section>

        {/* Buying Section */}
        {formData.transactionType === "buy" && (
          <motion.section variants={fadeIn} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                {t.budget.title}
              </h3>
              <div className="space-y-2">
                {budgetRanges.map((range) => (
                  <label key={range} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="budget"
                      required
                      value={range}
                      className="focus:ring-[#039B9B] h-4 w-4 text-[#039B9B] border-gray-300"
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      checked={formData.budget === range}
                    />
                    <span className="text-gray-700">{range}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                {t.projectStage.title}
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="focus:ring-[#039B9B] h-4 w-4 text-[#039B9B] border-gray-300 rounded"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectStage: {
                          ...formData.projectStage,
                          searching: e.target.checked,
                        },
                      })
                    }
                  />
                  <span className="text-gray-700">
                    {t.projectStage.searching}
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="focus:ring-[#039B9B] h-4 w-4 text-[#039B9B] border-gray-300 rounded"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectStage: {
                          ...formData.projectStage,
                          identifiedProperty: e.target.checked,
                        },
                      })
                    }
                  />
                  <span className="text-gray-700">
                    {t.projectStage.identifiedProperty}
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="focus:ring-[#039B9B] h-4 w-4 text-[#039B9B] border-gray-300 rounded"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectStage: {
                          ...formData.projectStage,
                          submittedOffer: e.target.checked,
                        },
                      })
                    }
                  />
                  <span className="text-gray-700">
                    {t.projectStage.submittedOffer}
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="focus:ring-[#039B9B] h-4 w-4 text-[#039B9B] border-gray-300 rounded"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectStage: {
                          ...formData.projectStage,
                          offerAccepted: e.target.checked,
                        },
                      })
                    }
                  />
                  <span className="text-gray-700">
                    {t.projectStage.offerAccepted}
                  </span>
                </label>

                {formData.projectStage.offerAccepted && (
                  <div className="ml-7">
                    <label className="block text-sm font-medium text-gray-700">
                      {t.projectStage.promiseExpected}
                      <input
                        type="date"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#039B9B] focus:ring-[#039B9B]"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            projectStage: {
                              ...formData.projectStage,
                              promiseDate: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                  </div>
                )}

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="focus:ring-[#039B9B] h-4 w-4 text-[#039B9B] border-gray-300 rounded"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectStage: {
                          ...formData.projectStage,
                          promiseSigned: e.target.checked,
                        },
                      })
                    }
                  />
                  <span className="text-gray-700">
                    {t.projectStage.promiseSigned}
                  </span>
                </label>

                {formData.projectStage.promiseSigned && (
                  <div className="ml-7">
                    <label className="block text-sm font-medium text-gray-700">
                      {t.projectStage.deedExpected}
                      <input
                        type="date"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#039B9B] focus:ring-[#039B9B]"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            projectStage: {
                              ...formData.projectStage,
                              deedDate: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                  </div>
                )}

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="focus:ring-[#039B9B] h-4 w-4 text-[#039B9B] border-gray-300 rounded"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectStage: {
                          ...formData.projectStage,
                          deedSigned: e.target.checked,
                        },
                      })
                    }
                  />
                  <span className="text-gray-700">
                    {t.projectStage.deedSigned}
                  </span>
                </label>
              </div>
            </div>
          </motion.section>
        )}

        {/* Selling Section */}
        {formData.transactionType === "sell" && (
          <motion.section variants={fadeIn} className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800">
              {t.sellingStage.title}
            </h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="focus:ring-[#039B9B] h-4 w-4 text-[#039B9B] border-gray-300 rounded"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sellingStage: {
                        ...formData.sellingStage,
                        considering: e.target.checked,
                      },
                    })
                  }
                />
                <span className="text-gray-700">
                  {t.sellingStage.considering}
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="focus:ring-[#039B9B] h-4 w-4 text-[#039B9B] border-gray-300 rounded"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sellingStage: {
                        ...formData.sellingStage,
                        listed: e.target.checked,
                      },
                    })
                  }
                />
                <span className="text-gray-700">{t.sellingStage.listed}</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="focus:ring-[#039B9B] h-4 w-4 text-[#039B9B] border-gray-300 rounded"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sellingStage: {
                        ...formData.sellingStage,
                        offerReceived: e.target.checked,
                      },
                    })
                  }
                />
                <span className="text-gray-700">
                  {t.sellingStage.offerReceived}
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="focus:ring-[#039B9B] h-4 w-4 text-[#039B9B] border-gray-300 rounded"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sellingStage: {
                        ...formData.sellingStage,
                        offerAccepted: e.target.checked,
                      },
                    })
                  }
                />
                <span className="text-gray-700">
                  {t.sellingStage.offerAccepted}
                </span>
              </label>

              {formData.sellingStage.offerAccepted && (
                <div className="ml-7">
                  <label className="block text-sm font-medium text-gray-700">
                    {t.sellingStage.promiseExpected}
                    <input
                      type="date"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#039B9B] focus:ring-[#039B9B]"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sellingStage: {
                            ...formData.sellingStage,
                            promiseDate: e.target.value,
                          },
                        })
                      }
                    />
                  </label>
                </div>
              )}

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="focus:ring-[#039B9B] h-4 w-4 text-[#039B9B] border-gray-300 rounded"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sellingStage: {
                        ...formData.sellingStage,
                        promiseSigned: e.target.checked,
                      },
                    })
                  }
                />
                <span className="text-gray-700">
                  {t.sellingStage.promiseSigned}
                </span>
              </label>

              {formData.sellingStage.promiseSigned && (
                <div className="ml-7">
                  <label className="block text-sm font-medium text-gray-700">
                    {t.sellingStage.deedExpected}
                    <input
                      type="date"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#039B9B] focus:ring-[#039B9B]"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sellingStage: {
                            ...formData.sellingStage,
                            deedDate: e.target.value,
                          },
                        })
                      }
                    />
                  </label>
                </div>
              )}

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="focus:ring-[#039B9B] h-4 w-4 text-[#039B9B] border-gray-300 rounded"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sellingStage: {
                        ...formData.sellingStage,
                        deedSigned: e.target.checked,
                      },
                    })
                  }
                />
                <span className="text-gray-700">
                  {t.sellingStage.deedSigned}
                </span>
              </label>
            </div>
          </motion.section>
        )}

        {/* Other Information */}
        <motion.section variants={fadeIn} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">{t.other.title}</h3>
          <textarea
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#039B9B] focus:ring-[#039B9B]"
            placeholder={t.other.placeholder}
            value={formData.other}
            onChange={(e) =>
              setFormData({ ...formData, other: e.target.value })
            }
          />
        </motion.section>

        {/* Terms Acceptance */}
        <motion.section variants={fadeIn} className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              required
              className="focus:ring-[#039B9B] h-4 w-4 text-[#039B9B] border-gray-300 rounded"
              onChange={(e) =>
                setFormData({ ...formData, termsAccepted: e.target.checked })
              }
              checked={formData.termsAccepted}
            />
            <span className="text-gray-700">{t.terms}</span>
          </label>
        </motion.section>

        {/* Submit Button */}
        <motion.div variants={fadeIn} className="pt-6">
          <button
            type="submit"
            className="w-full bg-[#039B9B] text-white px-6 py-3 rounded-lg hover:bg-[#028787] transition-colors font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : t.submit}
          </button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default RealEstateForm;