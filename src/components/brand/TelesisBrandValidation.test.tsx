import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { DashboardHeader } from '../../features/dashboard/DashboardHeader';
import { MessageState } from '../../features/dashboard/MessageState';
import { CTA } from '../../templates/CTA';
import { FAQ } from '../../templates/FAQ';
import { Features } from '../../templates/Features';
import { Footer } from '../../templates/Footer';
// Import components to test
import { Hero } from '../../templates/Hero';
import { Navbar } from '../../templates/Navbar';

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

// Mock next-intl hooks
vi.mock('next-intl', () => ({
  ...vi.importActual('next-intl'),
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'Hero.title': 'Transform training into micro-learning with AI in seconds.',
      'Hero.description': 'Upload PDFs, videos, and presentations. Our AI creates personalized summaries, audio briefs, visual maps, and practice cards that respect your time and learning style. Ask. Think. Apply.',
      'Hero.primary_button': 'Start Learning Free',
      'Hero.secondary_button': 'Watch Demo',
      'Features.section_title': 'AI-Powered Learning That Adapts to You',
      'Features.section_description': 'Telesis transforms traditional training content into engaging micro-learning experiences using advanced AI, making knowledge acquisition efficient and memorable.',
      'Features.feature1_title': 'Smart Upload',
      'Features.feature1_description': 'Upload any training material - PDFs, videos, presentations, documents. Our AI instantly analyzes and prepares content for transformation.',
      'FAQ.section_title': 'Everything You Need to Know About Telesis',
      'FAQ.question1': 'What types of content can I upload to Telesis?',
      'FAQ.answer1': 'Telesis supports PDFs, videos (MP4, MOV), presentations (PowerPoint, Google Slides), Word documents, and text files. Our AI can process training manuals, course materials, corporate documents, research papers, and educational content.',
      'CTA.title': 'Ready to Transform Your Learning?',
      'CTA.description': 'Join thousands of learners and organizations who\'ve accelerated their knowledge acquisition with AI-powered micro-learning.',
      'CTA.button_text': 'Start Free Trial',
      'Footer.product': 'Product',
      'Footer.docs': 'Docs',
      'Footer.blog': 'Blog',
      'Footer.community': 'Community',
      'Navbar.sign_in': 'Sign In',
      'Navbar.sign_up': 'Sign Up',
      'Navbar.product': 'Product',
      'DashboardIndex.title_bar': 'Learning Dashboard',
      'DashboardIndex.title_bar_description': 'Welcome to your personalized learning workspace',
      'DashboardIndex.message_state_title': 'Ready to Ask, Think, and Apply?',
      'DashboardIndex.message_state_description': 'Upload your first training material to begin your AI-powered micro-learning journey. Transform any content into engaging, bite-sized learning experiences.',
      'DashboardIndex.message_state_button': 'Upload Content',
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
  },
  Features: {
    section_title: 'AI-Powered Learning That Adapts to You',
    section_description: 'Telesis transforms traditional training content into engaging micro-learning experiences using advanced AI, making knowledge acquisition efficient and memorable.',
    feature1_title: 'Smart Upload',
    feature1_description: 'Upload any training material - PDFs, videos, presentations, documents. Our AI instantly analyzes and prepares content for transformation.',
  },
  FAQ: {
    section_title: 'Everything You Need to Know About Telesis',
    question1: 'What types of content can I upload to Telesis?',
    answer1: 'Telesis supports PDFs, videos (MP4, MOV), presentations (PowerPoint, Google Slides), Word documents, and text files. Our AI can process training manuals, course materials, corporate documents, research papers, and educational content.',
  },
  CTA: {
    title: 'Ready to Transform Your Learning?',
    description: 'Join thousands of learners and organizations who\'ve accelerated their knowledge acquisition with AI-powered micro-learning.',
    button_text: 'Start Free Trial',
  },
  Footer: {
    product: 'Product',
    docs: 'Docs',
    blog: 'Blog',
    community: 'Community',
  },
  Navbar: {
    sign_in: 'Sign In',
    sign_up: 'Sign Up',
    product: 'Product',
  },
  DashboardIndex: {
    title_bar: 'Learning Dashboard',
    title_bar_description: 'Welcome to your personalized learning workspace',
    message_state_title: 'Ready to Ask, Think, and Apply?',
    message_state_description: 'Upload your first training material to begin your AI-powered micro-learning journey. Transform any content into engaging, bite-sized learning experiences.',
    message_state_button: 'Upload Content',
  },
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages}>
    {children}
  </IntlProvider>
);

