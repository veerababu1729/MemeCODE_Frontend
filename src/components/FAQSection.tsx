import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import faq1Image from '@/assets/faq1image.jpg';

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "Whom is this ebook for?",
      answer: "Specifically for college placements, or high package job switch",
    },
    {
      id: 2,
      question: "Why Python? Why not C++, Java?",
      answer: "AI is everywhere; it's built with Python.",
      image: faq1Image,
    },
    {
      id: 3,
      question: "Do I get free certificate?",
      answer: "Yes, you will receive on your mail",
    }
  ];

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-background to-primary/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked
            <span className="gradient-text"> Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about our coding courses and approach.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-card border border-border/20 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Button
                variant="ghost"
                className="w-full p-6 text-left justify-between hover:bg-transparent"
                onClick={() => toggleFAQ(faq.id)}
              >
                <span className="text-base md:text-lg font-normal text-foreground">
                  {faq.question}
                </span>
                {openFAQ === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </Button>
              
              {openFAQ === faq.id && (
                <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="border-t border-border/20 pt-4">
                    {/* Mobile: Image above text, Desktop: Centered layout */}
                    <div className="flex flex-col gap-6">
                      {/* Text content */}
                      <div className="w-full">
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed md:text-center">
                          {faq.answer}
                        </p>
                      </div>
                      
                      {/* Image - Centered on both mobile and desktop (only if image exists) */}
                      {faq.image && (
                        <div className="w-full flex justify-center">
                          <img
                            src={faq.image}
                            alt={`FAQ ${faq.id} illustration`}
                            className="w-full max-w-xs md:max-w-sm lg:max-w-md h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                            onError={(e) => {
                              // Fallback if image doesn't exist
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;