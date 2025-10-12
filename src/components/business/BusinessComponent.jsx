"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  Building,
  Scale,
  FileCheck,
  Users,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/translations";

const BusinessFormationService = () => {
  const { language } = useLanguage();
  const t = translations[language]?.business || translations.en.business;

  const [activeStep, setActiveStep] = useState(0);
  const [showTips, setShowTips] = useState(true);
  const [currentStep, setCurrentStep] = useState(null);
  const [steps, setSteps] = useState([]);
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
    // Recreate the steps array when language changes
    if (t?.steps) {
      const newSteps = [
        {
          title: t.steps[0]?.title || "Preparation",
          description: t.steps[0]?.description || "Initial Setup",
          icon: <Download className="w-6 h-6 text-[#039B9B]" />,
          duration: "1-2 weeks",
          details: t.steps[0]?.details || ["Initial setup tasks"],
          tips: t.steps[0]?.tips || "Important preparation considerations",
          requiredDocs: t.steps[0]?.requiredDocs || ["Required documents"],
        },
        {
          title: t.steps[1]?.title || "Registration",
          description: t.steps[1]?.description || "Company Registration",
          icon: <Building className="w-6 h-6 text-[#039B9B]" />,
          duration: "1-2 weeks",
          details: t.steps[1]?.details || ["Registration tasks"],
          tips: t.steps[1]?.tips || "Registration considerations",
          requiredDocs: t.steps[1]?.requiredDocs || ["Registration documents"],
        },
        {
          title: t.steps[2]?.title || "Documentation",
          description: t.steps[2]?.description || "Legal Documentation",
          icon: <FileCheck className="w-6 h-6 text-[#039B9B]" />,
          duration: "1-3 business days",
          details: t.steps[2]?.details || ["Documentation tasks"],
          tips: t.steps[2]?.tips || "Documentation tips",
          requiredDocs: t.steps[2]?.requiredDocs || ["Legal documents"],
        },
        {
          title: t.steps[3]?.title || "Team Setup",
          description: t.steps[3]?.description || "Team Formation",
          icon: <Users className="w-6 h-6 text-[#039B9B]" />,
          duration: "1-2 weeks",
          details: t.steps[3]?.details || ["Team setup tasks"],
          tips: t.steps[3]?.tips || "Team formation tips",
          requiredDocs: t.steps[3]?.requiredDocs || ["Team documents"],
        },
        {
          title: t.steps[4]?.title || "Compliance",
          description: t.steps[4]?.description || "Legal Compliance",
          icon: <Scale className="w-6 h-6 text-[#039B9B]" />,
          duration: "1-2 weeks",
          details: t.steps[4]?.details || ["Compliance tasks"],
          tips: t.steps[4]?.tips || "Compliance considerations",
          requiredDocs: t.steps[4]?.requiredDocs || ["Compliance documents"],
        },
      ];
      setSteps(newSteps);
    }
  }, [language, t]);

  useEffect(() => {
    if (steps.length > 0) {
      setCurrentStep(steps[activeStep]);
    }
  }, [activeStep, steps]);

  // Auto-scroll to active step on mobile
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
    if (activeStep < steps.length - 1) {
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

  if (!currentStep || steps.length === 0) return null;

  return (
    <div className="py-12 md:py-24 px-4">
      {/* Header Section with Background */}
      <div className="relative mb-8 md:mb-12 max-w-6xl mx-auto">
        <div
          className="absolute inset-0 z-0 rounded-xl md:rounded-none"
          style={{
            backgroundImage: "url('/passportPP.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: "0.3",
          }}
        />

        <div className="relative z-10 py-8 md:py-12 px-6 md:px-12">
          <motion.h1
            variants={serviceVariants}
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-center text-primary-dark mb-4 md:mb-8"
          >
            {t.formationPackage?.title || "Business Formation Package"}
          </motion.h1>
          <motion.p
            variants={serviceVariants}
            className="text-base md:text-xl text-center text-gray-600 max-w-3xl mx-auto mb-8 md:mb-16"
          >
            {t.formationPackage?.subtitle || "Comprehensive business formation services to get your company started in Portugal"}
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-primary-dark">
              {t.formationProcess || "Formation Process"}
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
            <div className="absolute top-8 left-0 w-full h-1 bg-[#039B9B]/10 hidden md:block" />
            <div 
              className="absolute top-8 left-0 h-1 bg-[#039B9B] transition-all duration-500 hidden md:block"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            />

            <div 
              ref={timelineRef}
              className="relative overflow-x-auto scrollbar-hide pb-4"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <div className="flex md:justify-between gap-4 md:gap-0 px-4 md:px-0" style={{ minWidth: isMobile ? `${steps.length * 200}px` : 'auto' }}>
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    ref={el => stepRefs.current[index] = el}
                    className={`relative flex flex-col items-center group ${
                      isMobile ? 'w-48 flex-shrink-0' : 'w-40 sm:w-48'
                    } ${
                      index === activeStep ? "scale-105" : ""
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => handleStepClick(index)}
                      className={`w-8 h-8 mt-1 rounded-full flex items-center justify-center
                        ${index <= activeStep ? "text-primary-dark" : "text-gray-400"} 
                        ${index === activeStep ? "ring-4 ring-[#039B9B]/20 bg-[#039B9B] text-white" : "bg-white"}
                        border-2 border-current
                        transition-all duration-300 cursor-pointer group-hover:shadow-lg`}
                    >
                      <span className="font-medium text-sm">{index + 1}</span>
                    </button>

                    {isMobile && index < steps.length - 1 && (
                      <div className="absolute top-4 left-12 w-32 h-0.5 bg-[#039B9B]/20">
                        <div 
                          className={`h-full bg-[#039B9B] transition-all duration-500 ${
                            index < activeStep ? 'w-full' : 'w-0'
                          }`}
                        />
                      </div>
                    )}

                    <div
                      className={`text-center mt-4 transition-colors duration-300 ${
                        index === activeStep
                          ? "text-primary-dark"
                          : "text-gray-600"
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
              disabled={activeStep === steps.length - 1}
              className={`px-4 py-3 rounded-lg transition-all flex items-center gap-2 text-sm md:text-base justify-center ${
                activeStep < steps.length - 1
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
                  {currentStep.icon}
                  <h4 className="font-semibold text-primary-dark text-base md:text-lg">
                    {t.stepInfo?.details || "Key Tasks"}
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

              {/* Tips and Documents Section */}
              <div className="space-y-6 md:space-y-8 order-2">
                {showTips && (
                  <div className="bg-[#039B9B]/10 rounded-lg p-4 md:p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-primary-dark mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-primary-dark mb-2 text-sm md:text-base">
                          {t.stepInfo?.tips || "Helpful Tips"}
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
                      {t.stepInfo?.requiredDocs || "Required Documents"}
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

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 md:mt-16 text-center"
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#039B9B] mb-4">
            {t.cta?.title || "Ready to Start Your Business?"}
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            {t.cta?.description || "Get comprehensive support for establishing your business in Portugal with our expert legal guidance."}
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

export default BusinessFormationService;