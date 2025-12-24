import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Sparkles, MessageCircle, Rocket } from "lucide-react";

const HowItWorksPage = () => {
  const navigate = useNavigate();
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [activeStep, setActiveStep] = useState<number | null>(0);

  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Tell us about yourself—your niche, your vibe, your goals. Takes less than 5 minutes.",
      icon: UserPlus,
    },
    {
      number: "02",
      title: "Get Matched",
      description: "Our algorithm finds your perfect matches. Swipe right on the ones you like.",
      icon: Sparkles,
    },
    {
      number: "03",
      title: "Connect & Chat",
      description: "When it's mutual, start a conversation. No awkward intros—you already know it's a fit.",
      icon: MessageCircle,
    },
    {
      number: "04",
      title: "Create Together",
      description: "Collaborate on campaigns, track deliverables, and get paid—all in one place.",
      icon: Rocket,
    },
  ];

  const handleCardClick = (index: number) => {
    setActiveStep(activeStep === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-primary/10 text-primary rounded-full">
                How It Works
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Collabs made{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ridiculously simple
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Whether you're a creator looking for brand deals or a brand hunting for authentic voices—we've got you.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Cards Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto space-y-4">
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                const Icon = step.icon;
                
                return (
                  <motion.div
                    key={step.number}
                    layout
                    layoutId={`card-${step.number}`}
                    onClick={() => handleCardClick(index)}
                    initial={false}
                    animate={{
                      scale: isActive ? 1.02 : 1,
                      y: isActive ? -2 : 0,
                    }}
                    whileHover={{ scale: isActive ? 1.02 : 1.01, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      mass: 0.8,
                    }}
                    className={`
                      relative cursor-pointer rounded-3xl overflow-hidden
                      ${isActive 
                        ? 'bg-primary shadow-2xl shadow-primary/25 ring-2 ring-primary/20' 
                        : 'bg-card shadow-md hover:shadow-lg'
                      }
                    `}
                  >
                    {/* Subtle glow effect for active state */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Card Header - Always Visible */}
                    <div className="relative p-5 md:p-7 flex items-center gap-4 md:gap-5">
                      <motion.div
                        animate={{
                          scale: isActive ? 1.05 : 1,
                          rotate: isActive ? 5 : 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 25,
                        }}
                        className={`
                          flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center
                          transition-colors duration-200
                          ${isActive 
                            ? 'bg-primary-foreground/20' 
                            : 'bg-primary/10'
                          }
                        `}
                      >
                        <Icon className={`
                          w-5 h-5 md:w-6 md:h-6 transition-colors duration-200
                          ${isActive ? 'text-primary-foreground' : 'text-primary'}
                        `} />
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <motion.span
                          className={`
                            text-[10px] font-bold uppercase tracking-widest mb-0.5 block
                            ${isActive ? 'text-primary-foreground/60' : 'text-muted-foreground/70'}
                          `}
                        >
                          Step {step.number}
                        </motion.span>
                        <h3 className={`
                          text-lg md:text-xl font-bold transition-colors duration-200
                          ${isActive ? 'text-primary-foreground' : 'text-foreground'}
                        `}>
                          {step.title}
                        </h3>
                      </div>

                      {/* Expand Indicator */}
                      <motion.div
                        animate={{ rotate: isActive ? 180 : 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        className={`
                          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                          ${isActive 
                            ? 'bg-primary-foreground/15' 
                            : 'bg-muted/80'
                          }
                        `}
                      >
                        <svg 
                          className={`w-4 h-4 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.div>
                    </div>

                    {/* Expandable Description */}
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ 
                            height: "auto", 
                            opacity: 1,
                            transition: {
                              height: {
                                type: "spring",
                                stiffness: 500,
                                damping: 40,
                                mass: 0.8,
                              },
                              opacity: { duration: 0.2, delay: 0.1 }
                            }
                          }}
                          exit={{ 
                            height: 0, 
                            opacity: 0,
                            transition: {
                              height: {
                                type: "spring",
                                stiffness: 500,
                                damping: 40,
                              },
                              opacity: { duration: 0.15 }
                            }
                          }}
                          className="overflow-hidden"
                        >
                          <motion.div 
                            initial={{ y: -10 }}
                            animate={{ y: 0 }}
                            exit={{ y: -10 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 25,
                            }}
                            className="px-5 md:px-7 pb-5 md:pb-7 pt-0"
                          >
                            <div className="pl-16 md:pl-[4.75rem]">
                              <p className="text-primary-foreground/85 text-sm md:text-base leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of creators and brands already making magic happen.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => navigate("/login?mode=signup")}
            >
              Join Free
            </Button>
          </div>
        </section>
      </main>
      <Footer ref={footerRef} />
    </>
  );
};

export default HowItWorksPage;
