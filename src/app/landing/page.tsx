"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ApolloLogo = ({ size = "default" }: { size?: "sm" | "default" | "lg" }) => {
  const sizes = {
    sm: { container: "w-8 h-8", icon: "20" },
    default: { container: "w-12 h-12", icon: "24" },
    lg: { container: "w-16 h-16", icon: "32" }
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizes[size].container} bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-xl flex items-center justify-center shadow-lg`}>
        <svg 
          width={sizes[size].icon} 
          height={sizes[size].icon} 
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg" 
          className="text-white"
        >
          <rect x="15" y="15" width="40" height="40" rx="8" ry="8" fill="currentColor" />
          <rect x="35" y="35" width="40" height="40" rx="8" ry="8" fill="currentColor" opacity="0.7" />
        </svg>
      </div>
      {size !== "sm" && (
        <div>
          <h1 className={size === "lg" ? "heading-1" : "heading-2"}>
            <span className="bg-gradient-to-r from-blueberry-600 to-blueberry-700 bg-clip-text text-transparent font-bold">
              Apollo
            </span>
          </h1>
          <p className="overline text-blueberry-600 dark:text-blueberry-400">
            Education Platform
          </p>
        </div>
      )}
    </div>
  );
};

export default function LandingPage() {

  useEffect(() => {
    // Add subtle animation on scroll
    const handleScroll = () => {
      const cards = document.querySelectorAll('.animate-on-scroll');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        if (isVisible && !card.classList.contains('animated')) {
          card.classList.add('animated');
          card.classList.remove('opacity-0', 'translate-y-8');
          card.classList.add('opacity-100', 'translate-y-0');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blueberry-400 via-blueberry-500 to-blueberry-700">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <ApolloLogo size="default" />
            <Link href="/login">
              <button className="bg-gradient-to-r from-blueberry-500 to-blueberry-600 hover:from-blueberry-600 hover:to-blueberry-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blueberry-400/10 to-blueberry-600/20"></div>
          <div className="relative max-w-6xl mx-auto px-6 py-20">
            <div className="bg-white backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30">
              {/* Mission & Vision Header */}
              <div className="text-center mb-16">
                <div className="flex items-center justify-center mb-8">
                  <div className="text-8xl mb-4">👩🏼‍🏫</div>
                </div>
                <h1 className="heading-1 bg-gradient-to-r from-blueberry-600 via-blueberry-700 to-blueberry-800 bg-clip-text text-transparent mb-6 font-light">
                  Transform Education to Empower Humanity
                </h1>
                <p className="subtitle text-neutral-700 max-w-3xl mx-auto mb-8">
                  Become a leading teacher assistant platform, making graduates employable through AI-powered education tools
                </p>
                
                {/* Critical Stats */}
                <div className="bg-gradient-to-r from-error-25 to-error-50 border-2 border-error-300 rounded-2xl p-8 mb-8 shadow-lg">
                  <h2 className="heading-2 bg-gradient-to-r bg-clip-text text-white mb-3">
                    49% of Indian Graduates are UNEMPLOYABLE
                  </h2>
                  <p className="body-text text-white font-medium">
                    According to government economic survey - and the on-ground reality is even worse
                  </p>
                </div>
              </div>

              {/* Market Size Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-16">
                <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
                  <div className="bg-gradient-to-br from-blueberry-500 via-blueberry-600 to-blueberry-700 text-white p-8 rounded-2xl text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="heading-1 font-light mb-2">4 Cr</div>
                    <div className="body-text opacity-90">Students in Higher Education Today</div>
                  </div>
                </div>
                <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
                  <div className="bg-gradient-to-br from-success-500 via-success-600 to-success-700 text-white p-8 rounded-2xl text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="heading-1 font-light mb-2">9 Cr</div>
                    <div className="body-text opacity-90">Expected by 2035</div>
                  </div>
                </div>
                <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
                  <div className="bg-gradient-to-br from-warning-500 via-warning-600 to-warning-700 text-white p-8 rounded-2xl text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="heading-1 font-light mb-2">82%</div>
                    <div className="body-text opacity-90">Students in State Public Universities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Analysis Section */}
        <section className="py-20 bg-gradient-to-br from-error-25 via-error-50 to-error-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="heading-2 bg-gradient-to-r from-neutral-800 to-neutral-900 bg-clip-text text-transparent mb-6">Why Are Students Struggling? 🤔</h2>
              <p className="subtitle text-neutral-700 max-w-3xl mx-auto">
                The root causes behind India's graduate unemployability crisis
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
                <div className="bg-white backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-error-200">
                  <div className="text-5xl mb-6">📚</div>
                  <h3 className="heading-3 text-neutral-900 mb-4">Lack of Practical Education</h3>
                  <p className="body-text text-neutral-700">
                    Educational institutions focus on theory without practical training and real-world application
                  </p>
                </div>
              </div>
              
              <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
                <div className="bg-white backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-error-200">
                  <div className="text-5xl mb-6">😴</div>
                  <h3 className="heading-3 text-neutral-900 mb-4">Boring Classroom Teaching</h3>
                  <p className="body-text text-neutral-700">
                    Lack of interactive, interesting and engaging teaching methods in classrooms
                  </p>
                </div>
              </div>
              
              <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
                <div className="bg-white backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-error-200">
                  <div className="text-5xl mb-6">🧭</div>
                  <h3 className="heading-3 text-neutral-900 mb-4">No Teacher-Student Mentorship</h3>
                  <p className="body-text text-neutral-700">
                    Absence of personalized guidance and one-on-one mentoring relationships
                  </p>
                </div>
              </div>
              
              <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
                <div className="bg-white backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-error-200">
                  <div className="text-5xl mb-6">📊</div>
                  <h3 className="heading-3 text-neutral-900 mb-4">Outdated Teacher Knowledge</h3>
                  <p className="body-text text-neutral-700">
                    Teachers lack preparedness and updates with current industry trends and technologies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-20 bg-gradient-to-br from-blueberry-25 via-blueberry-50 to-blueberry-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="heading-2 bg-gradient-to-r from-blueberry-700 to-blueberry-800 bg-clip-text text-transparent mb-6">Our AI-Powered Solution</h2>
              <p className="subtitle text-neutral-700 max-w-3xl mx-auto">
                Two core tenets to transform education and make teachers more effective
              </p>
            </div>
            
            {/* Solution Tenets */}
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
                <div className="bg-white backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-blueberry-200 hover:border-blueberry-300 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blueberry-100 to-blueberry-200 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h3 className="heading-3 bg-gradient-to-r from-blueberry-700 to-blueberry-800 bg-clip-text text-transparent mb-4">Make Teaching More Engaging</h3>
                  <p className="body-text text-neutral-700 leading-relaxed">
                    Provide tools for creating engaging multimodal topic help content that captures student attention and improves learning outcomes
                  </p>
                </div>
              </div>
              
              <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
                <div className="bg-white backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-blueberry-200 hover:border-blueberry-300 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blueberry-100 to-blueberry-200 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-3xl">🤖</span>
                  </div>
                  <h3 className="heading-3 bg-gradient-to-r from-blueberry-700 to-blueberry-800 bg-clip-text text-transparent mb-4">Enable Teacher-Student Mentorship</h3>
                  <p className="body-text text-neutral-700 leading-relaxed">
                    Automate administrative tasks so teachers can dedicate more time to one-on-one student mentorship and guidance
                  </p>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
                <div className="bg-gradient-to-br from-white via-white to-blueberry-25 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-blueberry-300 hover:-translate-y-1">
                  <div className="text-4xl mb-6">📖</div>
                  <h3 className="heading-3 text-neutral-900 mb-4">Curriculum Help Content</h3>
                  <p className="body-text text-neutral-700">
                    AI-powered recommendations for engaging multimodal content that aligns with your curriculum
                  </p>
                </div>
              </div>
              
              <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
                <div className="bg-gradient-to-br from-white via-white to-blueberry-25 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-blueberry-300 hover:-translate-y-1">
                  <div className="text-4xl mb-6">🏗️</div>
                  <h3 className="heading-3 text-neutral-900 mb-4">Real-World Projects</h3>
                  <p className="body-text text-neutral-700">
                    Industry-relevant project recommendations that give students practical experience and portfolio-worthy work
                  </p>
                </div>
              </div>
              
              <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
                <div className="bg-gradient-to-br from-white via-white to-blueberry-25 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-blueberry-300 hover:-translate-y-1">
                  <div className="text-4xl mb-6">⚡</div>
                  <h3 className="heading-3 text-neutral-900 mb-4">Automated Attendance</h3>
                  <p className="body-text text-neutral-700">
                    Streamline the tedious attendance process with AI-powered automation, freeing up valuable teaching time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Target Market Focus */}
        <section className="py-20 bg-gradient-to-br from-success-25 via-success-50 to-success-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="heading-2 bg-gradient-to-r from-success-700 to-success-800 bg-clip-text text-transparent mb-6">Our Focus: State Public Universities</h2>
              <p className="subtitle text-neutral-700 max-w-3xl mx-auto">
                Where the unemployability problem is most severe and our impact can be greatest
              </p>
            </div>
            
            <div className="bg-white backdrop-blur-sm rounded-3xl p-12 shadow-2xl border-2 border-success-300">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="heading-2 bg-gradient-to-r from-success-700 to-success-800 bg-clip-text text-transparent mb-6">Why SPUs Matter</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-success-600 font-bold text-lg">82%</span>
                      </div>
                      <div>
                        <h4 className="heading-3 text-neutral-900 mb-2">Majority Enrollment</h4>
                        <p className="body-text text-neutral-700">82% of graduate students are enrolled in State Public Universities</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-success-600">🎯</span>
                      </div>
                      <div>
                        <h4 className="heading-3 text-neutral-900 mb-2">Greatest Impact</h4>
                        <p className="body-text text-neutral-700">The unemployability problem is most prevalent in SPUs, making them our primary focus</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-success-600">📈</span>
                      </div>
                      <div>
                        <h4 className="heading-3 text-neutral-900 mb-2">Scalable Solution</h4>
                        <p className="body-text text-neutral-700">By solving for SPUs, we can transform education for millions of students across India</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-br from-success-500 via-success-600 to-success-700 rounded-3xl p-10 text-white shadow-xl">
                    <div className="heading-1 font-light mb-4">3.28 Cr</div>
                    <div className="subtitle mb-4">Students in SPUs</div>
                    <div className="body-text opacity-90">Our target market for maximum impact on graduate employability</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gradient-to-br from-blueberry-500 via-blueberry-600 to-blueberry-700">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="heading-2 text-white text-center mb-16">Frequently Asked Questions 💬</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
                <h3 className="subtitle text-white mb-6 text-center">👩‍🏫 For Teachers</h3>
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="teacher-1" className="bg-white/10 rounded-xl border border-white/10">
                    <AccordionTrigger className="text-white px-4 py-3 hover:no-underline">
                      How does AI help without replacing me?
                    </AccordionTrigger>
                    <AccordionContent className="text-white/90 px-4 pb-4">
                      AI handles routine tasks like attendance and content suggestions, freeing you to focus on teaching and mentoring students personally.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="teacher-2" className="bg-white/10 rounded-xl border border-white/10">
                    <AccordionTrigger className="text-white px-4 py-3 hover:no-underline">
                      Do I need technical training?
                    </AccordionTrigger>
                    <AccordionContent className="text-white/90 px-4 pb-4">
                      No extensive training required. We provide simple tutorials and ongoing support for our intuitive platform.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
                <h3 className="subtitle text-white mb-6 text-center">👨‍🎓 For Students</h3>
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="student-1" className="bg-white/10 rounded-xl border border-white/10">
                    <AccordionTrigger className="text-white px-4 py-3 hover:no-underline">
                      What kind of projects will I work on?
                    </AccordionTrigger>
                    <AccordionContent className="text-white/90 px-4 pb-4">
                      Industry-relevant projects based on real business challenges that build your portfolio and practical skills.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="student-2" className="bg-white/10 rounded-xl border border-white/10">
                    <AccordionTrigger className="text-white px-4 py-3 hover:no-underline">
                      Will this replace my professors?
                    </AccordionTrigger>
                    <AccordionContent className="text-white/90 px-4 pb-4">
                      No, it enhances your professor's ability to guide you by providing 24/7 support while they focus on mentorship.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl md:col-span-2 lg:col-span-1">
                <h3 className="subtitle text-white mb-6 text-center">🏫 For Institutions</h3>
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="institution-1" className="bg-white/10 rounded-xl border border-white/10">
                    <AccordionTrigger className="text-white px-4 py-3 hover:no-underline">
                      How much does it cost?
                    </AccordionTrigger>
                    <AccordionContent className="text-white/90 px-4 pb-4">
                      Free during beta. Post-beta pricing will be per-user, paid by institutions for maximum student benefit.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="institution-2" className="bg-white/10 rounded-xl border border-white/10">
                    <AccordionTrigger className="text-white px-4 py-3 hover:no-underline">
                      What are the technical requirements?
                    </AccordionTrigger>
                    <AccordionContent className="text-white/90 px-4 pb-4">
                      Just internet access and a web browser. Works on any device - no special software or hardware required.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-neutral-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="heading-2 bg-gradient-to-r from-white to-neutral-200 bg-clip-text text-transparent mb-6">Transform Education. Empower Humanity.</h2>
            <p className="subtitle text-neutral-300 mb-12">
              Join the movement to make 95% of graduates employable through AI-enhanced teaching
            </p>
            <Link href="/login">
              <button className="bg-gradient-to-r from-blueberry-500 via-blueberry-600 to-blueberry-700 hover:from-blueberry-600 hover:via-blueberry-700 hover:to-blueberry-800 text-white px-12 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1">
                Get Started Today
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}