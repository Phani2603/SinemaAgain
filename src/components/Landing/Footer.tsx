"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

  const footerSections = {
    pages: [
      { name: "All Products", href: "#products" },
      { name: "Studio", href: "#studio" },
      { name: "Clients", href: "#clients" },
      { name: "Pricing", href: "#pricing" },
      { name: "Blog", href: "#blog" },
    ],
    socials: [
      { name: "Facebook", href: "https://facebook.com", icon: FaFacebook },
      { name: "Instagram", href: "https://instagram.com", icon: FaInstagram },
      { name: "Twitter", href: "https://twitter.com", icon: FaTwitter },
      { name: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedin },
    ],
    legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
    ],
    register: [
      { name: "Sign Up", href: "#signup" },
      { name: "Login", href: "#login" },
      { name: "Forgot Password", href: "#forgot" },
    ],
  };

  if (!mounted) {
    return null;
  }

  return (
    <footer className="relative w-full border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Large Background Text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.02] dark:opacity-[0.03] pointer-events-none">
        <span className="text-[clamp(8rem,20vw,24rem)] font-bold leading-none select-none">
          Sinema
        </span>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center space-x-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary transition-transform group-hover:scale-110">
                <span className="text-xl font-bold text-primary-foreground">S</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                Sinema
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              © copyright Sinema {currentYear}. All rights reserved.
            </p>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Pages
            </h3>
            <ul className="space-y-3">
              {footerSections.pages.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Socials
            </h3>
            <ul className="space-y-3">
              {footerSections.socials.map((link) => {
                const IconComponent = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 group"
                    >
                      <IconComponent className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Legal & Register Combined */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {footerSections.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Register
              </h3>
              <ul className="space-y-3">
                {footerSections.register.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
