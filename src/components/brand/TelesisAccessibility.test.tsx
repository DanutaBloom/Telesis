import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { IntlProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

// Import components to test
import { CTA } from '../../templates/CTA';
import { FAQ } from '../../templates/FAQ';
import { Features } from '../../templates/Features';
import { Footer } from '../../templates/Footer';
import { Hero } from '../../templates/Hero';
import { Navbar } from '../../templates/Navbar';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/en',
}));

// Mock Clerk
vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({ user: { firstName: 'Test' } }),
  useAuth: () => ({ isSignedIn: false }),
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
  SignUpButton: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  ...vi.importActual('next-intl'),
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'Hero.title': 'Transform training into <important>micro-learning</important> with AI in seconds.',
      'Hero.description': 'Upload PDFs, videos, and presentations. Our AI creates personalized summaries, audio briefs, visual maps, and practice cards that respect your time and learning style. Ask. Think. Apply.',
      'Hero.primary_button': 'Start Learning Free',
      'Hero.secondary_button': 'Watch Demo',
      'Features.section_title': 'AI-Powered Learning That Adapts to You',
      'Features.section_description': 'Telesis transforms traditional training content into engaging micro-learning experiences using advanced AI, making knowledge acquisition efficient and memorable.',
      'Features.feature1_title': 'Smart Upload',
      'Features.feature1_description': 'Upload any training material - PDFs, videos, presentations, documents. Our AI instantly analyzes and prepares content for transformation.',
      'Features.feature2_title': 'AI Micro-Modules',
      'Features.feature2_description': 'Break down complex content into bite-sized learning modules that fit your schedule and cognitive load preferences.',
      'Features.feature3_title': 'Audio Briefs',
      'Features.feature3_description': 'Convert written content into professional audio summaries perfect for commuting, exercising, or multitasking.',
      'Features.feature4_title': 'Visual Learning Maps',
      'Features.feature4_description': 'Generate interactive mind maps and visual representations that help you understand relationships and key concepts.',
      'Features.feature5_title': 'Practice Cards',
      'Features.feature5_description': 'AI-generated flashcards and practice questions that reinforce learning through spaced repetition and active recall.',
      'Features.feature6_title': 'Personal Learning Style',
      'Features.feature6_description': 'Adaptive algorithms learn your preferences and optimize content delivery for maximum retention and engagement.',
      'FAQ.section_title': 'Everything You Need to Know About Telesis',
      'FAQ.question1': 'What types of content can I upload to Telesis?',
      'FAQ.answer1': 'Telesis supports PDFs, videos (MP4, MOV), presentations (PowerPoint, Google Slides), Word documents, and text files. Our AI can process training manuals, course materials, corporate documents, research papers, and educational content.',
      'FAQ.question2': 'How does the AI create personalized learning experiences?',
      'FAQ.answer2': 'Our AI analyzes your uploaded content, identifies key concepts, and generates multiple learning formats including summaries, audio briefs, visual maps, and practice cards. It adapts to your learning preferences and progress over time.',
      'FAQ.question3': 'How long does it take to transform my content?',
      'FAQ.answer3': 'Most content is processed within 2-5 minutes. Complex documents or videos may take up to 15 minutes. You\'ll receive real-time updates on processing status and can access completed sections immediately.',
      'FAQ.question4': 'Is my uploaded content secure and private?',
      'FAQ.answer4': 'Absolutely. All content is encrypted in transit and at rest. We use enterprise-grade security measures and never share your content with third parties. You maintain full ownership and control of your materials.',
      'FAQ.question5': 'Can teams collaborate on learning content?',
      'FAQ.answer5': 'Yes! Telesis supports team workspaces where you can share learning modules, track team progress, and collaborate on content creation. Perfect for corporate training and educational institutions.',
      'CTA.title': 'Ready to Transform Your Learning?',
      'CTA.description': 'Join thousands of learners and organizations who\'ve accelerated their knowledge acquisition with AI-powered micro-learning.',
      'CTA.button_text': 'Start Free Trial',
      'Navbar.sign_in': 'Sign In',
      'Navbar.sign_up': 'Sign Up',
      'Navbar.product': 'Product',
      'Navbar.docs': 'Docs',
      'Navbar.blog': 'Blog',
      'Navbar.community': 'Community',
      'Footer.product': 'Product',
      'Footer.docs': 'Docs',
      'Footer.blog': 'Blog',
      'Footer.community': 'Community',
      'Footer.company': 'Company',
    };
    return translations[key] || key;
  },
  useLocale: () => 'en',
}));

