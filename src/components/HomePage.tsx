import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReviewsSection from './ReviewsSection';
import FAQSection from './FAQSection';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import matrixImage from '@/assets/matrix.png';
import pythonIllustration from '@/assets/coverpage.png';
import demoVideo from '@/assets/demovideo.mp4';

// Matrix Digital Rain Component
const MatrixRain = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<number[]>([]);

  useEffect(() => {
    const generateColumns = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const columnWidth = 12;
        const numColumns = Math.floor(containerWidth / columnWidth);
        setColumns(Array.from({ length: numColumns }, (_, i) => i));
      }
    };

    generateColumns();
    window.addEventListener('resize', generateColumns);
    return () => window.removeEventListener('resize', generateColumns);
  }, []);

  const generateBinaryString = (length: number) => {
    const chars = ['0', '1'];
    return Array.from({ length }, () => {
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('\n');
  };

  return (
    <div ref={containerRef} className="matrix-rain">
      {columns.map((_, index) => (
        <div
          key={index}
          className="matrix-column"
          style={{
            left: `${index * 12}px`,
            animationDuration: `${8 + Math.random() * 6}s`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        >
          {generateBinaryString(50 + Math.floor(Math.random() * 30))}
        </div>
      ))}
    </div>
  );
};

// Matrix Orbs Component
const MatrixOrbs = () => {
  const [orbs, setOrbs] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);

  useEffect(() => {
    const generateOrbs = () => {
      const orbCount = 6;
      const newOrbs = Array.from({ length: orbCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        size: 0.6 + Math.random() * 0.3,
      }));
      setOrbs(newOrbs);
    };

    generateOrbs();
    const interval = setInterval(generateOrbs, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="matrix-orbs">
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="matrix-orb"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            animationDelay: `${orb.delay}s`,
            transform: `scale(${orb.size})`,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
};

// Single demo video component (one video instance, reused across layouts)
const DemoVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-xs sm:max-w-sm">
        <div className="relative rounded-xl overflow-hidden shadow-floating hover:shadow-glow transition-all duration-500 aspect-[9/16] bg-black">
          <video
            ref={videoRef}
            onPlay={() => setIsPlaying(true)}
            controls
            className="w-full h-full object-contain"
            poster="/api/placeholder/270/480"
          >
            <source src={demoVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {!isPlaying && (
            <button
              type="button"
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
            >
              <span className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-sm sm:text-base font-semibold shadow-lg ring-2 ring-sky-200">
                Play video
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const imageObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (imageRef.current) {
      imageObserver.observe(imageRef.current);
    }

    return () => {
      imageObserver.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Quote Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <blockquote className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground mb-8">
              "BTech / Degree people fail not due to lack of talent.
              <br />
              <span className="gradient-text">It's lack of guidance.</span>
              <br />
              You will get that here."
            </blockquote>
            <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full" />
          </div>
        </div>
      </section>

      {/* Demo Video Section - Placed after Hero Quote */}
      <section className="py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-7xl mx-auto flex justify-center">
          <DemoVideo />
        </div>
      </section>

      {/* Buy Now CTA - After Video */}
      <section className="py-8 px-4 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <Button
            className="w-full max-w-md text-xl md:text-2xl py-6 md:py-8 px-12 md:px-16 group bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-700 hover:via-green-600 hover:to-green-700 text-white font-bold relative overflow-hidden shadow-2xl hover:shadow-green-500/60 transform hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 rounded-xl border-2 border-green-400/40"
            onClick={() => navigate('/payment')}
          >
            {/* Continuous sparkle background */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-2 left-4 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping"></div>
              <div className="absolute top-4 right-6 w-1 h-1 bg-white rounded-full animate-pulse animation-delay-300"></div>
              <div className="absolute bottom-3 left-8 w-1 h-1 bg-yellow-200 rounded-full animate-ping animation-delay-500"></div>
              <div className="absolute bottom-5 right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse animation-delay-700"></div>
            </div>

            {/* Shining sweep effect */}
            <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-800 ease-in-out"></div>

            {/* Pulsing border with glow */}
            <div className="absolute inset-0 rounded-xl border-2 border-white/30 group-hover:border-yellow-300/60 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_30px_rgba(255,235,59,0.5)]"></div>

            {/* Button content */}
            <div className="relative flex items-center justify-center gap-3">
              <span className="tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(255,235,59,0.6)]">Buy Now</span>
            </div>

            {/* Bottom glow */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4/5 h-2 bg-green-400/60 blur-sm group-hover:bg-yellow-300/80 group-hover:h-3 transition-all duration-300"></div>
          </Button>


        </div>
      </section>

      {/* Python Illustration Section - Placed after Video */}
      <section className="py-16 md:py-20 lg:py-24 px-4 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div
            ref={imageRef}
            className={`relative transition-all duration-600 ${imageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
            style={{ transitionDelay: imageVisible ? '0.2s' : '0s' }}
          >
            {/* Theater Marquee Frame */}
            <div className="relative max-w-md lg:max-w-lg mx-auto">
              {/* Brown/Red Border Frame */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-800 via-red-900 to-amber-900 rounded-2xl shadow-2xl" style={{ margin: '-24px', padding: '24px', border: '4px solid #92400e' }}>
                {/* Inner accent border */}
                <div className="absolute inset-0 border-2 border-amber-600 rounded-xl" style={{ margin: '12px' }}></div>
              </div>

              {/* Yellow Glowing Bulbs */}
              {/* Top bulbs */}
              {[...Array(16)].map((_, i) => (
                <div
                  key={`top-${i}`}
                  className="absolute w-3.5 h-3.5 rounded-full"
                  style={{
                    top: '-18px',
                    left: `${(i + 0.5) * 6.25}%`,
                    backgroundColor: '#fbbf24',
                    boxShadow: '0 0 20px 6px rgba(251, 191, 36, 0.9), inset 0 0 8px rgba(255, 255, 255, 0.6)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: `${i * 0.08}s`,
                    border: '2px solid #f59e0b'
                  }}
                ></div>
              ))}

              {/* Bottom bulbs */}
              {[...Array(16)].map((_, i) => (
                <div
                  key={`bottom-${i}`}
                  className="absolute w-3.5 h-3.5 rounded-full"
                  style={{
                    bottom: '-18px',
                    left: `${(i + 0.5) * 6.25}%`,
                    backgroundColor: '#fbbf24',
                    boxShadow: '0 0 20px 6px rgba(251, 191, 36, 0.9), inset 0 0 8px rgba(255, 255, 255, 0.6)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: `${i * 0.08 + 0.04}s`,
                    border: '2px solid #f59e0b'
                  }}
                ></div>
              ))}

              {/* Left bulbs */}
              {[...Array(11)].map((_, i) => (
                <div
                  key={`left-${i}`}
                  className="absolute w-3.5 h-3.5 rounded-full"
                  style={{
                    left: '-18px',
                    top: `${(i + 0.5) * 9.09}%`,
                    backgroundColor: '#fbbf24',
                    boxShadow: '0 0 20px 6px rgba(251, 191, 36, 0.9), inset 0 0 8px rgba(255, 255, 255, 0.6)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: `${i * 0.08 + 0.08}s`,
                    border: '2px solid #f59e0b'
                  }}
                ></div>
              ))}

              {/* Right bulbs */}
              {[...Array(11)].map((_, i) => (
                <div
                  key={`right-${i}`}
                  className="absolute w-3.5 h-3.5 rounded-full"
                  style={{
                    right: '-18px',
                    top: `${(i + 0.5) * 9.09}%`,
                    backgroundColor: '#fbbf24',
                    boxShadow: '0 0 20px 6px rgba(251, 191, 36, 0.9), inset 0 0 8px rgba(255, 255, 255, 0.6)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: `${i * 0.08 + 0.12}s`,
                    border: '2px solid #f59e0b'
                  }}
                ></div>
              ))}

              {/* Image */}
              <div className="relative z-10 p-1">
                <img
                  src={pythonIllustration}
                  alt="Python Learning Illustration"
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Why MemeCODE Ebook Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-background via-muted/50 to-background overflow-hidden">
        <div className="max-w-3xl mx-auto relative">
          {/* Floating elements for animation background */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/2 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-700"></div>

          {/* Title */}
          <div className="text-center mb-12 transform hover:scale-105 transition-transform duration-500">
            <h2 className="text-4xl md:text-5xl font-bold inline-block relative">
              <span className="text-foreground">Why </span>
              <span className="text-[#ff3333] drop-shadow-md">MemeCODE</span>
              <span className="text-foreground"> - </span>
              <span className="text-[#f0f0f0] drop-shadow-md bg-stone-800 px-2 py-0.5 rounded ml-1">EBook?</span>

              {/* Underline decorative */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#ff3333] to-transparent"></div>
            </h2>
          </div>

          {/* Content Card with Image Styles */}
          <div className="relative group perspective-1000">
            {/* Card Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:-translate-y-2 hover:rotate-1">
              {/* Header - Dark Teal from image */}
              <div className="bg-[#0f4c4f] p-6 border-b-4 border-[#0a3537] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10"></div>
                <h3 className="text-2xl md:text-3xl font-bold text-center text-[#e8dec8] tracking-wide relative z-10">
                  What you get :
                </h3>
              </div>

              {/* Body - Beige/Cream from image */}
              <div className="bg-[#f2ead5] p-8 md:p-10 space-y-6">
                {/* Point 1 */}
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/50 border border-stone-200 hover:bg-white hover:shadow-lg transition-all duration-300 transform translate-x-0 hover:translate-x-2">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-2xl animate-bounce shadow-sm text-green-600">
                    📚
                  </div>
                  <p className="text-lg md:text-xl font-bold text-stone-800 pt-1">
                    All placement material in one ebook.
                  </p>
                </div>

                {/* Point 2 */}
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/50 border border-stone-200 hover:bg-white hover:shadow-lg transition-all duration-300 transform translate-x-0 hover:translate-x-2 delay-100">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-2xl animate-pulse shadow-sm text-blue-600">
                    ✨
                  </div>
                  <div>
                    <p className="text-lg md:text-xl font-bold text-stone-800 leading-relaxed">
                      Get ur placements with <span className="text-red-600">0% confusion</span>, <span className="text-red-600">0% doubt</span>, <span className="text-red-600">0% stress</span>.
                    </p>
                    <p className="text-xl md:text-2xl font-extrabold text-green-700 mt-2 animate-pulse">
                      100% clarity
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buy Now CTA - Placed after Coverpage */}
      <section className="py-8 px-4 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <Button
            className="w-full max-w-md text-xl md:text-2xl py-6 md:py-8 px-12 md:px-16 group bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-700 hover:via-green-600 hover:to-green-700 text-black font-bold relative overflow-hidden shadow-2xl hover:shadow-green-500/60 transform hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 rounded-xl border-2 border-green-400/40"
            onClick={() => navigate('/payment')}
          >
            {/* Continuous sparkle background */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-2 left-4 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping"></div>
              <div className="absolute top-4 right-6 w-1 h-1 bg-white rounded-full animate-pulse animation-delay-300"></div>
              <div className="absolute bottom-3 left-8 w-1 h-1 bg-yellow-200 rounded-full animate-ping animation-delay-500"></div>
              <div className="absolute bottom-5 right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse animation-delay-700"></div>
            </div>

            {/* Shining sweep effect */}
            <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-800 ease-in-out"></div>

            {/* Pulsing border with glow */}
            <div className="absolute inset-0 rounded-xl border-2 border-white/30 group-hover:border-yellow-300/60 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_30px_rgba(255,235,59,0.5)]"></div>

            {/* Button content */}
            <div className="relative flex items-center justify-center gap-3">
              <span className="tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(255,235,59,0.6)]">Buy Now</span>
            </div>

            {/* Bottom glow */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4/5 h-2 bg-green-400/60 blur-sm group-hover:bg-yellow-300/80 group-hover:h-3 transition-all duration-300"></div>
          </Button>

          {/* Login link for existing users */}
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Already purchased?
              <button
                className="text-blue-600 hover:text-blue-800 underline ml-1 font-medium transition-colors"
                onClick={() => navigate('/login')}
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Section - Placed after Coverpage */}
      <ReviewsSection />

      {/* Matrix Image Section */}
      <section className="py-8 px-4 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
        {/* Matrix Digital Rain Background - Only behind image */}
        <div className="absolute inset-0 cse-bg">
          <div className="terminal-grid" />
          <MatrixRain />
          <MatrixOrbs />
          <div className="hacker-lines" />
          <div className="crt-scanlines" />
          <div className="glitch-effect" />
          <div className="matrix-overlay" />
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-col items-center relative z-10">
          <h3 className="text-2xl md:text-3xl font-bold text-green-600 mb-0">Select One</h3>
          <div className="relative w-full flex justify-center md:justify-center">
            {/* Matrix Image */}
            <div className="relative">
              <img
                src={matrixImage}
                alt="Matrix Choice"
                className="w-64 md:w-80 lg:w-96 xl:w-[28rem] h-auto drop-shadow-2xl matrix-image-animated"
              />

              {/* Left Hand Button - "I Need a Demo" */}
              <Button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-bold shadow-lg hover:shadow-red-500/50 transition-all duration-300"
                style={{
                  left: '20px',
                  top: '60%',
                  transform: 'translateY(-50%)'
                }}
                onClick={() => window.open('https://drive.google.com/file/d/1NZBvjLi71kS7lo9O_fEB4d4-mLEORJbO/view?usp=sharing', '_blank')}
              >
                I Need a Demo
              </Button>

              {/* Right Hand Button - "Buy Now" */}
              <Button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-bold shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                style={{
                  right: '20px',
                  top: '60%',
                  transform: 'translateY(-50%)'
                }}
                onClick={() => navigate('/payment')}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </section>



      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <footer className="bg-background/80 border-t border-border/20 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground/60">
            <a href="/contact" className="hover:text-muted-foreground/80 transition-colors">Contact Us</a>
            <span className="text-muted-foreground/40">•</span>
            <a href="/terms" className="hover:text-muted-foreground/80 transition-colors">Terms and Conditions</a>
            <span className="text-muted-foreground/40">•</span>
            <a href="/refunds" className="hover:text-muted-foreground/80 transition-colors">Cancellations and Refunds</a>
            <span className="text-muted-foreground/40">•</span>
            <a href="/privacy" className="hover:text-muted-foreground/80 transition-colors">Privacy Policy</a>
          </div>
          <div className="text-center mt-4 text-xs text-muted-foreground/50">
            © 2024 EE.Info - All rights reserved.
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {
        showScrollTop && (
          <Button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary-deep shadow-floating hover:shadow-glow transition-all duration-300 z-50"
            size="icon"
          >
            <ArrowUp className="w-6 h-6" />
          </Button>
        )
      }
    </div >
  );
};

export default HomePage;