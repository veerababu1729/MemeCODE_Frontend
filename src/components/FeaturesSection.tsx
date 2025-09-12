import { Code, FolderOpen, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import pythonIllustration from '@/assets/python-illustration.jpg';

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
    description: "Get access to 300+ free projects with complete source code. Real-world applications to build your portfolio.",
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
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What you <span className="gradient-text">get?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete learning journey from Python basics to advanced projects and DSA mastery
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Features List */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="p-6 glass-card hover:shadow-card transition-all duration-300 hover:scale-105 group cursor-pointer"
                style={{ animationDelay: `${index * 0.2}s` }}
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
            <div className="relative animate-fade-in">
              <img 
                src={pythonIllustration} 
                alt="Python Learning Illustration"
                className="rounded-2xl shadow-floating max-w-full h-auto hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;