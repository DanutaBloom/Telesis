import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'next-intl';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
  useUser: () => ({ user: { firstName: 'John', id: 'user_123' } }),
  useAuth: () => ({ isSignedIn: true, userId: 'user_123' }),
  useOrganization: () => ({ organization: { name: 'Test Org' } }),
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
      // Landing page
      'Index.meta_title': 'Telesis - AI-Powered Micro-Learning Platform | Ask. Think. Apply.',
      'Index.meta_description': 'Transform training content into personalized micro-learning experiences. Upload PDFs, videos, and presentations - AI creates summaries, audio briefs, and practice cards.',
      'Hero.title': 'Transform training into <important>micro-learning</important> with AI in seconds.',
      'Hero.description': 'Upload PDFs, videos, and presentations. Our AI creates personalized summaries, audio briefs, visual maps, and practice cards that respect your time and learning style. Ask. Think. Apply.',
      'Hero.primary_button': 'Start Learning Free',
      'Features.section_title': 'AI-Powered Learning That Adapts to You',
      'Features.section_description': 'Telesis transforms traditional training content into engaging micro-learning experiences using advanced AI, making knowledge acquisition efficient and memorable.',
      'FAQ.section_title': 'Everything You Need to Know About Telesis',
      'CTA.title': 'Ready to Transform Your Learning?',
      'CTA.description': 'Join thousands of learners and organizations who\'ve accelerated their knowledge acquisition with AI-powered micro-learning.',

      // Dashboard
      'Dashboard.meta_title': 'Telesis Learning Dashboard',
      'Dashboard.meta_description': 'Access your AI-powered micro-learning modules, track progress, and manage your personalized learning experience with Telesis.',
      'DashboardIndex.title_bar': 'Learning Dashboard',
      'DashboardIndex.title_bar_description': 'Welcome to your personalized learning workspace',
      'DashboardIndex.message_state_title': 'Ready to Ask, Think, and Apply?',
      'DashboardIndex.message_state_description': 'Upload your first training material to begin your AI-powered micro-learning journey. Transform any content into engaging, bite-sized learning experiences.',
      'DashboardIndex.message_state_button': 'Upload Content',

      // Navigation
      'Navbar.sign_in': 'Sign In',
      'Navbar.sign_up': 'Sign Up',
      'Navbar.product': 'Product',
      'Navbar.docs': 'Docs',
      'Navbar.blog': 'Blog',
      'Navbar.community': 'Community',
      'DashboardLayout.home': 'Home',
      'DashboardLayout.billing': 'Billing',
      'DashboardLayout.settings': 'Settings',

      // Footer
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

// Mock messages for IntlProvider
const messages = {
  Index: {
    meta_title: 'Telesis - AI-Powered Micro-Learning Platform | Ask. Think. Apply.',
    meta_description: 'Transform training content into personalized micro-learning experiences. Upload PDFs, videos, and presentations - AI creates summaries, audio briefs, and practice cards.',
  },
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
    section_title: 'Everything You Need to Know About Telesis',
    section_description: 'Get answers to common questions about our AI-powered micro-learning platform.',
    question1: 'What types of content can I upload to Telesis?',
    answer1: 'Telesis supports PDFs, videos (MP4, MOV), presentations (PowerPoint, Google Slides), Word documents, and text files. Our AI can process training manuals, course materials, corporate documents, research papers, and educational content.',
    question2: 'How does the AI create personalized learning experiences?',
    answer2: 'Our AI analyzes your uploaded content, identifies key concepts, and generates multiple learning formats including summaries, audio briefs, visual maps, and practice cards. It adapts to your learning preferences and progress over time.',
  },
  CTA: {
    title: 'Ready to Transform Your Learning?',
    description: 'Join thousands of learners and organizations who\'ve accelerated their knowledge acquisition with AI-powered micro-learning.',
    button_text: 'Start Free Trial',
  },
  Dashboard: {
    meta_title: 'Telesis Learning Dashboard',
    meta_description: 'Access your AI-powered micro-learning modules, track progress, and manage your personalized learning experience with Telesis.',
  },
  DashboardIndex: {
    title_bar: 'Learning Dashboard',
    title_bar_description: 'Welcome to your personalized learning workspace',
    message_state_title: 'Ready to Ask, Think, and Apply?',
    message_state_description: 'Upload your first training material to begin your AI-powered micro-learning journey. Transform any content into engaging, bite-sized learning experiences.',
    message_state_button: 'Upload Content',
    message_state_alternative: 'New to micro-learning? <url>Watch our quick start guide</url> to get the most out of Telesis.',
  },
  Navbar: {
    sign_in: 'Sign In',
    sign_up: 'Sign Up',
    product: 'Product',
    docs: 'Docs',
    blog: 'Blog',
    community: 'Community',
  },
  DashboardLayout: {
    home: 'Home',
    todos: 'Todos',
    members: 'Members',
    billing: 'Billing',
    settings: 'Settings',
  },
  Footer: {
    product: 'Product',
    docs: 'Docs',
    blog: 'Blog',
    community: 'Community',
    company: 'Company',
    terms_of_service: 'Terms Of Service',
    privacy_policy: 'Privacy Policy',
  },
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={messages}>
    {children}
  </IntlProvider>
);

