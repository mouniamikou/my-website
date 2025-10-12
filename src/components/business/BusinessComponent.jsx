"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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

// Icon mapping outside component to prevent recreation
const ICON_MAP = {
  0: Download,
  1: Building,
  2: FileCheck,
  3: Users,
  4: Scale,
};

const BusinessFormationService = () => {
  const { language } = useLanguage();
  const t = translations[language]?.business || translations.en.business;

  const [activeStep, setActiveStep] = useState(0);
  const [showTips, setShowTips] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const timelineRef = useRef(null);
  const stepRefs = useRef([]);

  // Memoized service variants to prevent recreation
  const serviceVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }), []);

  // Memoize steps creation - only recreate when translations actually change
  const steps = useMemo(() => {
    if (!t?.steps || !Array.isArray(t.steps)) return [];
    
    return t.steps.map((step, index) => {
      const IconComponent = ICON_MAP[index] || Download;
      return {
        title: step?.title || "",
        description: step?.description || "",
        icon: <IconComponent className="w-6 h-6 text-[#039B9B]" />,
        duration: step?.duration || "1-2 weeks",
        details: step?.details || [],
        tips: step?.tips || "",
        requiredDocs: step?.requiredDocs || [],
      };
    });
  }, [t?.steps]);

  // Memoize current step
  const currentStep = useMemo(() => 
    steps[activeStep] || null,
    [steps, activeStep]
  );

  // Memoize visible steps for mobile
  const visibleSteps = useMemo(() => {
    if (!isMobile) return steps;
    
    const visible = [];
    if (steps[activeStep]) {
      visible.push({ ...steps[activeStep], originalIndex: activeStep });
    }
    if (steps[activeStep + 1]) {
      visible.push({ ...steps[activeStep + 1], originalIndex: activeStep + 1 });
    }
    return visible;
  }, [isMobile, steps, activeStep]);

  // Mobile detection effect
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Debounced auto-scroll effect
  useEffect(() => {
    if (!isMobile || !timelineRef.current || !stepRefs.current[activeStep]) {
      return;
    }

    const timeoutId = setTimeout(() => {
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
    }, 50); // Debounce by 50ms

    return () => clearTimeout(timeoutId);
  }, [activeStep, isMobile]);

  // Memoized handlers
  const handleNext = useCallback(() => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  }, [activeStep, steps.length]);

  const handlePrevious = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  }, [activeStep]);

  const handleStepClick = useCallback((index) => {
    setActiveStep(index);
  }, []);

  const toggleTips = useCallback(() => {
    setShowTips(prev => !prev);
  }, []);

  // Early return if no steps available
  // if (!currentStep || steps.length === 0) {
  //   return (
  //     <div className="py-12 md:py-24 px-4">
  //       <div className="max-w-6xl mx-auto text-center">
  //         <p className="text-gray-600">Loading business formation steps...</p>
  //       </div>
  //     </div>
  //   );
  // }
  if (!currentStep) return null;

  return (
    <div className="py-12 md:py-24 px-4">
      {/* Header Section with Background */}
      <div className="relative mb-8 md:mb-12 max-w-6xl mx-auto">
        <div
          className="absolute inset-0 z-0 rounded-xl md:rounded-none"
          style={{
            backgroundImage: "url('/bussImg.png')",
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
              onClick={toggleTips}
              className="p-2 rounded-full hover:bg-[#039B9B]/10 transition-colors"
              aria-label={showTips ? "Hide tips" : "Show tips"}
            >
              <Info
                className={`w-5 h-5 md:w-6 md:h-6 ${showTips ? "text-primary-dark" : "text-gray-400"}`}
              />
            </button>
          </div>

          {/* Timeline */}
          <div className="relative mb-6 md:mb-12">
            {/* Desktop Progress Line */}
            <div className="absolute top-4 left-0 w-full h-1 bg-[#039B9B]/10 hidden md:block" />
            <div 
              className="absolute top-4 left-0 h-1 bg-[#039B9B] transition-all duration-500 hidden md:block"
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
              {isMobile ? (
                <div className="flex gap-8 px-4 justify-center">
                  {visibleSteps.map((step, displayIndex) => {
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
                          onClick={() => (isActive || isNext) ? handleStepClick(index) : null}
                          disabled={!isActive && !isNext}
                          className={`w-12 h-12 rounded-full flex items-center justify-center z-10
                            ${isActive ? "ring-4 ring-[#039B9B]/20 bg-[#039B9B] text-white shadow-lg" : 
                              isNext ? "bg-white text-gray-400 border-2 border-gray-300" :
                              "bg-white text-gray-400 border-2 border-gray-400"}
                            transition-all duration-300 ${(isActive || isNext) ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed opacity-50'}`}
                          aria-label={`Step ${index + 1}: ${step.title}`}
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
                  {steps.map((step, index) => (
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
                        aria-label={`Step ${index + 1}: ${step.title}`}
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
              aria-label="Previous step"
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
              aria-label="Next step"
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
              transition={{ duration: 0.3 }}
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
          transition={{ delay: 0.3 }}
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