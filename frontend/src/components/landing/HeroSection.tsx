import { motion } from 'framer-motion'
import { Button } from '../ui/Button'

export interface HeroSectionProps {
  onDemoClick?: () => void
}

export function HeroSection({ onDemoClick }: HeroSectionProps) {
  return (
    <section className="relative">
      <div className="container mx-auto px-6 py-24 lg:py-32 flex flex-col lg:flex-row items-center">
        {/* Content */}
        <motion.div 
          className="lg:w-1/2 text-center lg:text-left"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.h1 
            className="typography_h1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            The Ultimate DMS for Car & Motorbike Dealerships
          </motion.h1>
          <motion.p 
            className="typography_body mt-4 mb-8 max-w-xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          >
            DealerFlow is the complete Dealership Management System designed to 
            streamline your operations, from sales and service to inventory and 
            customer relations. Drive efficiency and boost profits.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
          >
            <Button 
              variant="primary" 
              size="lg" 
              onClick={onDemoClick}
              className="text-lg"
            >
              Request a Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          className="lg:w-1/2 mt-12 lg:mt-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          <img
            alt="Modern car and motorbike dealership showroom"
            className="rounded-lg shadow-2xl w-full h-auto"
            src="https://images.unsplash.com/photo-1562141961-401663c1e57a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
          />
        </motion.div>
      </div>
    </section>
  )
}