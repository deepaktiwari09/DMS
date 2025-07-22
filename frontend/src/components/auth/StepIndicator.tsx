import React from 'react'

export interface StepIndicatorProps {
  /**
   * Current active step (1-based index)
   */
  currentStep: number
  /**
   * Total number of steps
   */
  totalSteps: number
  /**
   * Step titles/labels
   */
  steps: string[]
  /**
   * Additional CSS classes
   */
  className?: string
}

export function StepIndicator({
  currentStep,
  totalSteps,
  steps,
  className = ""
}: StepIndicatorProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep
        const isUpcoming = stepNumber > currentStep
        
        return (
          <div key={stepNumber} className="flex items-center">
            {/* Step Circle */}
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 ring-2 ring-blue-600 ring-offset-2'
                    : isCompleted
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              
              {/* Step Label */}
              <div className="ml-4 min-w-0 flex-1">
                <p
                  className={`text-sm font-medium ${
                    isActive
                      ? 'text-blue-600'
                      : isCompleted
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}
                >
                  {step}
                </p>
              </div>
            </div>
            
            {/* Connector Line */}
            {stepNumber < totalSteps && (
              <div
                className={`hidden sm:block flex-1 h-0.5 mx-4 ${
                  stepNumber < currentStep ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}