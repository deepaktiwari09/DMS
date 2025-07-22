export interface FooterProps {
  onPrivacyClick?: () => void
  onTermsClick?: () => void
  onContactClick?: () => void
}

export function Footer({ onPrivacyClick, onTermsClick, onContactClick }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[var(--secondary-color)]">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-[var(--text-secondary)] text-sm">
            © {currentYear} DealerFlow. All rights reserved.
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <button
              className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] text-sm transition-colors"
              onClick={onPrivacyClick}
            >
              Privacy Policy
            </button>
            <button
              className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] text-sm transition-colors"
              onClick={onTermsClick}
            >
              Terms of Service
            </button>
            <button
              className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] text-sm transition-colors"
              onClick={onContactClick}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}