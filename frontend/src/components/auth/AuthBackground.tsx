import React from 'react'

export interface AuthBackgroundProps {
  /**
   * The image URL to use as background
   */
  imageUrl?: string
  /**
   * The opacity of the overlay (0-1)
   */
  overlayOpacity?: number
  /**
   * Children to render over the background
   */
  children: React.ReactNode
  /**
   * Additional CSS classes for the container
   */
  className?: string
}

export function AuthBackground({
  imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCR81gHjKmqJQkV9CY8YkRfGfxfiVbubIuPvoiFeWESyglb0L3GrBaKXusQnb2iEvy3DIr_rz8hRpOTAN1uiZLmvSn2qAiDacB0aymanbnKtSO5YVHPLyOAbLq4Jat0Ro-LCAeTMHB724mpa2xWkhMuHU3ZiqCTDsMtfiTidjBJQJ-m_zDH944VKVaJAC93ieSuPpREQVtKue50zvnkxhTGNSPNd_h9BHEBtIajA2kqdVKiezSQCgRJ8mWseKxq1z31wOeItQZuOUSD",
  overlayOpacity = 0.5,
  children,
  className = ""
}: AuthBackgroundProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          alt="Background image of a sports car"
          className="w-full h-full object-cover"
          src={imageUrl}
        />
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md space-y-8">
        {children}
      </div>
    </div>
  )
}