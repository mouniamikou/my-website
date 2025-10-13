"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  CheckCircle,
  AlertCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe,
} from "lucide-react";
import EUImag from "../../../public/european.png";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/translations";

const InstallationPortugal = () => {
  const [activeTab, setActiveTab] = useState("global");
  const [activeStep, setActiveStep] = useState(0);
  const [showTips, setShowTips] = useState(true);
  const [currentStep, setCurrentStep] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const timelineRef = useRef(null);
  const stepRefs = useRef([]);
  
  const { language } = useLanguage();
  const t =
    translations[language]?.installationPortugal ||
    translations.en.installationPortugal;

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

  const currentSteps = activeTab === "global" ? t.globalSteps : t.euSteps;

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
  }, [activeStep, activeTab, currentSteps]);

  useEffect(() => {
    if (isMobile && timelineRef.current && stepRefs.current[activeStep]) {
      const timeline = timelineRef.current;
      const activeStepElement = stepRefs.current[activeStep];
      
      if (activeStepElement) {
        const stepOffsetLeft = activeStepElement.offsetLeft;
        const stepWidth = activeStepElement.offsetWidth;
        const timelineWidth = timeline.offsetWidth;
        
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

  // Calculate which steps to show on mobile (current and next)
  const getVisibleSteps = () => {
    if (!isMobile) return currentSteps;
    
    const visibleSteps = [];
    // Always show current step
    if (currentSteps[activeStep]) {
      visibleSteps.push({ ...currentSteps[activeStep], originalIndex: activeStep });
    }
    // Show next step if available
    if (currentSteps[activeStep + 1]) {
      visibleSteps.push({ ...currentSteps[activeStep + 1], originalIndex: activeStep + 1 });
    }
    return visibleSteps;
  };

  if (!currentStep) return null;

  return (
    <div className="py-12 md:py-24 px-4">
      <div className="relative mb-8 md:mb-12 max-w-6xl mx-auto">
        <div
          className="absolute inset-0 z-0 rounded-xl md:rounded-none"
          style={{
            backgroundImage: "url('/passportPP.jpeg')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            opacity: "0.3",
          }}
        />

        <div className="relative z-10 py-8 md:py-12 px-6 md:px-12">
          <motion.h1
            variants={serviceVariants}
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-center text-primary-dark mb-4 md:mb-8"
          >
            {t.title}
          </motion.h1>

          <motion.p
            variants={serviceVariants}
            className="text-base md:text-xl text-center text-gray-600 mx-auto mb-6 md:mb-8 max-w-4xl"
          >
            {t.subtitle}
          </motion.p>

          <div className="flex justify-center gap-3 md:gap-6">
            <motion.button
              variants={serviceVariants}
              onClick={() => setActiveTab("global")}
              className={`flex items-center gap-1.5 px-3 md:px-4 py-2.5 rounded-xl transition-all text-sm md:text-base ${
                activeTab === "global"
                  ? "bg-[#039B9B] text-white shadow-lg"
                  : "bg-white text-primary-dark hover:text-white hover:bg-primary-dark"
              }`}
            >
              <Globe className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-semibold">{t.tabs.nonEU}</span>
            </motion.button>
            <motion.button
              variants={serviceVariants}
              onClick={() => setActiveTab("eu")}
              className={`flex items-center gap-1.5 px-3 md:px-4 py-2.5 rounded-xl transition-all text-sm md:text-base ${
                activeTab === "eu"
                  ? "bg-[#039B9B] text-white shadow-lg"
                  : "bg-white text-primary-dark hover:text-white hover:bg-primary-dark"
              }`}
            >
              <Image
                src={EUImag}
                alt="eu citizen"
                width={20}
                height={20}
                className="w-4 h-4 md:w-5 md:h-5"
              />
              <span className="font-semibold">{t.tabs.eu}</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-primary-dark">
              {t.timeline}
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
            <div 
              ref={timelineRef}
              className="relative overflow-x-auto scrollbar-hide py-4"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {isMobile ? (
                <div className="relative flex gap-8 px-4" style={{ minWidth: `${currentSteps.length * 160}px` }}>
                  {/* Progress Line for Mobile - positioned under circles */}
                  <div className="absolute top-[56px] left-0 right-0 h-0.5 bg-[#039B9B]/10 mx-4">
                    <div 
                      className="h-full bg-[#039B9B] transition-all duration-500"
                      style={{ width: `${(activeStep / (currentSteps.length - 1)) * 100}%` }}
                    />
                  </div>

                  {currentSteps.map((step, index) => {
                    const isActive = index === activeStep;
                    
                    return (
                      <motion.div
                        key={index}
                        ref={el => stepRefs.current[index] = el}
                        className={`relative flex flex-col items-center w-32 flex-shrink-0 ${
                          isActive ? "scale-110" : "scale-90"
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <button
                          onClick={() => handleStepClick(index)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center z-10
                            ${isActive ? "ring-4 ring-[#039B9B]/20 bg-[#039B9B] text-white shadow-lg" : 
                              "bg-white text-gray-400 border-2 border-gray-300"}
                            transition-all duration-300 cursor-pointer hover:shadow-lg`}
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
                /* Desktop: Show all steps */
                <div className="relative flex justify-between gap-0 px-0">
                  {/* Progress Line for Desktop - positioned under circles */}
                  <div className="absolute top-[16px] left-0 right-0 h-0.5 bg-[#039B9B]/10">
                    <div 
                      className="h-full bg-[#039B9B] transition-all duration-500"
                      style={{ width: `${(activeStep / (currentSteps.length - 1)) * 100}%` }}
                    />
                  </div>

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
              <div className="order-1">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-primary-dark" />
                  <h4 className="font-semibold text-primary-dark text-base md:text-lg">
                    {t.stepInfo.details}
                  </h4>
                </div>
                <ul className="space-y-3 md:space-y-4">
                  {currentStep.details.map((detail, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 bg-[#039B9B]/5 p-3 rounded-lg text-sm md:text-base"
                    >
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary-dark mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6 md:space-y-8 order-2">
                {showTips && (
                  <div className="bg-[#039B9B]/10 rounded-lg p-4 md:p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-primary-dark mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-primary-dark mb-2 text-sm md:text-base">
                          {t.stepInfo.tips}
                        </h4>
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                          {currentStep.tips}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary-dark" />
                    <h4 className="font-semibold text-primary-dark text-sm md:text-base">
                      {t.stepInfo.requiredDocs}
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {currentStep.requiredDocs.map((doc, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-gray-600 bg-[#039B9B]/5 p-3 rounded-lg text-sm md:text-base"
                      >
                        <div className="w-2 h-2 rounded-full bg-[#039B9B] mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div variants={serviceVariants} className="mt-12 md:mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-dark mb-6 md:mb-8">
            {t.cta?.title || "Start Your Property Journey"}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
            {t.cta?.description}
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

export default InstallationPortugal;