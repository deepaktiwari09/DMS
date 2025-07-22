import { 
  Header, 
  HeroSection, 
  ModulesSection, 
  TestimonialsSection, 
  PricingSection, 
  CTASection, 
  Footer 
} from '../../components/landing'

export interface LandingPageProps {
  onLoginClick?: () => void
  onRegisterClick?: () => void
  onDemoClick?: () => void
  onExploreModulesClick?: () => void
  onChoosePlan?: (planId: string) => void
  onContactSales?: () => void
  onGetStartedClick?: () => void
  onPrivacyClick?: () => void
  onTermsClick?: () => void
  onContactClick?: () => void
}

export function LandingPage({
  onLoginClick,
  onRegisterClick,
  onDemoClick,
  onExploreModulesClick,
  onChoosePlan,
  onContactSales,
  onGetStartedClick,
  onPrivacyClick,
  onTermsClick,
  onContactClick
}: LandingPageProps) {
  // Scroll to section handlers
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onLoginClick={onLoginClick}
        onRegisterClick={onRegisterClick}
      />
      
      <main className="flex-grow">
        <section id="home">
          <HeroSection 
            onDemoClick={onDemoClick}
          />
        </section>

        <section id="modules">
          <ModulesSection 
            onExploreModulesClick={onExploreModulesClick}
          />
        </section>

        <TestimonialsSection />

        <section id="pricing">
          <PricingSection 
            onChoosePlan={onChoosePlan}
            onContactSales={onContactSales}
          />
        </section>

        <CTASection 
          onGetStartedClick={onGetStartedClick}
        />
      </main>

      <Footer 
        onPrivacyClick={onPrivacyClick}
        onTermsClick={onTermsClick}
        onContactClick={onContactClick}
      />
    </div>
  )
}