describe('Telesis Brand Validation Tests', () => {
  describe('Hero Component Branding', () => {
    it('should display correct Telesis hero messaging', () => {
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      // Check for key Telesis messaging
      expect(screen.getByText(/Transform training into/)).toBeInTheDocument();
      expect(screen.getByText(/micro-learning/)).toBeInTheDocument();
      expect(screen.getByText(/Ask\. Think\. Apply\./)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Start Learning Free/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Watch Demo/i })).toBeInTheDocument();
    });

    it('should not contain any SaaS boilerplate references', () => {
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      // Ensure no old branding exists
      expect(screen.queryByText(/SaaS/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/boilerplate/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/template/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Lorem ipsum/i)).not.toBeInTheDocument();
    });
  });

  describe('Features Component Branding', () => {
    it('should display Telesis-specific features', () => {
      render(
        <TestWrapper>
          <Features />
        </TestWrapper>
      );

      // Check for Telesis-specific features
      expect(screen.getByText(/AI-Powered Learning That Adapts to You/)).toBeInTheDocument();
      expect(screen.getByText(/Telesis transforms traditional training content/)).toBeInTheDocument();
      expect(screen.getByText(/Smart Upload/)).toBeInTheDocument();
      expect(screen.getByText(/Upload any training material/)).toBeInTheDocument();
    });

    it('should not contain generic SaaS features', () => {
      render(
        <TestWrapper>
          <Features />
        </TestWrapper>
      );

      // Ensure no generic SaaS features
      expect(screen.queryByText(/Generic Feature/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Lorem ipsum/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument();
    });
  });

  describe('FAQ Component Branding', () => {
    it('should display Telesis-specific FAQ content', () => {
      render(
        <TestWrapper>
          <FAQ />
        </TestWrapper>
      );

      // Check for Telesis-specific FAQ
      expect(screen.getByText(/Everything You Need to Know About Telesis/)).toBeInTheDocument();
      expect(screen.getByText(/What types of content can I upload to Telesis/)).toBeInTheDocument();
      expect(screen.getByText(/Telesis supports PDFs, videos/)).toBeInTheDocument();
    });
  });

  describe('CTA Component Branding', () => {
    it('should display Telesis-specific call to action', () => {
      render(
        <TestWrapper>
          <CTA />
        </TestWrapper>
      );

      // Check for Telesis CTA
      expect(screen.getByText(/Ready to Transform Your Learning/)).toBeInTheDocument();
      expect(screen.getByText(/AI-powered micro-learning/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Start Free Trial/i })).toBeInTheDocument();
    });
  });

  describe('Navigation Component Branding', () => {
    it('should display correct navigation items', () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      // Check navigation items
      expect(screen.getByText(/Product/)).toBeInTheDocument();
      expect(screen.getByText(/Sign In/)).toBeInTheDocument();
      expect(screen.getByText(/Sign Up/)).toBeInTheDocument();
    });
  });

  describe('Footer Component Branding', () => {
    it('should display correct footer links', () => {
      render(
        <TestWrapper>
          <Footer />
        </TestWrapper>
      );

      // Check footer links
      expect(screen.getByText(/Product/)).toBeInTheDocument();
      expect(screen.getByText(/Docs/)).toBeInTheDocument();
      expect(screen.getByText(/Blog/)).toBeInTheDocument();
      expect(screen.getByText(/Community/)).toBeInTheDocument();
    });
  });

  describe('Dashboard Component Branding', () => {
    it('should display Telesis dashboard branding', () => {
      render(
        <TestWrapper>
          <DashboardHeader
            menu={[
              { href: '/dashboard', label: 'Dashboard' },
              { href: '/dashboard/content', label: 'Content' },
            ]}
          />
        </TestWrapper>
      );

      // Check dashboard header
      expect(screen.getByText(/Learning Dashboard/)).toBeInTheDocument();
      expect(screen.getByText(/personalized learning workspace/)).toBeInTheDocument();
    });

    it('should display correct message state for new users', () => {
      render(
        <TestWrapper>
          <MessageState
            icon={<div>📚</div>}
            title="Ready to Ask, Think, and Apply?"
            description="Upload your first training material to begin your AI-powered micro-learning journey. Transform any content into engaging, bite-sized learning experiences."
            button={<button>Upload Content</button>}
          />
        </TestWrapper>
      );

      // Check message state content
      expect(screen.getByText(/Ready to Ask, Think, and Apply/)).toBeInTheDocument();
      expect(screen.getByText(/AI-powered micro-learning journey/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Upload Content/i })).toBeInTheDocument();
    });
  });

  describe('Content Validation - No Old Branding', () => {
    const components = [
      { name: 'Hero', component: <Hero /> },
      { name: 'Features', component: <Features /> },
      { name: 'FAQ', component: <FAQ /> },
      { name: 'CTA', component: <CTA /> },
      { name: 'Footer', component: <Footer /> },
      { name: 'Navbar', component: <Navbar /> },
    ];

    components.forEach(({ name, component }) => {
      it(`should not contain old branding in ${name} component`, () => {
        render(<TestWrapper>{component}</TestWrapper>);

        // List of forbidden terms that should not appear
        const forbiddenTerms = [
          /SaaS Boilerplate/i,
          /SaaS Template/i,
          /Next\.js Boilerplate/i,
          /Lorem ipsum/i,
          /placeholder text/i,
          /sample content/i,
          /template content/i,
          /boilerplate/i,
        ];

        forbiddenTerms.forEach((term) => {
          expect(screen.queryByText(term)).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('Brand Consistency', () => {
    it('should use consistent Telesis tagline across components', () => {
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      // Check for consistent "Ask. Think. Apply." tagline
      expect(screen.getByText(/Ask\. Think\. Apply\./)).toBeInTheDocument();
    });

    it('should use consistent micro-learning messaging', () => {
      const { rerender } = render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      expect(screen.getByText(/micro-learning/)).toBeInTheDocument();

      rerender(
        <TestWrapper>
          <Features />
        </TestWrapper>
      );

      expect(screen.getByText(/micro-learning/)).toBeInTheDocument();
    });

    it('should use consistent AI-powered messaging', () => {
      render(
        <TestWrapper>
          <Features />
        </TestWrapper>
      );

      expect(screen.getByText(/AI-Powered Learning/)).toBeInTheDocument();
    });
  });
});
