'use client';

import Link from 'next/link';
import { Twitter, Instagram, Github } from 'lucide-react';
import { LANDING_COPY } from '../constants/copy';

const { s11 } = LANDING_COPY;

const SOCIAL_LINKS = [
  { href: 'https://twitter.com', label: 'MindBloom on Twitter', Icon: Twitter },
  { href: 'https://instagram.com', label: 'MindBloom on Instagram', Icon: Instagram },
  { href: 'https://github.com', label: 'MindBloom on GitHub', Icon: Github },
] as const;

export function FooterSection() {
  return (
    <footer
      id="section-11"
      className="bg-secondary border-t border-border"
      data-animate="footer"
      aria-label="Site footer"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 md:px-10 py-8 gap-6">
        {/* Left: section number + label + body */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[10px] font-medium tracking-widest text-muted-foreground">
              {s11.number}
            </span>
            <div className="w-px h-3 bg-border" aria-hidden="true" />
            <span className="font-sans text-[9px] font-medium tracking-widest uppercase text-muted-foreground">
              {s11.label}
            </span>
          </div>
          <p className="font-sans text-xs text-muted-foreground mt-1">
            {s11.body}
          </p>
          <p className="font-sans text-[10px] text-muted-foreground/60 mt-2">
            &copy; {new Date().getFullYear()} MindBloom. All rights reserved.
          </p>
        </div>

        {/* Right: social icons */}
        <nav aria-label="Social media" className="flex items-center gap-4">
          {SOCIAL_LINKS.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon size={16} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
