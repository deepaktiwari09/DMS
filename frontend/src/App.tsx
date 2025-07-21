import { useState } from 'react'
import { AppRouter } from './lib/router'
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui'

function App() {
  // For testing our components
  const [showTest, setShowTest] = useState(false)

  if (showTest) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h1 className="typography_h1">MotoCorp DMS - Component Test</h1>
            <Button 
              variant="ghost" 
              onClick={() => setShowTest(false)}
            >
              ← Back to Dashboard
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Button Components</CardTitle>
              <CardDescription>Testing button variants with our design system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="primary" isLoading>Loading...</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Input Components</CardTitle>
              <CardDescription>Form inputs with validation and icons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                label="Email" 
                type="email" 
                placeholder="Enter your email"
              />
              <Input 
                label="Search" 
                placeholder="Search customers..."
                leftIcon={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                }
              />
              <Input 
                label="Password" 
                type="password"
                placeholder="Enter password"
                error="Password is required"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="outline">
              <CardHeader>
                <CardTitle>Customers</CardTitle>
                <CardDescription>Manage your customer relationships</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="primary" className="w-full">View Customers</Button>
              </CardFooter>
            </Card>

            <Card variant="outline">
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>Track vehicles and parts</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="secondary" className="w-full">Manage Inventory</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="fixed top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowTest(true)}
        >
          🧪 Test Components
        </Button>
      </div>
      <AppRouter />
    </div>
  )
}

export default App