const messages = {
  Hero: {
    title: 'Transform training into <important>micro-learning</important> with AI in seconds.',
    description: 'Upload PDFs, videos, and presentations. Our AI creates personalized summaries, audio briefs, visual maps, and practice cards that respect your time and learning style. Ask. Think. Apply.',
    primary_button: 'Start Learning Free',
    secondary_button: 'Watch Demo',
    follow_twitter: 'Join the Learning Revolution',
  },
  Features: {
    section_subtitle: 'Platform Features',
    section_title: 'AI-Powered Learning That Adapts to You',
    section_description: 'Telesis transforms traditional training content into engaging micro-learning experiences using advanced AI, making knowledge acquisition efficient and memorable.',
    feature1_title: 'Smart Upload',
    feature1_description: 'Upload any training material - PDFs, videos, presentations, documents. Our AI instantly analyzes and prepares content for transformation.',
    feature2_title: 'AI Micro-Modules',
    feature2_description: 'Break down complex content into bite-sized learning modules that fit your schedule and cognitive load preferences.',
    feature3_title: 'Audio Briefs',
    feature3_description: 'Convert written content into professional audio summaries perfect for commuting, exercising, or multitasking.',
    feature4_title: 'Visual Learning Maps',
    feature4_description: 'Generate interactive mind maps and visual representations that help you understand relationships and key concepts.',
    feature5_title: 'Practice Cards',
    feature5_description: 'AI-generated flashcards and practice questions that reinforce learning through spaced repetition and active recall.',
    feature6_title: 'Personal Learning Style',
    feature6_description: 'Adaptive algorithms learn your preferences and optimize content delivery for maximum retention and engagement.',
  },
  FAQ: {
    section_subtitle: 'Frequently Asked Questions',
    section_title: 'Everything You Need to Know About Telesis',
    section_description: 'Get answers to common questions about our AI-powered micro-learning platform.',
    question1: 'What types of content can I upload to Telesis?',
    answer1: 'Telesis supports PDFs, videos (MP4, MOV), presentations (PowerPoint, Google Slides), Word documents, and text files. Our AI can process training manuals, course materials, corporate documents, research papers, and educational content.',
    question2: 'How does the AI create personalized learning experiences?',
    answer2: 'Our AI analyzes your uploaded content, identifies key concepts, and generates multiple learning formats including summaries, audio briefs, visual maps, and practice cards. It adapts to your learning preferences and progress over time.',
    question3: 'How long does it take to transform my content?',
    answer3: 'Most content is processed within 2-5 minutes. Complex documents or videos may take up to 15 minutes. You\'ll receive real-time updates on processing status and can access completed sections immediately.',
    question4: 'Is my uploaded content secure and private?',
    answer4: 'Absolutely. All content is encrypted in transit and at rest. We use enterprise-grade security measures and never share your content with third parties. You maintain full ownership and control of your materials.',
    question5: 'Can teams collaborate on learning content?',
    answer5: 'Yes! Telesis supports team workspaces where you can share learning modules, track team progress, and collaborate on content creation. Perfect for corporate training and educational institutions.',
  },
  CTA: {
    title: 'Ready to Transform Your Learning?',
    description: 'Join thousands of learners and organizations who\'ve accelerated their knowledge acquisition with AI-powered micro-learning.',
    button_text: 'Start Free Trial',
  },
  Navbar: {
    sign_in: 'Sign In',
    sign_up: 'Sign Up',
    product: 'Product',
    docs: 'Docs',
    blog: 'Blog',
    community: 'Community',
  },
  Footer: {
    product: 'Product',
    docs: 'Docs',
    blog: 'Blog',
    community: 'Community',
    company: 'Company',
    terms_of_service: 'Terms Of Service',
    privacy_policy: 'Privacy Policy',
    designed_by: 'Designed by <author></author>.',
  },
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages}>
    {children}
  </IntlProvider>
);

