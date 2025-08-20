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
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold sage-text-gradient">
          Modern Sage Theme Showcase
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Comprehensive demonstration of Modern Sage color palette, components, and accessibility features
        </p>
      </div>

      {/* Button Variants */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold sage-text-primary">Button Variants</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <h2 className="text-2xl font-semibold sage-text-primary">Badge Variants</h2>
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
        <h2 className="text-2xl font-semibold sage-text-primary">Gradient Utilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="sage-gradient-primary p-6 rounded-lg text-white">
            <h3 className="font-semibold mb-2">Primary Gradient</h3>
            <p>sage-gradient-primary</p>
          </div>
          <div className="sage-gradient-subtle p-6 rounded-lg text-sage-stone">
            <h3 className="font-semibold mb-2">Subtle Gradient</h3>
            <p>sage-gradient-subtle</p>
          </div>
          <div className="sage-gradient-hero p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Hero Gradient</h3>
            <p>sage-gradient-hero (used in hero sections)</p>
          </div>
          <div className="sage-gradient-card p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Card Gradient</h3>
            <p>sage-gradient-card (for cards)</p>
          </div>
        </div>
      </div>

      {/* Form Elements */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold sage-text-primary">Form Elements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="space-y-2">
            <label className="text-sm font-medium">Standard Input</label>
            <Input placeholder="Enter text here..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Input</label>
            <Input type="email" placeholder="user@example.com" />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold sage-text-primary">Card Styles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="sage-card p-6">
            <h3 className="font-semibold mb-2">Standard Card</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Uses sage-card utility class with border and shadow
            </p>
            <Button variant="sage-primary" size="sm">Action</Button>
          </div>
          <div className="sage-card-subtle p-6">
            <h3 className="font-semibold mb-2">Subtle Card</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Uses sage-card-subtle with gradient background
            </p>
            <Button variant="sage-accent" size="sm">Action</Button>
          </div>
          <div className="bg-card border sage-border rounded-lg p-6">
            <h3 className="font-semibold mb-2">Custom Card</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Custom combination with sage-border
            </p>
            <Button variant="outline" size="sm">Action</Button>
          </div>
        </div>
      </div>

      {/* Interactive Elements */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold sage-text-primary">Interactive States</h2>
        <div className="space-y-3">
          <button className="sage-hover-primary p-3 rounded-md border sage-border w-full text-left">
            Hover for Primary Effect (sage-hover-primary)
          </button>
          <button className="sage-hover-accent p-3 rounded-md border sage-border w-full text-left">
            Hover for Accent Effect (sage-hover-accent)
          </button>
        </div>
      </div>

      {/* Accessibility Information */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold sage-text-primary">Accessibility Compliance</h2>
        <div className="sage-card-subtle p-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1 sage-text-accent">Light Mode Contrast</h4>
              <ul className="space-y-1">
                <li>• Quietude on Background: 4.52:1 (AA ✓)</li>
                <li>• Growth on Background: 7.8:1 (AAA ✓)</li>
                <li>• Text on Background: 12.6:1 (AAA ✓)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-1 sage-text-accent">Dark Mode Contrast</h4>
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
        <h2 className="text-2xl font-semibold sage-text-primary">Usage Examples</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hero Section Example</h3>
            <div className="sage-gradient-hero p-8 rounded-lg text-center">
              <Badge variant="sage-primary" className="mb-4">New Feature</Badge>
              <h4 className="text-2xl font-bold mb-3 sage-text-gradient">
                Welcome to Telesis
              </h4>
              <p className="text-muted-foreground mb-4">
                Experience the Modern Sage design system in action
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="sage-gradient">Get Started</Button>
                <Button variant="sage-subtle">Learn More</Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dashboard Card Example</h3>
            <div className="sage-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Learning Progress</h4>
                <Badge variant="sage-accent">85% Complete</Badge>
              </div>
              <div className="space-y-3">
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-sage-growth h-2 rounded-full" style={{ width: '85%' }}></div>
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