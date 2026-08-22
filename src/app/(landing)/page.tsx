'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { Navbar } from '@/features/landing/ui/Navbar';
import { HeroSection } from '@/features/landing/ui/HeroSection';
import { FeelingSection } from '@/features/landing/ui/FeelingSection';
import { OurSpaceSection } from '@/features/landing/ui/OurSpaceSection';
import { TalkSection } from '@/features/landing/ui/TalkSection';
import { ReflectSection } from '@/features/landing/ui/ReflectSection';
import { ResetSection } from '@/features/landing/ui/ResetSection';
import { DiscoverSection } from '@/features/landing/ui/DiscoverSection';
import { PhilosophySection } from '@/features/landing/ui/PhilosophySection';
import { HowItWorksSection } from '@/features/landing/ui/HowItWorksSection';
import { SupportSection } from '@/features/landing/ui/SupportSection';
import { FooterSection } from '@/features/landing/ui/FooterSection';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // GSAP scroll animations
  useGSAP(() => {
    // Initial hidden states
    gsap.set('[data-animate="navbar"]',            { y: -20, opacity: 0 });
    gsap.set('[data-animate="hero-headline"]',     { y: 80, opacity: 0 });
    gsap.set('[data-animate="hero-body"]',         { y: 40, opacity: 0 });
    gsap.set('[data-animate="hero-cta"]',          { y: 20, opacity: 0 });
    gsap.set('[data-animate="feeling-headline"]',  { y: 40, opacity: 0 });
    gsap.set('[data-animate="feeling-pill"]',      { y: 20, opacity: 0 });
    gsap.set('[data-animate="feeling-photo"]',     { opacity: 0 });
    gsap.set('[data-animate="space-headline"]',    { y: 40, opacity: 0 });
    gsap.set('[data-animate="space-body"]',        { y: 20, opacity: 0 });
    gsap.set('[data-animate="space-botanical"]',   { opacity: 0, scale: 0.92 });
    gsap.set('[data-animate="talk-headline"]',     { y: 40, opacity: 0 });
    gsap.set('[data-animate="talk-body"]',         { y: 20, opacity: 0 });
    gsap.set('[data-animate="chat-card"]',         { y: 30, opacity: 0 });
    gsap.set('[data-animate="chat-msg"]',          { y: 15, opacity: 0 });
    gsap.set('[data-animate="reflect-headline"]',  { y: 40, opacity: 0 });
    gsap.set('[data-animate="reflect-body"]',      { y: 20, opacity: 0 });
    gsap.set('[data-animate="reflect-botanical"]', { opacity: 0, scale: 0.9 });
    gsap.set('[data-animate="reflect-photo"]',     { opacity: 0 });
    gsap.set('[data-animate="reset-headline"]',    { y: 40, opacity: 0 });
    gsap.set('[data-animate="reset-circle"]',      { y: 20, opacity: 0, scale: 0.9 });
    gsap.set('[data-animate="discover-headline"]', { y: 40, opacity: 0 });
    gsap.set('[data-animate="discover-card"]',     { y: 30, opacity: 0 });
    gsap.set('[data-animate="philosophy-quote"]',  { y: 40, opacity: 0 });
    gsap.set('[data-animate="philosophy-brand"]',  { y: 10, opacity: 0 });
    gsap.set('[data-animate="step"]',              { y: 30, opacity: 0 });
    gsap.set('[data-animate="support-headline"]',  { y: 40, opacity: 0 });
    gsap.set('[data-animate="support-body"]',      { y: 20, opacity: 0 });
    gsap.set('[data-animate="support-photo"]',     { opacity: 0 });
    gsap.set('[data-animate="footer"]',            { y: 20, opacity: 0 });

    // Navbar entrance
    gsap.to('[data-animate="navbar"]', {
      y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1,
    });

    // Hero sequence
    const tlHero = gsap.timeline({ delay: 0.25 });
    tlHero
      .to('[data-animate="hero-headline"]', { y: 0, opacity: 1, duration: 1.4, ease: 'power4.out' })
      .to('[data-animate="hero-body"]',     { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.8')
      .to('[data-animate="hero-cta"]',      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.5');

    // Section 02 — THE FEELING
    gsap.to('[data-animate="feeling-headline"]', {
      scrollTrigger: { trigger: '#section-02', start: 'top 80%' },
      y: 0, opacity: 1, duration: 1, ease: 'power3.out',
    });
    gsap.to('[data-animate="feeling-pill"]', {
      scrollTrigger: { trigger: '#section-02', start: 'top 75%' },
      y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power2.out',
    });
    gsap.to('[data-animate="feeling-photo"]', {
      scrollTrigger: { trigger: '#section-02', start: 'top 80%' },
      opacity: 1, duration: 1.2, ease: 'power2.out',
    });

    // Section 03 — OUR SPACE
    gsap.to('[data-animate="space-headline"]', {
      scrollTrigger: { trigger: '#section-03', start: 'top 80%' },
      y: 0, opacity: 1, duration: 1, ease: 'power3.out',
    });
    gsap.to('[data-animate="space-body"]', {
      scrollTrigger: { trigger: '#section-03', start: 'top 75%' },
      y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.2,
    });
    gsap.to('[data-animate="space-botanical"]', {
      scrollTrigger: { trigger: '#section-03', start: 'top 70%' },
      opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
    });

    // Section 04 — TALK
    const tlTalk = gsap.timeline({
      scrollTrigger: { trigger: '#section-04', start: 'top 75%' },
    });
    tlTalk
      .to('[data-animate="talk-headline"]', { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
      .to('[data-animate="talk-body"]',     { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.5')
      .to('[data-animate="chat-card"]',     { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.5')
      .to('[data-animate="chat-msg"]',      { y: 0, opacity: 1, stagger: 0.25, duration: 0.5, ease: 'power2.out' }, '-=0.3');

    // Section 05 — REFLECT
    gsap.to('[data-animate="reflect-headline"]', {
      scrollTrigger: { trigger: '#section-05', start: 'top 80%' },
      y: 0, opacity: 1, duration: 1, ease: 'power3.out',
    });
    gsap.to('[data-animate="reflect-body"]', {
      scrollTrigger: { trigger: '#section-05', start: 'top 75%' },
      y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.15,
    });
    gsap.to('[data-animate="reflect-botanical"]', {
      scrollTrigger: { trigger: '#section-05', start: 'top 70%' },
      opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
    });
    gsap.to('[data-animate="reflect-photo"]', {
      scrollTrigger: { trigger: '#section-05', start: 'top 80%' },
      opacity: 1, duration: 1.2, ease: 'power2.out',
    });

    // Section 06 — RESET
    gsap.to('[data-animate="reset-headline"]', {
      scrollTrigger: { trigger: '#section-06', start: 'top 80%' },
      y: 0, opacity: 1, duration: 1, ease: 'power3.out',
    });
    gsap.to('[data-animate="reset-circle"]', {
      scrollTrigger: { trigger: '#section-06', start: 'top 75%' },
      y: 0, opacity: 1, scale: 1, stagger: 0.12, duration: 0.7, ease: 'back.out(1.2)',
    });

    // Section 07 — DISCOVER
    gsap.to('[data-animate="discover-headline"]', {
      scrollTrigger: { trigger: '#section-07', start: 'top 80%' },
      y: 0, opacity: 1, duration: 1, ease: 'power3.out',
    });
    gsap.to('[data-animate="discover-card"]', {
      scrollTrigger: { trigger: '#section-07', start: 'top 75%' },
      y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power2.out',
    });

    // Section 08 — PHILOSOPHY
    const tlPhilosophy = gsap.timeline({
      scrollTrigger: { trigger: '#section-08', start: 'top 75%' },
    });
    tlPhilosophy
      .to('[data-animate="philosophy-quote"]', { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' })
      .to('[data-animate="philosophy-brand"]', { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.4');

    // Section 09 — HOW IT WORKS
    gsap.to('[data-animate="step"]', {
      scrollTrigger: { trigger: '#section-09', start: 'top 80%' },
      y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power2.out',
    });

    // Section 10 — SUPPORT
    gsap.to('[data-animate="support-photo"]', {
      scrollTrigger: { trigger: '#section-10', start: 'top 80%' },
      opacity: 1, duration: 1.2, ease: 'power2.out',
    });
    gsap.to('[data-animate="support-headline"]', {
      scrollTrigger: { trigger: '#section-10', start: 'top 75%' },
      y: 0, opacity: 1, duration: 1, ease: 'power3.out',
    });
    gsap.to('[data-animate="support-body"]', {
      scrollTrigger: { trigger: '#section-10', start: 'top 70%' },
      y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.15,
    });

    // Footer
    gsap.to('[data-animate="footer"]', {
      scrollTrigger: { trigger: '#section-11', start: 'top 90%' },
      y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-background flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-background focus:px-3 focus:py-2 focus:text-foreground focus:text-sm">
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="flex-1 flex flex-col pt-14">
        <HeroSection />
        <FeelingSection />
        <OurSpaceSection />
        <TalkSection />
        <ReflectSection />
        <ResetSection />
        <DiscoverSection />
        <PhilosophySection />
        <HowItWorksSection />
        <SupportSection />
      </main>

      <FooterSection />
    </div>
  );
}
