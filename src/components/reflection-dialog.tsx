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

export function ReflectionDialog({ isOpen, onClose, onSubmit }: ReflectionDialogProps) {
  const [rating, setRating] = useState(3);

  const handleSubmit = () => {
    onSubmit(rating);
    onClose();
  };

  const getEmojiForRating = (value: number) => {
    if (value <= 2) return <Frown className="h-8 w-8 text-destructive" />;
    if (value === 3) return <Meh className="h-8 w-8 text-yellow-500" />;
    return <Smile className="h-8 w-8 text-green-500" />;
  }

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
            <div className="mb-4 flex justify-center">
                {getEmojiForRating(rating)}
            </div>
          <Slider
            value={[rating]}
            onValueChange={(value) => setRating(value[0])}
            min={1}
            max={5}
            step={1}
            className="w-3/4 mx-auto"
          />
           <p className="text-sm text-muted-foreground mt-2">
            {['Very Unfocused', 'Unfocused', 'Neutral', 'Focused', 'Very Focused'][rating - 1]}
          </p>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save Reflection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
