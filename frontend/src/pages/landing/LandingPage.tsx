import { 
  Header, 
  HeroSection, 
  ModulesSection, 
  TestimonialsSection, 
  PricingSection, 
  CTASection, 
  Footer 
} from '../../components/landing'
import { useAuthStore } from '../../stores/auth-store'
import { useRouter } from '@tanstack/react-router'

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
  const { setMockAuth } = useAuthStore();
  const router = useRouter();
  
  // Development helper
  const handleDevDashboard = () => {
    setMockAuth();
    router.navigate({ to: '/dashboard' });
  };
  
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
      
      {/* Development Helper - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={handleDevDashboard}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-bold"
            title="Development: Mock login and go to dashboard"
          >
            🚀 DEV: Dashboard
          </button>
        </div>
      )}
    </div>
  )
}