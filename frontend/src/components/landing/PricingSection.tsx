import { Button } from '../ui/Button'

export interface PricingSectionProps {
  onChoosePlan?: (planId: string) => void
  onContactSales?: () => void
}

const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Ideal for small dealerships getting started.',
    price: '$199',
    period: '/mo',
    features: [
      'Core DMS Modules',
      'Up to 10 Users',
      'Basic Reporting',
      'Email Support'
    ],
    buttonText: 'Choose Plan',
    buttonVariant: 'secondary' as const,
    isPopular: false
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'The most popular choice for growing dealerships.',
    price: '$399',
    period: '/mo',
    features: [
      'All Starter Features',
      'Up to 50 Users',
      'Advanced Reporting & Analytics',
      'API Access',
      'Priority Phone & Email Support'
    ],
    buttonText: 'Choose Plan',
    buttonVariant: 'primary' as const,
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Comprehensive solution for large-scale operations.',
    price: 'Custom',
    period: '',
    features: [
      'All Professional Features',
      'Unlimited Users',
      'Dedicated Account Manager',
      'Onboarding & Training'
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'secondary' as const,
    isPopular: false
  }
]

export function PricingSection({ onChoosePlan, onContactSales }: PricingSectionProps) {
  const handleButtonClick = (planId: string, buttonText: string) => {
    if (buttonText === 'Contact Sales') {
      onContactSales?.()
    } else {
      onChoosePlan?.(planId)
    }
  }

  return (
    <section className="bg-[var(--secondary-color)] py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="typography_h2">
            Simple, Transparent Pricing
          </h2>
          <p className="typography_body max-w-3xl mx-auto">
            Choose the plan that's right for your dealership. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`p-8 rounded-lg shadow-lg flex flex-col ${
                plan.isPopular 
                  ? 'bg-[var(--text-primary)] text-white ring-2 ring-[var(--primary-color)]'
                  : 'bg-white'
              }`}
            >
              {/* Plan Header */}
              <h3 className={`text-2xl font-bold mb-2 ${
                plan.isPopular ? 'text-white' : 'text-[var(--text-primary)]'
              }`}>
                {plan.name}
              </h3>
              <p className={`mb-6 ${
                plan.isPopular ? 'text-gray-300' : 'typography_body'
              }`}>
                {plan.description}
              </p>

              {/* Price */}
              <div className={`text-4xl font-extrabold mb-6 ${
                plan.isPopular ? 'text-white' : 'text-[var(--text-primary)]'
              }`}>
                {plan.price}
                {plan.period && (
                  <span className={`text-lg font-medium ${
                    plan.isPopular ? 'text-gray-400' : 'text-[var(--text-secondary)]'
                  }`}>
                    {plan.period}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className={`space-y-4 mb-8 flex-grow ${
                plan.isPopular ? 'text-gray-300' : 'text-[var(--text-secondary)]'
              }`}>
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className={`w-5 h-5 mr-2 ${
                        plan.isPopular ? 'text-green-400' : 'text-green-500'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant={plan.isPopular ? 'primary' : 'secondary'}
                className="w-full text-center"
                onClick={() => handleButtonClick(plan.id, plan.buttonText)}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}