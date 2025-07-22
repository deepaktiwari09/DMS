import React from 'react'

export interface AuthCardProps {
  /**
   * The main heading for the card
   */
  title?: string
  /**
   * The subtitle or description text
   */
  subtitle?: string
  /**
   * Show the DealerFlow logo and branding
   */
  showLogo?: boolean
  /**
   * Children content to render inside the card
   */
  children: React.ReactNode
  /**
   * Additional CSS classes for the card
   */
  className?: string
  /**
   * Whether to use the white card background or transparent
   */
  variant?: 'card' | 'transparent'
}

export function AuthCard({
  title,
  subtitle,
  showLogo = true,
  children,
  className = "",
  variant = 'card'
}: AuthCardProps) {
  const cardClasses = variant === 'card' 
    ? "bg-white p-8 sm:p-10 rounded-xl shadow-2xl"
    : ""

  return (
    <div className={`w-full ${cardClasses} ${className}`}>
      {showLogo && (
        <div className="text-center mb-8">
          <svg
            className="mx-auto h-12 w-auto text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 1 6.375 7.5h1.5m17.25 4.5v-1.875a3.375 3.375 0 0 1-3.375-3.375h-1.5a1.125 1.125 0 0 0-1.125 1.125v1.5A3.375 3.375 0 0 0 17.625 15h1.5m-7.5-6.375a3.375 3.375 0 0 0-3.375-3.375h-1.5a3.375 3.375 0 0 0-3.375 3.375V9.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {title && (
            <h1 className="text-3xl font-bold text-gray-900 mt-4">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-md text-gray-600 mt-2">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {!showLogo && (title || subtitle) && (
        <div className="text-center mb-8">
          {title && (
            <h1 className="text-3xl font-bold text-gray-900">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-md text-gray-600 mt-2">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {children}
    </div>
  )
}