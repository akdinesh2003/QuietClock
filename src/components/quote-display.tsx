"use client";

import { useState, useEffect } from "react";
import { quotes } from "@/lib/quotes";
import { Card, CardContent } from "@/components/ui/card";

export function QuoteDisplay() {
  const [quote, setQuote] = useState({ quote: "", author: "" });

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  if (!quote.quote) {
    return null;
  }

  return (
    <div className="w-full max-w-lg text-center">
      <blockquote className="text-lg md:text-xl text-muted-foreground italic">
        "{quote.quote}"
      </blockquote>
      <cite className="block text-sm text-muted-foreground/80 mt-2 not-italic">
        - {quote.author}
      </cite>
    </div>
  );
}