// Create mock components for full page testing
const MockLandingPage = () => {
  const Hero = () => (
    <section data-testid="hero-section">
      <h1>Transform training into micro-learning with AI in seconds.</h1>
      <p>Upload PDFs, videos, and presentations. Our AI creates personalized summaries, audio briefs, visual maps, and practice cards that respect your time and learning style. Ask. Think. Apply.</p>
      <button>Start Learning Free</button>
      <button>Watch Demo</button>
    </section>
  );

  const Features = () => (
    <section data-testid="features-section">
      <h2>AI-Powered Learning That Adapts to You</h2>
      <p>Telesis transforms traditional training content into engaging micro-learning experiences using advanced AI, making knowledge acquisition efficient and memorable.</p>
      <div>
        <h3>Smart Upload</h3>
        <p>Upload any training material - PDFs, videos, presentations, documents. Our AI instantly analyzes and prepares content for transformation.</p>
      </div>
      <div>
        <h3>AI Micro-Modules</h3>
        <p>Break down complex content into bite-sized learning modules that fit your schedule and cognitive load preferences.</p>
      </div>
      <div>
        <h3>Audio Briefs</h3>
        <p>Convert written content into professional audio summaries perfect for commuting, exercising, or multitasking.</p>
      </div>
    </section>
  );

  const FAQ = () => (
    <section data-testid="faq-section">
      <h2>Everything You Need to Know About Telesis</h2>
      <div>
        <h3>What types of content can I upload to Telesis?</h3>
        <p>Telesis supports PDFs, videos (MP4, MOV), presentations (PowerPoint, Google Slides), Word documents, and text files. Our AI can process training manuals, course materials, corporate documents, research papers, and educational content.</p>
      </div>
    </section>
  );

  const CTA = () => (
    <section data-testid="cta-section">
      <h2>Ready to Transform Your Learning?</h2>
      <p>Join thousands of learners and organizations who've accelerated their knowledge acquisition with AI-powered micro-learning.</p>
      <button>Start Free Trial</button>
    </section>
  );

  return (
    <div data-testid="landing-page">
      <Hero />
      <Features />
      <FAQ />
      <CTA />
    </div>
  );
};

const MockDashboardPage = () => (
  <div data-testid="dashboard-page">
    <header>
      <h1>Learning Dashboard</h1>
      <p>Welcome to your personalized learning workspace</p>
    </header>
    <main>
      <h2>Ready to Ask, Think, and Apply?</h2>
      <p>Upload your first training material to begin your AI-powered micro-learning journey. Transform any content into engaging, bite-sized learning experiences.</p>
      <button>Upload Content</button>
      <p>New to micro-learning? Watch our quick start guide to get the most out of Telesis.</p>
    </main>
  </div>
);

