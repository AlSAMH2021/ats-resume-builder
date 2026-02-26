import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RotatingTextProps {
  words: string[];
  className?: string;
  interval?: number;
}

const RotatingText = ({ words, className = "", interval = 2800 }: RotatingTextProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className={`inline-flex relative overflow-hidden ${className}`} style={{ minHeight: "1.2em" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
          style={{ backgroundSize: "200% auto", animation: "gradient-shift 3s ease infinite" }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingText;
