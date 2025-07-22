import { Button } from '../ui/Button'

export interface CTASectionProps {
  onGetStartedClick?: () => void
}

export function CTASection({ onGetStartedClick }: CTASectionProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="bg-[var(--text-primary)] rounded-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">
            Ready to Drive Your Dealership Forward?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            See how DealerFlow can revolutionize your operations and boost your bottom line.
          </p>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={onGetStartedClick}
            className="text-lg"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  )
}