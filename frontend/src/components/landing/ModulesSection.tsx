import { motion } from 'framer-motion'
import { Button } from '../ui/Button'

export interface ModulesSectionProps {
  onExploreModulesClick?: () => void
}

const modules = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: "Get a 360° view of your dealership's performance with real-time data and analytics.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    id: 'sales',
    title: 'Sales',
    description: 'Manage leads, track deals, and close sales faster with our intuitive sales pipeline.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.156 0-2.982C10.544 7.719 11.275 7.5 12 7.5c.883 0 1.697.234 2.372.658"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    id: 'service',
    title: 'Service',
    description: 'Streamline service appointments, manage work orders, and enhance customer satisfaction.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path
          d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.664 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.474-4.474c-.048-.58-.122-1.193-.266-1.743M11.42 15.17l-4.655 5.653"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    id: 'inventory',
    title: 'Inventory',
    description: 'Track vehicle and parts inventory with precision, from acquisition to sale.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    id: 'customer-management',
    title: 'Customer Mgt.',
    description: 'Build lasting customer relationships with integrated CRM and communication tools.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.14.237-.28.348-.432m-6.076-3.07a6.375 6.375 0 01-4.242-4.242 6.375 6.375 0 017.598-2.285A6.375 6.375 0 0115 9.421a6.375 6.375 0 01-2.924 5.603z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
]

export function ModulesSection({ onExploreModulesClick }: ModulesSectionProps) {
  return (
    <section className="bg-[var(--secondary-color)] py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="typography_h2">
            Powerful Modules to Drive Your Business
          </h2>
          <p className="typography_body max-w-3xl mx-auto">
            DealerFlow integrates every aspect of your dealership into one 
            seamless platform, giving you complete control and visibility.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: 'easeOut' 
              }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <motion.div 
                className="flex justify-center mb-4"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1 + 0.2,
                  ease: 'easeOut' 
                }}
              >
                <div className="bg-[var(--primary-color)]/10 text-[var(--primary-color)] rounded-full p-3">
                  {module.icon}
                </div>
              </motion.div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                {module.title}
              </h3>
              <p className="typography_body">
                {module.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button 
            variant="secondary" 
            onClick={onExploreModulesClick}
          >
            Explore All Modules
          </Button>
        </div>
      </div>
    </section>
  )
}