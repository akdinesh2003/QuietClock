"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Smile, Frown, Meh } from 'lucide-react';

interface ReflectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
}

const focusLevels = [
  { rating: 1, label: 'Very Unfocused', icon: <Frown className="h-8 w-8 text-red-500" />, color: 'text-red-500' },
  { rating: 2, label: 'Unfocused', icon: <Frown className="h-8 w-8 text-orange-500" />, color: 'text-orange-500' },
  { rating: 3, label: 'Neutral', icon: <Meh className="h-8 w-8 text-yellow-500" />, color: 'text-yellow-500' },
  { rating: 4, label: 'Focused', icon: <Smile className="h-8 w-8 text-green-500" />, color: 'text-green-500' },
  { rating: 5, label: 'Very Focused', icon: <Smile className="h-8 w-8 text-emerald-500" />, color: 'text-emerald-500' },
];


export function ReflectionDialog({ isOpen, onClose, onSubmit }: ReflectionDialogProps) {
  const [rating, setRating] = useState(3);

  const handleSubmit = () => {
    onSubmit(rating);
    onClose();
  };
  
  const currentFocusLevel = focusLevels[rating - 1];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session Complete!</DialogTitle>
          <DialogDescription>
            Take a moment to reflect on your focus level during the last session.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 text-center">
            <div className="mb-4 flex justify-center h-8">
                {currentFocusLevel.icon}
            </div>
          <Slider
            value={[rating]}
            onValueChange={(value) => setRating(value[0])}
            min={1}
            max={5}
            step={1}
            className="w-3/4 mx-auto"
          />
           <p className={`text-sm font-medium mt-3 ${currentFocusLevel.color}`}>
            {currentFocusLevel.label}
          </p>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save Reflection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