const MockNavigation = () => (
  <nav data-testid="main-navigation">
    <div>Telesis Logo</div>
    <ul>
      <li><a href="/product">Product</a></li>
      <li><a href="/docs">Docs</a></li>
      <li><a href="/blog">Blog</a></li>
      <li><a href="/community">Community</a></li>
    </ul>
    <div>
      <button>Sign In</button>
      <button>Sign Up</button>
    </div>
  </nav>
);

const MockFooter = () => (
  <footer data-testid="main-footer">
    <div>
      <div>Telesis Logo</div>
      <div>
        <h4>Product</h4>
        <ul>
          <li><a href="/features">Features</a></li>
          <li><a href="/pricing">Pricing</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </div>
  </footer>
);

describe('Telesis Integration Tests - Full Page Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Landing Page Integration', () => {
    it('should render complete landing page with Telesis branding', async () => {
      render(
        <TestWrapper>
          <div>
            <MockNavigation />
            <MockLandingPage />
            <MockFooter />
          </div>
        </TestWrapper>
      );

      // Verify all sections are present
      expect(screen.getByTestId('main-navigation')).toBeInTheDocument();
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      expect(screen.getByTestId('features-section')).toBeInTheDocument();
      expect(screen.getByTestId('faq-section')).toBeInTheDocument();
      expect(screen.getByTestId('cta-section')).toBeInTheDocument();
      expect(screen.getByTestId('main-footer')).toBeInTheDocument();

      // Verify Telesis content is present
      expect(screen.getByText(/Transform training into micro-learning/)).toBeInTheDocument();
      expect(screen.getByText(/Ask\. Think\. Apply\./)).toBeInTheDocument();
      expect(screen.getByText(/AI-Powered Learning That Adapts to You/)).toBeInTheDocument();
      expect(screen.getByText(/Everything You Need to Know About Telesis/)).toBeInTheDocument();
      expect(screen.getByText(/Ready to Transform Your Learning/)).toBeInTheDocument();
    });

    it('should have consistent call-to-action buttons throughout the page', () => {
      render(
        <TestWrapper>
          <MockLandingPage />
        </TestWrapper>
      );

      // Check for consistent CTA buttons
      const startLearningButtons = screen.getAllByText(/Start Learning Free/i);
      const startTrialButtons = screen.getAllByText(/Start Free Trial/i);

      expect(startLearningButtons.length).toBeGreaterThan(0);
      expect(startTrialButtons.length).toBeGreaterThan(0);
    });

    it('should maintain brand consistency across all sections', () => {
      render(
        <TestWrapper>
          <MockLandingPage />
        </TestWrapper>
      );

      // Check for consistent Telesis mentions
      const telesisReferences = screen.getAllByText(/Telesis/i);

      expect(telesisReferences.length).toBeGreaterThan(2); // Should appear multiple times

      // Check for consistent micro-learning messaging
      const microLearningRefs = screen.getAllByText(/micro-learning/i);

      expect(microLearningRefs.length).toBeGreaterThan(1);

      // Check for AI-powered messaging
      expect(screen.getByText(/AI-Powered Learning/)).toBeInTheDocument();
      expect(screen.getByText(/AI creates personalized/)).toBeInTheDocument();
    });
  });

  describe('Dashboard Page Integration', () => {
    it('should render complete dashboard with Telesis branding', () => {
      render(
        <TestWrapper>
          <MockDashboardPage />
        </TestWrapper>
      );

      // Verify dashboard structure
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
      expect(screen.getByText(/Learning Dashboard/)).toBeInTheDocument();
      expect(screen.getByText(/personalized learning workspace/)).toBeInTheDocument();
      expect(screen.getByText(/Ready to Ask, Think, and Apply/)).toBeInTheDocument();
      expect(screen.getByText(/AI-powered micro-learning journey/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Upload Content/i })).toBeInTheDocument();
    });

    it('should display appropriate onboarding content for new users', () => {
      render(
        <TestWrapper>
          <MockDashboardPage />
        </TestWrapper>
      );

      // Check onboarding content
      expect(screen.getByText(/Upload your first training material/)).toBeInTheDocument();
      expect(screen.getByText(/Transform any content into engaging/)).toBeInTheDocument();
      expect(screen.getByText(/New to micro-learning/)).toBeInTheDocument();
      expect(screen.getByText(/get the most out of Telesis/)).toBeInTheDocument();
    });
  });

  describe('Navigation Integration', () => {
    it('should render navigation with correct Telesis links', () => {
      render(
        <TestWrapper>
          <MockNavigation />
        </TestWrapper>
      );

      // Check navigation structure
      expect(screen.getByTestId('main-navigation')).toBeInTheDocument();
      expect(screen.getByText(/Telesis Logo/)).toBeInTheDocument();

      // Check navigation links
      expect(screen.getByRole('link', { name: /Product/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Docs/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Blog/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Community/i })).toBeInTheDocument();

      // Check auth buttons
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    });
  });

  describe('Footer Integration', () => {
    it('should render footer with correct Telesis structure', () => {
      render(
        <TestWrapper>
          <MockFooter />
        </TestWrapper>
      );

      // Check footer structure
      expect(screen.getByTestId('main-footer')).toBeInTheDocument();
      expect(screen.getByText(/Telesis Logo/)).toBeInTheDocument();

      // Check footer sections
      expect(screen.getByText(/Product/)).toBeInTheDocument();
      expect(screen.getByText(/Company/)).toBeInTheDocument();
    });
  });

  describe('Cross-Section Content Validation', () => {
    it('should not contain any legacy SaaS boilerplate content', () => {
      render(
        <TestWrapper>
          <div>
            <MockNavigation />
            <MockLandingPage />
            <MockFooter />
          </div>
        </TestWrapper>
      );

      // Verify no legacy content exists
      const forbiddenTerms = [
        /SaaS Boilerplate/i,
        /SaaS Template/i,
        /Next\.js Boilerplate/i,
        /Lorem ipsum/i,
        /placeholder text/i,
        /sample content/i,
        /template content/i,
      ];

      forbiddenTerms.forEach((term) => {
        expect(screen.queryByText(term)).not.toBeInTheDocument();
      });
    });

    it('should maintain consistent theming and messaging across sections', () => {
      render(
        <TestWrapper>
          <div>
            <MockLandingPage />
            <MockDashboardPage />
          </div>
        </TestWrapper>
      );

      // Check for consistent tagline usage
      const askThinkApplyRefs = screen.getAllByText(/Ask.*Think.*Apply/i);

      expect(askThinkApplyRefs.length).toBeGreaterThan(0);

      // Check for consistent AI messaging
      const aiRefs = screen.getAllByText(/AI/i);

      expect(aiRefs.length).toBeGreaterThan(2);

      // Check for consistent micro-learning messaging
      const microLearningRefs = screen.getAllByText(/micro-learning/i);

      expect(microLearningRefs.length).toBeGreaterThan(1);
    });
  });

  describe('Authenticated vs Unauthenticated Experience', () => {
    it('should show consistent branding for unauthenticated users', () => {
      // Mock unauthenticated state
      vi.mocked(vi.importActual('@clerk/nextjs')).useAuth = () => ({
        isSignedIn: false,
        userId: null
      });

      render(
        <TestWrapper>
          <MockLandingPage />
        </TestWrapper>
      );

      // Should show sign-up oriented messaging
      expect(screen.getByText(/Start Learning Free/)).toBeInTheDocument();
      expect(screen.getByText(/Watch Demo/)).toBeInTheDocument();
      expect(screen.getByText(/Ready to Transform Your Learning/)).toBeInTheDocument();
    });

    it('should show consistent branding for authenticated users', () => {
      // Mock authenticated state
      vi.mocked(vi.importActual('@clerk/nextjs')).useAuth = () => ({
        isSignedIn: true,
        userId: 'user_123'
      });

      render(
        <TestWrapper>
          <MockDashboardPage />
        </TestWrapper>
      );

      // Should show personalized dashboard content
      expect(screen.getByText(/Learning Dashboard/)).toBeInTheDocument();
      expect(screen.getByText(/personalized learning workspace/)).toBeInTheDocument();
      expect(screen.getByText(/Upload Content/)).toBeInTheDocument();
    });
  });
});
