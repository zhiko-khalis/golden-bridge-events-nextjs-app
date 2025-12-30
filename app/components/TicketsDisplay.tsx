'use client';

import { Ticket } from '../types/concert';
import { TicketDisplay } from './TicketDisplay';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { CheckCircle, Home, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface TicketsDisplayProps {
  tickets: Ticket[];
  onBackToHome: () => void;
}

export function TicketsDisplay({ tickets, onBackToHome }: TicketsDisplayProps) {
  const { isAdmin } = useAuth();
  const ticketsContainerRef = useRef<HTMLDivElement>(null);

  const handleDownloadAllPDFs = async () => {
    if (!ticketsContainerRef.current) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const ticketElements = ticketsContainerRef.current.querySelectorAll('[data-ticket-element]');

      for (let i = 0; i < ticketElements.length; i++) {
        const wrapperElement = ticketElements[i] as HTMLElement;
        // Find the actual ticket content div (the one with the ticket styling)
        const ticketElement = wrapperElement.querySelector('.bg-white.rounded-lg') as HTMLElement;
        
        if (!ticketElement) continue;
        
        // Create canvas from the ticket element
        const canvas = await html2canvas(ticketElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        // Calculate dimensions
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const pdfWidth = 210; // A4 width in mm
        const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

        // Add new page for each ticket (except the first one)
        if (i > 0) {
          pdf.addPage();
        }

        // Add image to PDF
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      // Save PDF
      pdf.save(`tickets-${tickets[0]?.bookingReference || 'all'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const bookingRef = tickets[0]?.bookingReference || `BK${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-500" />
          </div>
          <h1 className="mb-2">{isAdmin ? 'Tickets Generated!' : 'Payment Successful!'}</h1>
          <p className="text-lg text-muted-foreground mb-2">
            {isAdmin ? 'Tickets have been generated (Cash Payment)' : 'Your tickets are ready'}
          </p>
          <p className="text-sm text-muted-foreground">
            Booking reference: <span className="font-mono font-semibold">{bookingRef}</span>
          </p>
        </div>

        {/* Download All Button */}
        {tickets.length > 1 && (
          <div className="mb-6 flex justify-center">
            <Button onClick={handleDownloadAllPDFs} variant="outline" size="lg" className="gap-2">
              <Download className="w-4 h-4" />
              Download All Tickets as PDF
            </Button>
          </div>
        )}

        {/* Tickets Display */}
        <div ref={ticketsContainerRef} className="space-y-6 mb-8">
          {tickets.map((ticket, index) => (
            <div key={ticket.id} data-ticket-element>
              <TicketDisplay ticket={ticket} showDownloadButton={true} />
            </div>
          ))}
        </div>

        {/* Info Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="mb-4">Important Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Your tickets have been sent to your email address</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Please arrive at least 30 minutes before the event starts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Present your ticket (digital or printed) at the venue entrance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Keep your booking reference for any inquiries</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Back to Home Button */}
        <div className="flex justify-center">
          <Button onClick={onBackToHome} size="lg" className="gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

