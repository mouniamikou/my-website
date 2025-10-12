"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  Home,
  Building2,
  ClipboardCheckIcon,
  LanguagesIcon,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  FileText,
  LucideFileCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/translations";

const RealEstateServicesPage = () => {
  const { language } = useLanguage();
  const t = translations[language]?.realEstate || translations.en.realEstate;

  const [activeTab, setActiveTab] = useState("purchase");
  const [activeStep, setActiveStep] = useState(0);
  const [showTips, setShowTips] = useState(true);
  const [currentStep, setCurrentStep] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const timelineRef = useRef(null);
  const stepRefs = useRef([]);

  const serviceVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const purchaseSteps = [
    {
      title: t.purchaseSteps
        ? t.purchaseSteps[0]?.title || "PREPARATION"
        : "PREPARATION",
      description: t.purchaseSteps
        ? t.purchaseSteps[0]?.description || "Documentation & Offer"
        : "Documentation & Offer",
    },
    {
      title: t.purchaseSteps
        ? t.purchaseSteps[1]?.title || "AGREEMENT"
        : "AGREEMENT",
      description: t.purchaseSteps
        ? t.purchaseSteps[1]?.description || "Contract & Deposit"
        : "Contract & Deposit",
    },
    {
      title: t.purchaseSteps
        ? t.purchaseSteps[2]?.title || "CONDITIONS PRECEDENT"
        : "CONDITIONS PRECEDENT",
      description: t.purchaseSteps
        ? t.purchaseSteps[2]?.description || "Verification & Funding"
        : "Verification & Funding",
    },
    {
      title: t.purchaseSteps
        ? t.purchaseSteps[3]?.title || "NOTARY DEED"
        : "NOTARY DEED",
      description: t.purchaseSteps
        ? t.purchaseSteps[3]?.description || "Final Signature"
        : "Final Signature",
    },
    {
      title: t.purchaseSteps
        ? t.purchaseSteps[4]?.title || "TRANSFER"
        : "TRANSFER",
      description: t.purchaseSteps
        ? t.purchaseSteps[4]?.description || "Registration"
        : "Registration",
    },
  ];

  const saleSteps = [
    {
      title: t.saleSteps
        ? t.saleSteps[0]?.title || "PREPARATION"
        : "PREPARATION",
      description: t.saleSteps
        ? t.saleSteps[0]?.description || "Documentation & Marketing"
        : "Documentation & Marketing",
    },
    {
      title: t.saleSteps
        ? t.saleSteps[1]?.title || "NEGOTIATION"
        : "NEGOTIATION",
      description: t.saleSteps
        ? t.saleSteps[1]?.description || "Offers & Terms"
        : "Offers & Terms",
    },
    {
      title: t.saleSteps ? t.saleSteps[2]?.title || "CLOSING" : "CLOSING",
      description: t.saleSteps
        ? t.saleSteps[2]?.description || "Deed & Transfer"
        : "Deed & Transfer",
    },
  ];

  const currentSteps = activeTab === "purchase" ? purchaseSteps : saleSteps;

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setActiveStep(0);
  }, [activeTab]);

  useEffect(() => {
    if (currentSteps && activeStep >= 0) {
      setCurrentStep(currentSteps[activeStep]);
    }
  }, [activeStep, activeTab]);

  // Auto-scroll to active step on mobile
  useEffect(() => {
    if (isMobile && timelineRef.current && stepRefs.current[activeStep]) {
      const timeline = timelineRef.current;
      const activeStepElement = stepRefs.current[activeStep];
      
      if (activeStepElement) {
        const stepOffsetLeft = activeStepElement.offsetLeft;
        const stepWidth = activeStepElement.offsetWidth;
        const timelineWidth = timeline.offsetWidth;
        
        // Calculate scroll position to center the active step
        const scrollLeft = stepOffsetLeft - (timelineWidth / 2) + (stepWidth / 2);
        
        timeline.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: 'smooth'
        });
      }
    }
  }, [activeStep, isMobile]);

  const handleNext = () => {
    if (activeStep < currentSteps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  const getVisibleSteps = () => {
    if (!isMobile) return currentSteps;
    
    const visibleSteps = [];
    if (currentSteps[activeStep]) {
      visibleSteps.push({ ...currentSteps[activeStep], originalIndex: activeStep });
    }
    if (currentSteps[activeStep + 1]) {
      visibleSteps.push({ ...currentSteps[activeStep + 1], originalIndex: activeStep + 1 });
    }
    return visibleSteps;
  };

  if (!currentStep) return null;

  return (
    <div className="py-12 md:py-24 px-4">
      {/* Header Section with Background */}
      <div className="relative mb-8 md:mb-12 max-w-6xl mx-auto">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 rounded-xl md:rounded-none"
          style={{
            backgroundImage:
              "url('/core-architects_portuguese-architecture99-1160x613.jpg')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            opacity: "0.3",
          }}
        />

        {/* Header Content */}
        <div className="relative z-10 py-8 md:py-12 px-6 md:px-12">
        <motion.h1
            variants={serviceVariants}
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-center text-primary-dark mb-4 md:mb-8 leading-tight"
          >
            {t.title}
          </motion.h1>

          <motion.p
            variants={serviceVariants}
            className="text-base md:text-xl text-center text-gray-600 mx-auto mb-8 md:mb-16 max-w-3xl"
          >
            {t.subtitle}
          </motion.p>

          {/* Service Type Tabs */}
          <div className="flex justify-center gap-3 md:gap-6">
            <motion.button
              variants={serviceVariants}
              onClick={() => setActiveTab("purchase")}
              className={`flex items-center gap-1.5 px-3 md:px-4 py-2.5 rounded-xl transition-all text-sm md:text-base ${
                activeTab === "purchase"
                  ? "bg-[#039B9B] text-white shadow-lg"
                  : "bg-white text-primary-dark hover:text-white hover:bg-primary-dark"
              }`}
            >
              <Home className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-semibold">
                {t.purchase?.title || "Purchase"}
              </span>
            </motion.button>
            <motion.button
              variants={serviceVariants}
              onClick={() => setActiveTab("sale")}
              className={`flex items-center gap-1.5 px-3 md:px-4 py-2.5 rounded-xl transition-all text-sm md:text-base ${
                activeTab === "sale"
                  ? "bg-[#039B9B] text-white shadow-lg"
                  : "bg-white text-primary-dark hover:text-white hover:bg-primary-dark"
              }`}
            >
              <Building2 className="w-4 h-4 md:w-6 md:h-6" />
              <span className="font-semibold">{t.sale?.title || "Sale"}</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-primary-dark">
              {t.timeline || "Process Timeline"}
            </h2>
            <button
              onClick={() => setShowTips(!showTips)}
              className="p-2 rounded-full hover:bg-[#039B9B]/10 transition-colors"
            >
              <Info
                className={`w-5 h-5 md:w-6 md:h-6 ${showTips ? "text-primary-dark" : "text-gray-400"}`}
              />
            </button>
          </div>

          {/* Timeline */}
          <div className="relative mb-6 md:mb-12">
            <div className="absolute top-4 left-0 w-full h-1 bg-[#039B9B]/10 hidden md:block" />
            <div 
              className="absolute top-4 left-0 h-1 bg-[#039B9B] transition-all duration-500 hidden md:block"
              style={{ width: `${((activeStep + 1) / currentSteps.length) * 100}%` }}
            />

            <div 
              ref={timelineRef}
              className="relative overflow-x-auto scrollbar-hide pb-4"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {isMobile ? (
                <div className="flex gap-8 px-4 justify-center">
                  {getVisibleSteps().map((step, displayIndex) => {
                    const index = step.originalIndex;
                    const isActive = index === activeStep;
                    const isNext = index === activeStep + 1;
                    
                    return (
                      <motion.div
                        key={index}
                        ref={el => stepRefs.current[index] = el}
                        className={`relative flex flex-col items-center w-32 flex-shrink-0 ${
                          isActive ? "scale-110" : "scale-90"
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: displayIndex * 0.1 }}
                      >
                        <button
                          onClick={() => isActive || isNext ? handleStepClick(index) : null}
                          disabled={!isActive && !isNext}
                          className={`w-12 h-12 rounded-full flex items-center justify-center z-10
                            ${isActive ? "ring-4 ring-[#039B9B]/20 bg-[#039B9B] text-white shadow-lg" : 
                              isNext ? "bg-white text-gray-400 border-2 border-gray-300" :
                              "bg-white text-gray-400 border-2 border-gray-400"}
                            transition-all duration-300 ${(isActive || isNext) ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed opacity-50'}`}
                        >
                          <span className="font-bold text-base">{index + 1}</span>
                        </button>

                        <div
                          className={`text-center mt-4 transition-colors duration-300 ${
                            isActive ? "text-primary-dark" : "text-gray-500"
                          }`}
                        >
                          <h3 className={`font-bold mb-1 leading-tight ${
                            isActive ? "text-sm" : "text-xs"
                          }`}>
                            {step.title}
                          </h3>
                          <p className={`opacity-80 leading-tight ${
                            isActive ? "text-xs" : "text-[10px]"
                          }`}>
                            {step.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex justify-between gap-0 px-0">
                  {currentSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      ref={el => stepRefs.current[index] = el}
                      className={`relative flex flex-col items-center w-40 sm:w-48 ${
                        index === activeStep ? "scale-105" : ""
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <button
                        onClick={() => handleStepClick(index)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center z-10
                          ${index <= activeStep ? "text-primary-dark" : "text-gray-400"} 
                          ${index === activeStep ? "ring-4 ring-[#039B9B]/20 bg-[#039B9B] text-white" : "bg-white"}
                          border-2 border-current
                          transition-all duration-300 cursor-pointer hover:shadow-lg`}
                      >
                        <span className="font-medium text-sm">{index + 1}</span>
                      </button>

                      <div
                        className={`text-center mt-4 transition-colors duration-300 ${
                          index === activeStep ? "text-primary-dark" : "text-gray-600"
                        }`}
                      >
                        <h3 className="font-bold text-xs sm:text-sm mb-1 leading-tight">
                          {step.title}
                        </h3>
                        <p className="text-xs opacity-80 leading-tight">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-3 md:flex md:justify-between md:gap-4 mb-6 md:mb-8">
            <button
              onClick={handlePrevious}
              disabled={activeStep === 0}
              className={`px-4 py-3 rounded-lg transition-all flex items-center gap-2 text-sm md:text-base justify-center ${
                activeStep > 0
                  ? "bg-[#039B9B] text-white hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.stepAction?.previous || "Previous"}</span>
            </button>
            <button
              onClick={handleNext}
              disabled={activeStep === currentSteps.length - 1}
              className={`px-4 py-3 rounded-lg transition-all flex items-center gap-2 text-sm md:text-base justify-center ${
                activeStep < currentSteps.length - 1
                  ? "bg-[#039B9B] text-white hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <span>{t.stepAction?.next || "Next"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 md:grid md:grid-cols-2 md:gap-8 md:space-y-0"
            >
              {/* Details Section */}
              <div className="order-1">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <LucideFileCheck className="w-5 h-5 md:w-6 md:h-6 text-primary-dark" />
                  <h4 className="font-semibold text-primary-dark text-base md:text-lg">
                    {t.stepInfo?.details || "Key Tasks"}
                  </h4>
                </div>
                <ul className="space-y-3 md:space-y-4">
                  {t[activeTab === "purchase" ? "purchaseSteps" : "saleSteps"]?.[
                    activeStep
                  ]?.details?.map((detail, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 bg-[#039B9B]/5 p-3 rounded-lg text-sm md:text-base"
                    >
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary-dark mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  )) || (
                    <li className="flex items-start gap-3 bg-[#039B9B]/5 p-3 rounded-lg text-sm md:text-base">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary-dark mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Step details will be loaded here</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Tips and Documents Section */}
              <div className="space-y-6 md:space-y-8 order-2">
                {/* Tips */}
                {showTips && (
                  <div className="bg-[#039B9B]/10 rounded-lg p-4 md:p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-primary-dark mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-primary-dark mb-2 text-sm md:text-base">
                          {t.stepInfo?.tips || "Helpful Tip"}
                        </h4>
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                          {t[activeTab === "purchase" ? "purchaseSteps" : "saleSteps"]?.[
                            activeStep
                          ]?.tips || "Important considerations for this step will be shown here."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Required Documents */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary-dark" />
                    <h4 className="font-semibold text-primary-dark text-sm md:text-base">
                      {t.stepInfo?.requiredDocs || "Required Documents"}
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {t[activeTab === "purchase" ? "purchaseSteps" : "saleSteps"]?.[
                      activeStep
                    ]?.requiredDocs?.map((doc, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-gray-600 bg-[#039B9B]/5 p-3 rounded-lg text-sm md:text-base"
                      >
                        <div className="w-2 h-2 rounded-full bg-[#039B9B] mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{doc}</span>
                      </li>
                    )) || (
                      <li className="flex items-start gap-3 text-gray-600 bg-[#039B9B]/5 p-3 rounded-lg text-sm md:text-base">
                        <div className="w-2 h-2 rounded-full bg-[#039B9B] mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">Required documents will be listed here</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Representation Options */}
          <motion.section className="my-12 md:my-16">
            <div className="flex items-center justify-center mb-6 md:mb-8">
              <UserIcon className="w-8 h-8 md:w-10 md:h-10 text-primary-dark mr-3 md:mr-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {t.representationOptions?.title || "Representation Options"}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 md:p-6 border border-gray-300">
                <div className="flex items-center mb-4">
                  <ClipboardCheckIcon className="w-6 h-6 md:w-8 md:h-8 text-primary-dark mr-3" />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                    {t.representationOptions?.inPerson?.title ||
                      "In-Person Support"}
                  </h3>
                </div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {t.representationOptions?.inPerson?.description ||
                    "Comprehensive legal presence throughout your property journey in Portugal. I personally attend all key meetings and signings, ensuring you have expert guidance at every critical moment, from first viewing to final handover. This option provides maximum security and support, especially recommended for first-time investors in Portuguese Real Estate."}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 md:p-6 border border-gray-300">
                <div className="flex items-center mb-4">
                  <LanguagesIcon className="w-6 h-6 md:w-8 md:h-8 text-primary-dark mr-3" />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                    {t.representationOptions?.remote?.title ||
                      "Remote Representation"}
                  </h3>
                </div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {t.representationOptions?.remote?.description ||
                    "Full legal protection and oversight for clients unable to be physically present in Portugal. Through secure power of attorney arrangements, I handle all aspects of your transaction with the same attention to detail as if you were present. Regular video consultations and detailed documentation keep you informed and in control throughout the process, regardless of your location."}
                </p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* CTA Section */}
        <motion.div variants={serviceVariants} className="mt-12 md:mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-dark mb-6 md:mb-8">
            {t.cta?.title || "Start Your Property Journey"}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
            {t.cta?.description ||
              "Whether buying or selling property in Portugal, navigating the legal complexities requires expert guidance. From initial preparation to final registration, I provide comprehensive legal support to protect your interests and ensure a smooth transaction. Let's discuss your specific situation and create a tailored strategy for your Portuguese real estate journey."}
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default RealEstateServicesPage;