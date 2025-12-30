'use client';

import { Music, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Music className="w-6 h-6 text-primary" />
              <h3 className="font-semibold">Concert Tickets</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your premier destination for discovering and booking tickets to the best live music events.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Concerts
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Popular Artists
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <a href="mailto:support@concerttickets.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  support@concerttickets.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <a href="tel:+1234567890" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  123 Music Street<br />
                  New York, NY 10001
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Concert Tickets. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

