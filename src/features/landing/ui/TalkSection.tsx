'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { LANDING_COPY } from '../constants/copy';
import { LANDING_IMAGES } from '../constants/images';

const { s04 } = LANDING_COPY;

export function TalkSection() {
  return (
    <section
      id="section-04"
      className="relative overflow-hidden bg-foreground text-background border-b border-foreground/20"
    >
      {/* Background texture photo at low opacity */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={LANDING_IMAGES.talkBg.src}
          alt=""
          fill
          className="object-cover object-center opacity-[0.15]"
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-stretch min-h-[520px]">
        {/* Left: section info + headline + body */}
        <div className="flex flex-col justify-center pt-12 pb-12 px-6 md:px-10 md:w-[50%] shrink-0 gap-6 border-b md:border-b-0 md:border-e border-background/10">
          {/* Section number + label */}
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[10px] font-medium tracking-widest text-background/40">
              {s04.number}
            </span>
            <div className="w-px h-3 bg-background/20" aria-hidden="true" />
            <span className="font-sans text-[9px] font-medium tracking-widest uppercase text-background/40">
              {s04.label}
            </span>
          </div>

          <h2
            className="font-serif text-[clamp(1.8rem,4vw,3rem)] leading-[1.15] text-background whitespace-pre-line"
            data-animate="talk-headline"
          >
            {s04.headline}
          </h2>

          <p
            className="font-sans text-sm text-background/60 leading-relaxed whitespace-pre-line max-w-xs"
            data-animate="talk-body"
          >
            {s04.body}
          </p>
        </div>

        {/* Right: chat card */}
        <div className="flex items-center justify-center flex-1 py-12 px-6 md:px-10">
          <div
            className="w-full max-w-sm bg-card text-foreground rounded-xl shadow-2xl p-5"
            data-animate="chat-card"
          >
            {/* Chat header */}
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
              <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center shrink-0">
                <span className="text-background text-[8px] font-bold">B</span>
              </div>
              <span className="font-sans font-semibold text-sm text-foreground">
                {s04.chatName}
              </span>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-3 mb-4">
              {s04.chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  data-animate="chat-msg"
                >
                  <div
                    className={`px-3 py-2 rounded-lg text-sm font-sans leading-relaxed max-w-[80%] whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg bg-muted flex gap-1 items-center h-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:0.4s]" />
                </div>
              </div>
            </div>

            {/* Input row */}
            <div className="flex items-center gap-2 border-t border-border pt-3">
              <input
                type="text"
                placeholder={s04.chatPlaceholder}
                readOnly
                className="flex-1 font-sans text-xs text-muted-foreground bg-transparent outline-none placeholder:text-muted-foreground/60 cursor-default"
                aria-label="Message Bloom input"
              />
              <button
                type="button"
                aria-label="Send message"
                className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity"
              >
                <ArrowRight size={12} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
