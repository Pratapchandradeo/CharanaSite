import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import JagannathLogo from "../common/JagannathLogo"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "ମୁଖ୍ୟ ପୃଷ୍ଠା", nameEn: "Home", path: "/" },
    { name: "ଚିତ୍ର ଗ୍ୟାଲେରୀ", nameEn: "Gallery", path: "/gallery" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md shadow-[0_0_20px_rgba(255,0,0,0.4)] border-b border-red-600"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* 🔴 Jagannath Face Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <JagannathLogo size="md" />

            {/* Text */}
            <div>
              <span className="text-xl font-bold text-[#fbb829] block leading-tight">
                ଜଗନ୍ନାଥ
              </span>
              <span className="text-xs text-white/80 block">ଭକ୍ତି ମାର୍ଗ</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-white hover:text-[#fbb829] transition-all duration-300 relative group ${
                  location.pathname === link.path
                    ? "text-[#fbb829] drop-shadow-[0_0_6px_#fbb829]"
                    : ""
                }`}
              >
                <span className="block text-lg">{link.name}</span>
                <span className="block text-xs opacity-75">{link.nameEn}</span>

                {location.pathname === link.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#fbb829]"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* 🔻 Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-black border border-red-600 rounded-lg shadow-[0_0_20px_rgba(255,0,0,0.5)] absolute left-4 right-4 p-4"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block py-3 px-4 text-white hover:bg-[#fbb829] hover:text-black rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="block text-lg">{link.name}</span>
                  <span className="block text-sm opacity-75">
                    {link.nameEn}
                  </span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
