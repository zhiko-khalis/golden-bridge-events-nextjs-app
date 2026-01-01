'use client';

import { useRef } from 'react';
import { Ticket } from '../types/concert';
import { Calendar, Clock, MapPin, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from './ui/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Image from 'next/image';

interface TicketDisplayProps {
  ticket: Ticket;
  showDownloadButton?: boolean;
}

// Simple barcode component using CSS
function Barcode({ value }: { value: string }) {
  // Generate bars based on the ticket number
  const generateBars = (text: string) => {
    const bars: number[] = [];
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      // Create varying bar widths based on character code
      bars.push((charCode % 3) + 1);
    }
    return bars;
  };

  const bars = generateBars(value);

  return (
    <div className="flex items-center justify-center gap-[1px] bg-white p-1.5">
      {bars.map((width, index) => (
        <div
          key={index}
          className="bg-black"
          style={{
            width: `${width}px`,
            height: '30px'
          }}
        />
      ))}
    </div>
  );
}

export function TicketDisplay({ ticket, showDownloadButton = false }: TicketDisplayProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const eventDate = new Date(ticket.concert.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;

    try {
      // Create canvas from the ticket element
      const canvas = await html2canvas(ticketRef.current, {
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

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Save PDF
      pdf.save(`ticket-${ticket.ticketNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      {showDownloadButton && (
        <div className="flex justify-end">
          <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      )}
      <div ref={ticketRef} className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
      {/* Blue Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
          <div className="flex items-start gap-3">
            {/* Company Logo */}
            <div className="shrink-0">
              <Image
                src="/GOLDEN BRIDGE OFFICIAL LOGO.svg"
                alt="Golden Bridge Events Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold mb-1">{ticket.userDetails.firstName} {ticket.userDetails.lastName}</h2>
              <p className="text-blue-100 text-sm">{ticket.userDetails.email}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <div className="flex items-center gap-1 justify-end">
              <Calendar className="w-4 h-4" />
              <span className="font-medium text-sm">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <Clock className="w-4 h-4" />
              <span className="font-medium text-sm">{ticket.concert.time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* White Main Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-3">
            {/* Event Image/Description Section */}
            <div className="flex gap-3">
              <Image 
                src={ticket.concert.image.startsWith('/') ? ticket.concert.image : `/${ticket.concert.image}`}
                alt={ticket.concert.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-lg border border-gray-300 object-cover shrink-0"
              />
              <div className="flex-1">
                <h3 className="font-bold text-base mb-1">{ticket.concert.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Don&apos;t miss this incredible live performance featuring amazing music and entertainment.
                </p>
              </div>
            </div>

            {/* Ticket Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">SECTION</p>
                <p className="font-semibold text-base">{ticket.ticketType.name}</p>
              </div>
              {ticket.seat ? (
                <>
                <div>
                    <p className="text-xs text-muted-foreground mb-0.5">PRICE</p>
                    <p className="font-semibold text-base">{ticket.price.toLocaleString()} IQD</p>
                  </div>
                <div className="col-span-2">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">BLOCK</p>
                        <p className="font-semibold text-base">{ticket.seat.block}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">ROW</p>
                        <p className="font-semibold text-base">{ticket.seat.row}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">SEAT</p>
                        <p className="font-semibold text-base">{ticket.seat.number}</p>
                      </div>
                    </div>
                  </div>
                  
                </>
              ) : (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">PRICE</p>
                  <p className="font-semibold text-base">{ticket.price.toLocaleString()} IQD</p>
                </div>
              )}
            </div>

            {/* Venue Location */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="w-4 h-4 text-primary" />
                <h4 className="font-bold text-sm">Venue Location</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {ticket.concert.venue} - {ticket.concert.location}
              </p>
              {/* Map Placeholder */}
              {/* <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center relative border border-gray-200">
                <MapPin className="w-6 h-6 text-blue-600 absolute" />
                <p className="text-xs text-muted-foreground mt-10">Venue Map</p>
              </div> */}
            </div>

            {/* Important Notes */}
            <div className="pt-2 border-t">
              <h4 className="font-bold mb-2 text-sm">Important Notes</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-start gap-1.5">
                  <span className="text-primary">•</span>
                  <span>Valid only for the date and time specified on the ticket</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-primary">•</span>
                  <span>Entry prohibited for individuals under 6 years of age</span>
                </li>
                {/* <li className="flex items-start gap-1.5">
                  <span className="text-primary">•</span>
                  <span>No refunds or exchanges after purchase</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-primary">•</span>
                  <span>Please arrive at least 30 minutes before show time</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-primary">•</span>
                  <span>Ticket holder must comply with venue rules and regulations</span>
                </li> */}
              </ul>
            </div>
          </div>

          {/* Right Column - QR Code and Barcode */}
          <div className="lg:col-span-1 flex flex-col items-center space-y-3">
            {/* QR Code */}
            <div className="w-full flex flex-col items-center">
              <div className="bg-white p-2 rounded-lg border-2 border-gray-200">
                <QRCodeSVG
                  value={ticket.ticketNumber}
                  size={120}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Scan for entry</p>
            </div>

            {/* Ticket Number */}
            <div className="w-full text-center">
              <p className="text-xs text-muted-foreground mb-0.5">TICKET NUMBER</p>
              <p className="font-mono font-semibold text-sm">{ticket.ticketNumber}</p>
            </div>

            {/* Barcode */}
            <div className="w-full">
              <Barcode value={ticket.ticketNumber} />
              <p className="text-xs text-center text-muted-foreground mt-0.5 font-mono">
                {ticket.ticketNumber}
              </p>
            </div>

            {/* Branding */}
            <div className="w-full pt-2 border-t text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Image
                  src="/GOLDEN BRIDGE OFFICIAL LOGO00000.svg"
                  alt="Golden Bridge Events Logo"
                  width={34}
                  height={34}
                  className="object-contain"
                />
                <p className="font-bold text-xs">Golden Bridge Events</p>
              </div>
              <p className="text-xs text-muted-foreground">goldenbridgeevents.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Blue Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 text-center">
        <p className="text-xs font-medium">
          Keep this ticket safe. You will need to present it at the venue entrance.
        </p>
      </div>
      </div>
    </div>
  );
}

