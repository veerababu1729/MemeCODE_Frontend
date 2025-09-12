import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

const reviews = [
  {
    name: "Ravi Kumar",
    role: "CSE Student",
    content: "EE.Info changed my coding journey completely! The Telugu memes made learning Python so entertaining. Got placed in TCS with their projects!",
    rating: 5,
    avatar: "RK"
  },
  {
    name: "Priya Sharma",
    role: "IT Graduate",
    content: "300+ projects with source code? This is gold! The DSA sheet is perfectly curated. No more getting lost in 3000+ LeetCode problems.",
    rating: 5,
    avatar: "PS"
  },
  {
    name: "Venkat Reddy",
    role: "B.Tech Student",
    content: "Finally, guidance that actually works! The 21-day Python course is like Venky's train scene - pure entertainment while learning.",
    rating: 5,
    avatar: "VR"
  },
  {
    name: "Sameera Khan",
    role: "ECE to IT Transition",
    content: "As an ECE student switching to coding, this was exactly what I needed. Clear, fun, and practical approach to learning.",
    rating: 5,
    avatar: "SK"
  }
];

const ReviewsSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
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
              className="p-6 glass-card hover:shadow-floating transition-all duration-300 hover:-translate-y-1 group"
              style={{ animationDelay: `${index * 0.1}s` }}
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
      </div>
    </section>
  );
};

export default ReviewsSection;