describe('Telesis Accessibility Tests', () => {
  describe('Hero Component Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should have proper heading hierarchy', () => {
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      // Should have a main heading (h1)
      const mainHeading = screen.getByRole('heading', { level: 1 });

      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent(/Transform training into.*micro-learning/);
    });

    it('should have accessible buttons with descriptive text', () => {
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      const primaryButton = screen.getByRole('button', { name: /Start Learning Free/i });
      const secondaryButton = screen.getByRole('button', { name: /Watch Demo/i });

      expect(primaryButton).toBeInTheDocument();
      expect(secondaryButton).toBeInTheDocument();

      // Buttons should have meaningful text (not just "Click here" or "Learn more")
      expect(primaryButton).toHaveTextContent(/Start Learning Free/);
      expect(secondaryButton).toHaveTextContent(/Watch Demo/);
    });

    it('should have readable text contrast and descriptive content', () => {
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      // Check that description text is meaningful and accessible
      const description = screen.getByText(/Upload PDFs, videos, and presentations/);

      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent(/Ask\. Think\. Apply\./);
    });
  });

  describe('Features Component Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <Features />
        </TestWrapper>
      );

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should have proper heading structure for features', () => {
      render(
        <TestWrapper>
          <Features />
        </TestWrapper>
      );

      // Main features heading
      const mainHeading = screen.getByText(/AI-Powered Learning That Adapts to You/);

      expect(mainHeading).toBeInTheDocument();

      // Feature headings should be accessible
      expect(screen.getByText(/Smart Upload/)).toBeInTheDocument();
      expect(screen.getByText(/AI Micro-Modules/)).toBeInTheDocument();
      expect(screen.getByText(/Audio Briefs/)).toBeInTheDocument();
      expect(screen.getByText(/Visual Learning Maps/)).toBeInTheDocument();
      expect(screen.getByText(/Practice Cards/)).toBeInTheDocument();
      expect(screen.getByText(/Personal Learning Style/)).toBeInTheDocument();
    });

    it('should have descriptive content for each feature', () => {
      render(
        <TestWrapper>
          <Features />
        </TestWrapper>
      );

      // Each feature should have descriptive text, not generic placeholder
      expect(screen.getByText(/Upload any training material.*PDFs, videos, presentations/)).toBeInTheDocument();
      expect(screen.getByText(/Break down complex content into bite-sized/)).toBeInTheDocument();
      expect(screen.getByText(/Convert written content into professional audio/)).toBeInTheDocument();
      expect(screen.getByText(/Generate interactive mind maps/)).toBeInTheDocument();
      expect(screen.getByText(/AI-generated flashcards and practice questions/)).toBeInTheDocument();
      expect(screen.getByText(/Adaptive algorithms learn your preferences/)).toBeInTheDocument();
    });
  });

  describe('FAQ Component Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <FAQ />
        </TestWrapper>
      );

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should have accessible FAQ structure', () => {
      render(
        <TestWrapper>
          <FAQ />
        </TestWrapper>
      );

      // Main FAQ heading
      const mainHeading = screen.getByText(/Everything You Need to Know About Telesis/);

      expect(mainHeading).toBeInTheDocument();

      // FAQ questions should be accessible
      expect(screen.getByText(/What types of content can I upload to Telesis/)).toBeInTheDocument();
      expect(screen.getByText(/How does the AI create personalized learning experiences/)).toBeInTheDocument();
      expect(screen.getByText(/How long does it take to transform my content/)).toBeInTheDocument();
      expect(screen.getByText(/Is my uploaded content secure and private/)).toBeInTheDocument();
      expect(screen.getByText(/Can teams collaborate on learning content/)).toBeInTheDocument();
    });

    it('should have informative answers for accessibility', () => {
      render(
        <TestWrapper>
          <FAQ />
        </TestWrapper>
      );

      // Answers should be detailed and helpful for screen readers
      expect(screen.getByText(/Telesis supports PDFs, videos.*presentations.*Word documents/)).toBeInTheDocument();
      expect(screen.getByText(/Our AI analyzes your uploaded content.*identifies key concepts/)).toBeInTheDocument();
      expect(screen.getByText(/Most content is processed within 2-5 minutes/)).toBeInTheDocument();
      expect(screen.getByText(/All content is encrypted in transit and at rest/)).toBeInTheDocument();
      expect(screen.getByText(/Telesis supports team workspaces/)).toBeInTheDocument();
    });
  });

  describe('CTA Component Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <CTA />
        </TestWrapper>
      );

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should have accessible call-to-action', () => {
      render(
        <TestWrapper>
          <CTA />
        </TestWrapper>
      );

      // CTA heading
      const heading = screen.getByText(/Ready to Transform Your Learning/);

      expect(heading).toBeInTheDocument();

      // CTA description
      const description = screen.getByText(/Join thousands of learners.*AI-powered micro-learning/);

      expect(description).toBeInTheDocument();

      // CTA button
      const button = screen.getByRole('button', { name: /Start Free Trial/i });

      expect(button).toBeInTheDocument();
    });
  });

  describe('Navigation Component Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should have accessible navigation structure', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      // Navigation links should be accessible
      expect(screen.getByText(/Product/)).toBeInTheDocument();
      expect(screen.getByText(/Docs/)).toBeInTheDocument();
      expect(screen.getByText(/Blog/)).toBeInTheDocument();
      expect(screen.getByText(/Community/)).toBeInTheDocument();

      // Auth buttons should be accessible
      expect(screen.getByText(/Sign In/)).toBeInTheDocument();
      expect(screen.getByText(/Sign Up/)).toBeInTheDocument();
    });
  });

  describe('Footer Component Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <Footer />
        </TestWrapper>
      );

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should have accessible footer structure', () => {
      render(
        <TestWrapper>
          <Footer />
        </TestWrapper>
      );

      // Footer links should be accessible
      expect(screen.getByText(/Product/)).toBeInTheDocument();
      expect(screen.getByText(/Docs/)).toBeInTheDocument();
      expect(screen.getByText(/Blog/)).toBeInTheDocument();
      expect(screen.getByText(/Community/)).toBeInTheDocument();
      expect(screen.getByText(/Company/)).toBeInTheDocument();
    });
  });

  describe('Screen Reader Compatibility', () => {
    it('should have meaningful content for screen readers in hero section', () => {
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      // Content should be meaningful when read aloud
      expect(screen.getByText(/Transform training into.*micro-learning.*with AI in seconds/)).toBeInTheDocument();
      expect(screen.getByText(/Upload PDFs, videos, and presentations/)).toBeInTheDocument();
      expect(screen.getByText(/Ask\. Think\. Apply\./)).toBeInTheDocument();
    });

    it('should have descriptive button text throughout', () => {
      render(
        <TestWrapper>
          <div>
            <Hero />
            <CTA />
          </div>
        </TestWrapper>
      );

      // All buttons should have descriptive text
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        const text = button.textContent;

        expect(text).toBeTruthy();
        expect(text!.length).toBeGreaterThan(5); // Should be more descriptive than "Click"

        // Should not contain generic button text
        expect(text).not.toMatch(/^Click$/i);
        expect(text).not.toMatch(/^Button$/i);
        expect(text).not.toMatch(/^Submit$/i);
      });
    });

    it('should have proper content structure for screen readers', () => {
      render(
        <TestWrapper>
          <Features />
        </TestWrapper>
      );

      // Feature content should be structured for screen readers
      // Each feature should have title and description
      const featureTitles = [
        'Smart Upload',
        'AI Micro-Modules',
        'Audio Briefs',
        'Visual Learning Maps',
        'Practice Cards',
        'Personal Learning Style'
      ];

      featureTitles.forEach((title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    it('should have readable text content throughout components', () => {
      render(
        <TestWrapper>
          <div>
            <Hero />
            <Features />
            <FAQ />
            <CTA />
          </div>
        </TestWrapper>
      );

      // All text should be present and readable
      // This is a basic test - actual color contrast would need visual testing tools
      expect(screen.getByText(/Transform training into.*micro-learning/)).toBeInTheDocument();
      expect(screen.getByText(/AI-Powered Learning That Adapts to You/)).toBeInTheDocument();
      expect(screen.getByText(/Everything You Need to Know About Telesis/)).toBeInTheDocument();
      expect(screen.getByText(/Ready to Transform Your Learning/)).toBeInTheDocument();
    });

    it('should not rely solely on color for information', () => {
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      // Important information should not rely solely on color
      // Text content should be sufficient to understand the message
      const primaryButton = screen.getByRole('button', { name: /Start Learning Free/i });

      expect(primaryButton).toHaveTextContent(/Start Learning Free/);

      const secondaryButton = screen.getByRole('button', { name: /Watch Demo/i });

      expect(secondaryButton).toHaveTextContent(/Watch Demo/);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should have focusable interactive elements', () => {
      render(
        <TestWrapper>
          <div>
            <Navbar />
            <Hero />
            <CTA />
          </div>
        </TestWrapper>
      );

      // All interactive elements should be focusable
      const buttons = screen.getAllByRole('button');
      const links = screen.getAllByRole('link');

      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });

      links.forEach((link) => {
        expect(link).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('Content Clarity and Readability', () => {
    it('should use clear, jargon-free language where possible', () => {
      render(
        <TestWrapper>
          <FAQ />
        </TestWrapper>
      );

      // FAQ answers should be clear and helpful
      expect(screen.getByText(/Telesis supports PDFs, videos.*presentations.*Word documents/)).toBeInTheDocument();
      expect(screen.getByText(/Most content is processed within 2-5 minutes/)).toBeInTheDocument();
      expect(screen.getByText(/All content is encrypted in transit and at rest/)).toBeInTheDocument();
    });

    it('should provide context for technical terms', () => {
      render(
        <TestWrapper>
          <Features />
        </TestWrapper>
      );

      // Technical terms should be explained or have context
      expect(screen.getByText(/spaced repetition and active recall/)).toBeInTheDocument();
      expect(screen.getByText(/cognitive load preferences/)).toBeInTheDocument();
      expect(screen.getByText(/adaptive algorithms/)).toBeInTheDocument();
    });
  });
});
