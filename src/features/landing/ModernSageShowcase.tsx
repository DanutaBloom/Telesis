import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Modern Sage Theme Showcase Component
 *
 * Demonstrates all Modern Sage theme variants and components
 * for visual validation and accessibility testing
 */
export const ModernSageShowcase = () => {
  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h1 className="sage-text-gradient text-4xl font-bold">
          Modern Sage Theme Showcase
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Comprehensive demonstration of Modern Sage color palette, components, and accessibility features
        </p>
      </div>

      {/* Button Variants */}
      <div className="space-y-4">
        <h2 className="sage-text-primary text-2xl font-semibold">Button Variants</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Button variant="default">Default</Button>
          <Button variant="sage-primary">Sage Primary</Button>
          <Button variant="sage-accent">Sage Accent</Button>
          <Button variant="sage-gradient">Sage Gradient</Button>
          <Button variant="sage-subtle">Sage Subtle</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>

      {/* Badge Variants */}
      <div className="space-y-4">
        <h2 className="sage-text-primary text-2xl font-semibold">Badge Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="sage-primary">Sage Primary</Badge>
          <Badge variant="sage-accent">Sage Accent</Badge>
          <Badge variant="sage-subtle">Sage Subtle</Badge>
          <Badge variant="sage-gradient">Sage Gradient</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </div>

      {/* Gradient Backgrounds */}
      <div className="space-y-4">
        <h2 className="sage-text-primary text-2xl font-semibold">Gradient Utilities</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="sage-gradient-primary rounded-lg p-6 text-white">
            <h3 className="mb-2 font-semibold">Primary Gradient</h3>
            <p>sage-gradient-primary</p>
          </div>
          <div className="sage-gradient-subtle rounded-lg p-6 text-sage-stone">
            <h3 className="mb-2 font-semibold">Subtle Gradient</h3>
            <p>sage-gradient-subtle</p>
          </div>
          <div className="sage-gradient-hero rounded-lg p-6">
            <h3 className="mb-2 font-semibold">Hero Gradient</h3>
            <p>sage-gradient-hero (used in hero sections)</p>
          </div>
          <div className="sage-gradient-card rounded-lg p-6">
            <h3 className="mb-2 font-semibold">Card Gradient</h3>
            <p>sage-gradient-card (for cards)</p>
          </div>
        </div>
      </div>

      {/* Form Elements */}
      <div className="space-y-4">
        <h2 className="sage-text-primary text-2xl font-semibold">Form Elements</h2>
        <div className="grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="standard-input" className="text-sm font-medium">Standard Input</label>
            <Input id="standard-input" placeholder="Enter text here..." />
          </div>
          <div className="space-y-2">
            <label htmlFor="email-input" className="text-sm font-medium">Email Input</label>
            <Input id="email-input" type="email" placeholder="user@example.com" />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <h2 className="sage-text-primary text-2xl font-semibold">Card Styles</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="sage-card p-6">
            <h3 className="mb-2 font-semibold">Standard Card</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Uses sage-card utility class with border and shadow
            </p>
            <Button variant="sage-primary" size="sm">Action</Button>
          </div>
          <div className="sage-card-subtle p-6">
            <h3 className="mb-2 font-semibold">Subtle Card</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Uses sage-card-subtle with gradient background
            </p>
            <Button variant="sage-accent" size="sm">Action</Button>
          </div>
          <div className="sage-border rounded-lg border bg-card p-6">
            <h3 className="mb-2 font-semibold">Custom Card</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Custom combination with sage-border
            </p>
            <Button variant="outline" size="sm">Action</Button>
          </div>
        </div>
      </div>

      {/* Interactive Elements */}
      <div className="space-y-4">
        <h2 className="sage-text-primary text-2xl font-semibold">Interactive States</h2>
        <div className="space-y-3">
          <button type="button" className="sage-hover-primary sage-border w-full rounded-md border p-3 text-left">
            Hover for Primary Effect (sage-hover-primary)
          </button>
          <button type="button" className="sage-hover-accent sage-border w-full rounded-md border p-3 text-left">
            Hover for Accent Effect (sage-hover-accent)
          </button>
        </div>
      </div>

      {/* Accessibility Information */}
      <div className="space-y-4">
        <h2 className="sage-text-primary text-2xl font-semibold">Accessibility Compliance</h2>
        <div className="sage-card-subtle space-y-3 p-6">
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <h4 className="sage-text-accent mb-1 font-semibold">Light Mode Contrast</h4>
              <ul className="space-y-1">
                <li>• Quietude on Background: 4.52:1 (AA ✓)</li>
                <li>• Growth on Background: 7.8:1 (AAA ✓)</li>
                <li>• Text on Background: 12.6:1 (AAA ✓)</li>
              </ul>
            </div>
            <div>
              <h4 className="sage-text-accent mb-1 font-semibold">Dark Mode Contrast</h4>
              <ul className="space-y-1">
                <li>• Quietude on Background: 5.1:1 (AA ✓)</li>
                <li>• Growth on Background: 6.2:1 (AA ✓)</li>
                <li>• Text on Background: 12.6:1 (AAA ✓)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-4">
        <h2 className="sage-text-primary text-2xl font-semibold">Usage Examples</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hero Section Example</h3>
            <div className="sage-gradient-hero rounded-lg p-8 text-center">
              <Badge variant="sage-primary" className="mb-4">New Feature</Badge>
              <h4 className="sage-text-gradient mb-3 text-2xl font-bold">
                Welcome to Telesis
              </h4>
              <p className="mb-4 text-muted-foreground">
                Experience the Modern Sage design system in action
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="sage-gradient">Get Started</Button>
                <Button variant="sage-subtle">Learn More</Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dashboard Card Example</h3>
            <div className="sage-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-semibold">Learning Progress</h4>
                <Badge variant="sage-accent">85% Complete</Badge>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-sage-growth" style={{ width: '85%' }}></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  17 of 20 modules completed
                </p>
                <div className="flex gap-2">
                  <Button variant="sage-primary" size="sm">Continue Learning</Button>
                  <Button variant="ghost" size="sm">View Details</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
