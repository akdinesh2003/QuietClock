"use client";

import { useState, useEffect, useCallback } from "react";
import { quotes } from "@/lib/quotes";
import { AnimatePresence, motion } from "framer-motion";

export function QuoteDisplay() {
  const [index, setIndex] = useState(0);

  const nextQuote = useCallback(() => {
    setIndex((prevIndex) => (prevIndex + 1) % quotes.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextQuote, 10000); 
    return () => clearInterval(interval);
  }, [nextQuote]);

  const quote = quotes[index];

  if (!quote.quote) {
    return null;
  }

  return (
    <div className="w-full max-w-lg text-center h-24 flex flex-col justify-center">
       <AnimatePresence mode="wait">
        <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
          <blockquote className="text-lg md:text-xl text-muted-foreground italic">
            "{quote.quote}"
          </blockquote>
          <cite className="block text-sm text-muted-foreground/80 mt-2 not-italic">
            - {quote.author}
          </cite>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
