"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VscLoading } from "react-icons/vsc";
import { MdErrorOutline } from "react-icons/md";


const SuccessTick = () => (
  <motion.svg width="90" height="90" viewBox="0 0 60 60">
    <motion.path
      d="M15 32 L27 44 L45 18"
      fill="none"
      stroke="#22c55e"
      strokeWidth="5"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.7 }}
    />
  </motion.svg>
);

const ErrorCross = () => (
  <motion.svg width="90" height="90" viewBox="0 0 60 60">
    <motion.path
      d="M18 18 L42 42"
      fill="none"
      stroke="#ef4444"
      strokeWidth="5"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.3 }}
    />
    <motion.path
      d="M42 18 L18 42"
      fill="none"
      stroke="#ef4444"
      strokeWidth="5"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    />
  </motion.svg>
);

const FeedbackForm = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");
  const [inputError, setInputError] = useState({ name: false, email: false, message: false });
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const successSound = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new Audio('/applepay.wav');
    }
    return null;
  }, []);
  const errorSound = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new Audio('/game-se-2.wav');
    }
    return null;
  }, []);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newInputError = {
      name: form.name.trim() === "",
      email: form.email.trim() === "",
      message: form.message.trim() === "",
    };
    setInputError(newInputError);
    if (newInputError.name || newInputError.email || newInputError.message) {
      setLoading(false);
      return;
    }
    if (!emailRegex.test(form.email)) {
      setEmailStatus("Invalid Email");
      setLoading(false);
      return;
    }
    setLoading(true);
    setIsModalOpen(true);
    try {
      const res = await fetch("https://formspree.io/f/mjkrnabo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("Success");
        successSound?.play();
        setEmailStatus('');
        setInputError({ name: false, email: false, message: false });
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("Failed");
        errorSound?.play();
      }
    } catch (error) {
      setStatus("Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus("");
        setIsModalOpen(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setInputError({ ...inputError, [e.target.name]: false });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -80 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
    >
      <form
        onSubmit={handleSubmit}
        className="p-[1.6rem] bg-[var(--button-color)] rounded-ap [--ap-radius:3rem] text-[var(--text-color)] mx-auto flex flex-col gap-[2rem]"
      >
        <h2 className="text-[2.8rem] text-[var(--text-color)] font-[570] max-md:text-[2.4rem] flex justify-center max-[400px]:text-[1.5rem]">
          Contact Me
        </h2>
        <div className="flex flex-col gap-[1rem]">
          <input
            className={`w-[90%] mx-auto px-[0.6rem] py-[0.6rem] rounded-[12px] bg-[var(--primary-color)] autofill:bg-[var(--primary-color)] focusrLight border outline-none focus:border-1 focus:border-[var(--accent-color)] ${inputError.name ? 'border-[red]' : 'border-transparent'}`}
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
 
          />
          <input
            className={`w-[90%] mx-auto px-[0.6rem] py-[0.6rem] rounded-[12px] bg-[var(--primary-color)] autofill:bg-[var(--primary-color)] focusrLight border outline-none focus:border-1 focus:border-[var(--accent-color)] ${inputError.email ? 'border-[red]' : 'border-transparent'}`}
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}

          />
        </div>
        {emailStatus === "Invalid Email" && <div className="text-[red] flex gap-[4px] items-center mt-[-25px] px-[7%]"><MdErrorOutline className="text-[red] mb-[2px]"/>Invalid Email</div>}
        <textarea
          className={`w-[90%] mx-auto px-[0.6rem] py-[0.6rem] rounded-[12px] bg-[var(--primary-color)] autofill:bg-[var(--primary-color)] min-h-[12rem] max-h-[12rem] focusrLight border outline-none focus:border-1 focus:border-[var(--accent-color)] ${inputError.message ? 'border-[red]' : 'border-transparent'}`}
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
  
 
        />

        <motion.button
          layoutId="submit-box"
          className="mx-[5%] mb-[1rem] px-[1.7rem] py-[0.7rem] rounded-lg border-2 border-[var(--accent-color)] text-[var(--text-color)] bg-[var(--accent-color)] font-[580] cursor-pointer hoverLight soft transition-all duration-300"
          type="submit"
          disabled={loading}
          style={{
            opacity: isModalOpen ? 0 : 1,
            pointerEvents: isModalOpen ? "none" : "auto",
          }}
        >
          Submit
        </motion.button>
      </form>

      <AnimatePresence>
        {(loading || status) && (
          <motion.div
            layoutId="submit-box"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--secondary-color)] backdrop-blur-2xl w-[200px] h-[200px] mx-auto my-auto rounded-[30px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
              {loading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <VscLoading className="text-[var(--accent-color)] text-[5rem]" />
                </motion.div>
              )}
              
              {status === "Success" && (
                <>
                  <SuccessTick />
                </>
              )} 
              
              {status === "Failed" && (
                <>
                  <ErrorCross />
                </>
              )} 
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FeedbackForm;
