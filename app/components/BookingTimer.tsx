'use client';

import { Alert, AlertDescription } from './ui/alert';
import { Clock } from 'lucide-react';

interface BookingTimerProps {
  timeRemaining: number; // Time remaining in seconds
  className?: string;
}

export function BookingTimer({ timeRemaining, className }: BookingTimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Change color when less than 2 minutes remaining
  const isWarning = timeRemaining < 120; // Less than 2 minutes
  const isCritical = timeRemaining < 60; // Less than 1 minute

  return (
    <Alert 
      className={`${className || ''} ${isCritical ? 'border-destructive bg-destructive/10' : isWarning ? 'border-yellow-500 bg-yellow-500/10' : ''}`}
    >
      <Clock className={`h-4 w-4 ${isCritical ? 'text-destructive' : isWarning ? 'text-yellow-600' : ''}`} />
      <AlertDescription className="flex items-center gap-2">
        <span className="font-medium">Time remaining to complete your booking:</span>
        <span className={`font-mono text-lg font-bold ${isCritical ? 'text-destructive' : isWarning ? 'text-yellow-600' : ''}`}>
          {formattedTime}
        </span>
      </AlertDescription>
    </Alert>
  );
}

