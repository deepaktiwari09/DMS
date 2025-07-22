import { useState } from 'react'
import { Button } from '../ui/Button'

export interface HeaderProps {
  onLoginClick?: () => void
  onRegisterClick?: () => void
}

export function Header({ onLoginClick, onRegisterClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg
              className="h-8 w-8 text-[var(--primary-color)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21a3 3 0 01-4.242 0c-1.172-1.172-1.172-3.07 0-4.242l4.62-4.621a3 3 0 012.122-.88h1.007M14.25 9.75h1.007a3 3 0 012.122.88l4.62 4.621a3 3 0 010 4.242 3 3 0 01-4.242 0l-1.621-1.622m-7.5-6.379a3 3 0 00-4.242 0L3 14.25m18-4.5l-4.62-4.621a3 3 0 00-2.122-.88H12.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              DealerFlow
            </h2>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
              href="#home"
            >
              Home
            </a>
            <a
              className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
              href="#modules"
            >
              Modules
            </a>
            <a
              className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
              href="#pricing"
            >
              Pricing
            </a>
            <a
              className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
              href="#contact"
            >
              Contact
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors font-medium"
              onClick={onLoginClick}
            >
              Login
            </button>
            <Button 
              variant="primary" 
              onClick={onRegisterClick}
            >
              Register
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-[var(--text-primary)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6h16M4 12h16m-7 6h7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a
                className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
                href="#home"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
                href="#modules"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Modules
              </a>
              <a
                className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
                href="#pricing"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200">
                <button
                  className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors font-medium text-left"
                  onClick={() => {
                    onLoginClick?.()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Login
                </button>
                <Button 
                  variant="primary" 
                  onClick={() => {
                    onRegisterClick?.()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Register
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}