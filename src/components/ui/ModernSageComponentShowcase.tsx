"use client"

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Home,
  Info,
  Mail,
  Search
} from "lucide-react"
import * as React from "react"

import { Alert, AlertDescription, AlertTitle } from "./alert"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb"
import { Button } from "./button"
import { Input, InputWithIcon } from "./input"
import { LabeledProgress, Progress } from "./progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
// Card component not needed - using sage-card utility class

export const ModernSageComponentShowcase: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [progressValue, setProgressValue] = React.useState(65)

  // Simulate progress update
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgressValue((prev) => {
        const next = prev + 1
        return next > 100 ? 0 : next
      })
    }, 100)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mx-auto max-w-6xl space-y-12 p-8">
      <div className="space-y-4">
        <h1 className="sage-text-gradient text-4xl font-bold">
          Modern Sage Component Showcase
        </h1>
        <p className="text-lg text-sage-stone">
          Comprehensive showcase of Modern Sage themed UI components with WCAG AA compliance.
        </p>
      </div>

      {/* Alerts Section */}
      <section className="space-y-6">
        <h2 className="sage-text-primary text-2xl font-semibold">Alert Components</h2>
        <div className="grid gap-4">
          <Alert variant="info">
            <Info className="size-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              This is an informational alert using Modern Sage info variant.
            </AlertDescription>
          </Alert>

          <Alert variant="success">
            <CheckCircle className="size-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Operation completed successfully with sage-growth theming.
            </AlertDescription>
          </Alert>

          <Alert variant="warning">
            <AlertTriangle className="size-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Please review your settings before proceeding.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Something went wrong. Please try again.
            </AlertDescription>
          </Alert>

          <Alert variant="sage">
            <Info className="size-4" />
            <AlertTitle>Sage Theme</AlertTitle>
            <AlertDescription>
              Modern Sage themed alert with custom sage-mist background.
            </AlertDescription>
          </Alert>

          <Alert variant="sage-accent">
            <CheckCircle className="size-4" />
            <AlertTitle>Sage Accent</AlertTitle>
            <AlertDescription>
              Accent variant using sage-growth color palette.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Breadcrumb Section */}
      <section className="space-y-6">
        <h2 className="sage-text-primary text-2xl font-semibold">Breadcrumb Navigation</h2>
        <div className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="size-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Current Project</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>→</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/learning">Learning Paths</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>→</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>AI Fundamentals</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Progress Section */}
      <section className="space-y-6">
        <h2 className="sage-text-primary text-2xl font-semibold">Progress Indicators</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Progress</h3>
              <Progress value={progressValue} variant="default" />
              <Progress value={75} variant="sage" />
              <Progress value={85} variant="accent" />
              <Progress value={45} variant="subtle" />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sized Progress</h3>
              <Progress value={60} size="sm" variant="sage" />
              <Progress value={60} size="default" variant="sage" />
              <Progress value={60} size="lg" variant="sage" />
              <Progress value={60} size="xl" variant="sage" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Labeled Progress</h3>
            <LabeledProgress
              label="Learning Progress"
              value={progressValue}
              variant="sage"
            />
            <LabeledProgress
              label="Course Completion"
              value={82}
              variant="accent"
              valueFormat={v => `${v}% Complete`}
            />
            <LabeledProgress
              label="Module Progress"
              value={67}
              variant="success"
              showValue={false}
            />
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="space-y-6">
        <h2 className="sage-text-primary text-2xl font-semibold">Tabbed Interface</h2>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="sage-card p-6">
              <h3 className="sage-text-primary mb-3 text-xl font-semibold">Overview</h3>
              <p className="text-sage-stone">
                Welcome to the Modern Sage component showcase. This tab demonstrates the overview content
                with proper accessibility and Modern Sage theming.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <div className="sage-card p-6">
              <h3 className="sage-text-primary mb-3 text-xl font-semibold">Features</h3>
              <ul className="space-y-2 text-sage-stone">
                <li>• Modern Sage color palette with WCAG AA compliance</li>
                <li>• Accessible keyboard navigation</li>
                <li>• Responsive design patterns</li>
                <li>• TypeScript support with strict typing</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="sage-card p-6">
              <h3 className="sage-text-primary mb-3 text-xl font-semibold">Settings</h3>
              <p className="text-sage-stone">
                Configuration options and preferences would be displayed here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="help" className="space-y-4">
            <div className="sage-card p-6">
              <h3 className="sage-text-primary mb-3 text-xl font-semibold">Help</h3>
              <p className="text-sage-stone">
                Documentation and support information for using these components.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Enhanced Form Components Section */}
      <section className="space-y-6">
        <h2 className="sage-text-primary text-2xl font-semibold">Enhanced Form Components</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Input Variants</h3>
            <div className="space-y-3">
              <Input placeholder="Default input" />
              <Input placeholder="Error state" variant="error" />
              <Input placeholder="Success state" variant="success" />
              <Input placeholder="Sage themed" variant="sage" />
              <Input placeholder="Small size" inputSize="sm" />
              <Input placeholder="Large size" inputSize="lg" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Input with Icons</h3>
            <div className="space-y-3">
              <InputWithIcon
                placeholder="Search..."
                startIcon={<Search className="size-4" />}
                variant="sage"
              />
              <InputWithIcon
                placeholder="Email address"
                startIcon={<Mail className="size-4" />}
                type="email"
              />
              <InputWithIcon
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                startIcon={<Eye className="size-4" />}
                endIcon={(
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="sage-hover-primary rounded p-1"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                )}
              />
            </div>
          </div>
        </div>

        <div className="sage-card p-6">
          <h3 className="sage-text-primary mb-4 text-lg font-medium">Form with Enhanced States</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="sage-text-primary text-sm font-medium">Username</label>
              <Input placeholder="Enter username" variant="sage" />
              <p className="text-sm text-sage-stone">Choose a unique username</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-destructive">Email (Error)</label>
              <Input placeholder="Enter email" variant="error" />
              <p className="text-sm text-destructive">Please enter a valid email address</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-sage-growth">Verification Code (Success)</label>
              <Input placeholder="Enter code" variant="success" />
              <p className="flex items-center gap-2 text-sm text-sage-growth">
                <CheckCircle className="size-4" />
                Code verified successfully
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="sage-primary">Save Changes</Button>
              <Button variant="sage-subtle">Cancel</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Component Integration Example */}
      <section className="space-y-6">
        <h2 className="sage-text-primary text-2xl font-semibold">Integrated Example</h2>
        <div className="sage-card p-6">
          <h3 className="sage-text-primary mb-4 text-xl font-semibold">Learning Dashboard</h3>

          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Learning Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Alert variant="sage" className="mb-6">
            <Info className="size-4" />
            <AlertTitle>Welcome Back!</AlertTitle>
            <AlertDescription>
              Continue your learning journey. You're making great progress!
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="progress" className="space-y-4">
            <TabsList>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <LabeledProgress
                    label="Overall Progress"
                    value={78}
                    variant="sage"
                  />
                </div>
                <div>
                  <LabeledProgress
                    label="Current Module"
                    value={45}
                    variant="accent"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <p className="text-sage-stone">Your enrolled courses would be displayed here.</p>
            </TabsContent>

            <TabsContent value="achievements">
              <p className="text-sage-stone">Your achievements and badges would be shown here.</p>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
