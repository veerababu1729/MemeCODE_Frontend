import { Code, FolderOpen, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import pythonIllustration from '@/assets/coverpage.png';
import { useState, useEffect, useRef } from 'react';

const features = [
  {
    step: "Step 1",
    title: "Learn Python with Fun",
    description: "Learn Python coding with Telugu memes and fun. Almost feels like a pure Venky train scene - entertaining yet educational!",
    icon: Code,
    color: "text-primary"
  },
  {
    step: "Step 2", 
    title: "300+ Free Projects",
    description: "Get access to 300+ free projects with complete source code from AI to MERN, java,Python which recruiters look for to hire you.",
    icon: FolderOpen,
    color: "text-primary-glow"
  },
  {
    step: "Step 3",
    title: "Curated DSA Sheet",
    description: "Practice DSA with our curated sheet of 150-250 problems. No more getting lost in 3050+ LeetCode problems!",
    icon: Trophy, 
    color: "text-primary-deep"
  }
];

const FeaturesSection = () => {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [cardVisibility, setCardVisibility] = useState<boolean[]>(new Array(features.length).fill(false));
  const [imageVisible, setImageVisible] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setCardVisibility(prev => {
              const newVisibility = [...prev];
              newVisibility[index] = true;
              return newVisibility;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    const imageObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    // Observe header
    if (headerRef.current) {
      headerObserver.observe(headerRef.current);
    }

    // Observe cards
    cardRefs.current.forEach((ref) => {
      if (ref) cardObserver.observe(ref);
    });

    // Observe image
    if (imageRef.current) {
      imageObserver.observe(imageRef.current);
    }

    return () => {
      headerObserver.disconnect();
      cardObserver.disconnect();
      imageObserver.disconnect();
    };
  }, []);

  // Handle typing animation completion
  useEffect(() => {
    if (headerVisible) {
      const timer = setTimeout(() => {
        setTypingComplete(true);
      }, 3500); // 3s typing + 0.5s buffer
      return () => clearTimeout(timer);
    }
  }, [headerVisible]);

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-6xl mx-auto">
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-600 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What you <span className="gradient-text">get?</span>
          </h2>
          <p className={`text-xl text-muted-foreground max-w-2xl mx-auto inline-block ${headerVisible ? (typingComplete ? 'typing-complete' : 'typing-effect') : ''}`}>
            {headerVisible ? 'One Ebook = All Placements Preparation' : ''}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Features List */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                data-index={index}
                className={`p-6 glass-card hover:shadow-card transition-all duration-500 hover:scale-105 hover:-translate-y-2 group cursor-pointer ${cardVisibility[index] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                style={{ 
                  transitionDelay: cardVisibility[index] ? `${index * 0.15}s` : '0s',
                  transformOrigin: 'left center'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {feature.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div 
              ref={imageRef}
              className={`relative transition-all duration-600 ${imageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} 
              style={{ transitionDelay: imageVisible ? '0.2s' : '0s' }}
            >
              <div className="coverpage-container">
                <img 
                  src={pythonIllustration} 
                  alt="Python Learning Illustration"
                  className="rounded-xl shadow-floating max-w-full h-auto hover:scale-105 transition-transform duration-500 relative z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;