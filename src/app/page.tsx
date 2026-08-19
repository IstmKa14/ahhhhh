import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center">
      {/* Grid container with a thin boundary line */}
      <div className="container mx-auto px-6 py-12 md:py-24 border-x border-border/60 min-h-[85vh] flex flex-col justify-between">
        
        {/* Top header label */}
        <div className="border-b border-border/60 pb-6 mb-12">
          <span className="font-body text-xs font-semibold tracking-widest text-secondary uppercase">
            MINDBLOOM / VOLUME 01
          </span>
        </div>

        {/* Main hero grid */}
        <div className="grid gap-12 lg:grid-cols-12 items-start my-auto">
          {/* Left column: Text content */}
          <div className="lg:col-span-8 space-y-8">
            <h1 className="font-headline text-5xl sm:text-7xl lg:text-8xl text-primary tracking-tight leading-[0.95] font-light">
              Cultivate a quiet mind.
            </h1>
            
            <p className="font-body text-lg sm:text-xl text-primary/80 max-w-xl leading-relaxed font-light">
              A premium space designed for student mental wellness. Walk away from daily stress by growing a personal tree of gratitude, sharing reflections with our tree spirit, or engaging in calm activities.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                href="/journal" 
                className="inline-block bg-primary text-background px-8 py-4 text-xs font-semibold tracking-widest uppercase hover:bg-accent hover:text-primary transition-colors duration-300 rounded-[2px]"
              >
                Begin your growth
              </Link>
              <Link 
                href="/chat" 
                className="inline-block border border-primary text-primary px-8 py-4 text-xs font-semibold tracking-widest uppercase hover:bg-primary hover:text-background transition-colors duration-300 rounded-[2px]"
              >
                Speak with the spirit
              </Link>
            </div>
          </div>

          {/* Right column: Graphic symbol */}
          <div className="lg:col-span-4 flex justify-end lg:justify-end md:justify-center w-full">
            <div className="w-full max-w-[280px] aspect-[3/4] border border-border/80 p-8 flex flex-col justify-between relative bg-card">
              <div className="absolute top-0 right-0 w-8 h-8 border-b border-l border-border/80 flex items-center justify-center">
                <span className="text-[10px] font-body text-secondary font-semibold">01</span>
              </div>
              
              <div className="pt-6">
                <span className="font-body text-[10px] font-semibold tracking-widest text-secondary uppercase block mb-2">
                  THE SPIRIT
                </span>
                <span className="font-headline text-lg italic text-primary leading-tight block">
                  A sanctuary for student wellness
                </span>
              </div>

              {/* Minimalist leaf illustration in vector */}
              <div className="py-12 flex justify-center">
                <svg
                  className="w-24 h-24 text-secondary/40"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M50 90C50 90 50 50 10 50C10 50 50 45 50 10C50 10 50 50 90 50C90 50 50 55 50 90Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div className="border-t border-border/60 pt-4">
                <p className="font-body text-[10px] text-muted-foreground leading-normal font-light">
                  MindBloom offers meditation, mood logs, and silent spaces for your thoughts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer line with coordinates */}
        <div className="border-t border-border/60 pt-6 mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-[10px] font-body text-secondary tracking-wider font-light uppercase">
            MIND.BLOOM.PROJECT
          </div>
          <div className="text-[10px] font-body text-secondary tracking-wider font-light uppercase">
            EST. 2026 / CREATED BY ARYAN, DHARVI, GAURAV, KARTIK
          </div>
        </div>

      </div>
    </div>
  );
}
