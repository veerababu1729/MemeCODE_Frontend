import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useState, useEffect, useRef } from 'react';

const reviews = [
  {
    name: "Ravi Kumar",
    role: "CSE Student",
    content: "MemeCode changed my coding journey completely! The Telugu memes made learning Python so entertaining. Got placed in TCS with their projects!",
    rating: 5,
    avatar: "RK"
  },
  {
    name: "Priya Jambulapalli",
    role: "IT Graduate",
    content: "300+ projects with source code? This is gold! The DSA sheet is perfectly curated. No more getting lost in 3000+ LeetCode problems.",
    rating: 5,
    avatar: "PS"
  },
  {
    name: "Manohar P",
    role: "B.Tech Student",
    content: "I hate coding but 21-day Python Ebook is like Venky's train scene - pure entertainment while learning. So easy to understand with memes",
    rating: 5,
    avatar: "VR"
  },
  {
    name: "Thulasi K",
    role: "ECE to IT Transition",
    content: "As an ECE student switching to coding, this was exactly what I needed. oka inteview ki em kavalo anni oke chota unnai",
    rating: 5,
    avatar: "SK"
  }
];

const ReviewsSection = () => {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [cardVisibility, setCardVisibility] = useState<boolean[]>(new Array(reviews.length).fill(false));
  const [highlightVisible, setHighlightVisible] = useState(false);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const highlightRef = useRef<HTMLDivElement>(null);

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

    const highlightObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHighlightVisible(true);
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

    // Observe highlight
    if (highlightRef.current) {
      highlightObserver.observe(highlightRef.current);
    }

    return () => {
      headerObserver.disconnect();
      cardObserver.disconnect();
      highlightObserver.disconnect();
    };
  }, []);

  return (
    <section id="reviews" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-600 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            We don't tell about us,
            <span className="gradient-text"> but our users do</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who transformed their coding journey with EE.Info
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <Card 
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              data-index={index}
              className={`p-6 glass-card hover:shadow-floating transition-all duration-500 hover:-translate-y-2 hover:scale-105 group ${cardVisibility[index] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
              style={{ 
                transitionDelay: cardVisibility[index] ? `${index * 0.1}s` : '0s',
                transformOrigin: 'left center'
              }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold mr-3">
                  {review.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{review.name}</h4>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-foreground leading-relaxed text-sm group-hover:text-foreground transition-colors">
                "{review.content}"
              </p>
            </Card>
          ))}
        </div>

        {/* Highlighted Review */}
        <div 
          ref={highlightRef}
          className={`mt-8 transition-all duration-600 ${highlightVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
          style={{ transitionDelay: highlightVisible ? '0.2s' : '0s' }}
        >
          <Card className="relative p-6 border-2 border-green-500 bg-green-50 dark:bg-green-950/30 hover:shadow-floating transition-all duration-300 hover:scale-105 highlight-glow highlight-border">
            <span className="absolute top-4 right-4 text-sm font-medium text-green-700 dark:text-green-300">Suresh Palkurthi</span>
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">Highlighted Review</h3>
            <p className="text-green-800 dark:text-green-300 leading-relaxed">
              “Eamcet lo rank raka, degree lo join ayya adhi kuda tier3 college. Em cheyyalo ane confusion, guidance ledhu. appudu ee "MemeCODE - eBook" naku oka confidence ichindhi, elanti confidence ante even college lo placements rakapoyina offcampus lo job kotte confidence.”
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;