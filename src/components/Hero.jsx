"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function Hero() {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <div className="relative  bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="absolute inset-0">
        <Image
          width={900}
          height={100}
          src="/portugal-4828134_1280.jpg"
          alt={t.imageAlt.lisbon}
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl lg:text-5xl font-bold text-gray-900 sm:mt-36 mb-8"
            >
            Dr  {t.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base lg:text-xl text-gray-600 max-w-3xl mb-8"
            >
              {t.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                href="https://calendly.com/mouniamikou/discovery-call"
                className="bg-primary text-white px-2 lg:px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                {t.cta}
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <Image
              width={900}
              height={100}
              src="/photo_2024-12-13_11-33-38.jpg"
              alt={t.imageAlt.profile}
              className="rounded-2xl mb-4 shadow-xl w-full max-w-md mx-auto"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}