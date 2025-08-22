import { describe, expect, it } from 'vitest';

// Import localization files directly
import enMessages from '../locales/en.json';
import frMessages from '../locales/fr.json';

describe('Simple Content Validation - Telesis Branding', () => {
  describe('English Localization Validation', () => {
    it('should not contain any SaaS boilerplate references', () => {
      const jsonString = JSON.stringify(enMessages);

      const forbiddenTerms = [
        'SaaS Boilerplate',
        'SaaS Template',
        'Next.js Boilerplate',
        'Lorem ipsum',
        'placeholder text',
        'sample content',
        'template content',
        'Your SaaS',
        'My SaaS',
      ];

      forbiddenTerms.forEach((term) => {
        expect(jsonString).not.toContain(term);
      });
    });

    it('should contain proper Telesis branding elements', () => {
      const jsonString = JSON.stringify(enMessages);

      // Check for required Telesis content
      expect(jsonString).toContain('Telesis');
      expect(jsonString).toContain('micro-learning');
      expect(jsonString).toContain('AI-powered');
      expect(jsonString).toContain('Ask. Think. Apply');
      expect(jsonString).toContain('Transform training');
    });

    it('should have correct hero messaging', () => {
      expect(enMessages.Hero.title).toContain('micro-learning');
      expect(enMessages.Hero.description).toContain('Ask. Think. Apply.');
      expect(enMessages.Hero.primary_button).toBe('Start Learning Free');
      expect(enMessages.Hero.secondary_button).toBe('Watch Demo');
    });

    it('should have correct features section', () => {
      expect(enMessages.Features.section_title).toBe('AI-Powered Learning That Adapts to You');
      expect(enMessages.Features.section_description).toContain('Telesis transforms traditional training content');

      // Check all 6 features exist with proper names
      expect(enMessages.Features.feature1_title).toBe('Smart Upload');
      expect(enMessages.Features.feature2_title).toBe('AI Micro-Modules');
      expect(enMessages.Features.feature3_title).toBe('Audio Briefs');
      expect(enMessages.Features.feature4_title).toBe('Visual Learning Maps');
      expect(enMessages.Features.feature5_title).toBe('Practice Cards');
      expect(enMessages.Features.feature6_title).toBe('Personal Learning Style');
    });

    it('should have correct FAQ section', () => {
      expect(enMessages.FAQ.section_title).toBe('Everything You Need to Know About Telesis');
      expect(enMessages.FAQ.question1).toContain('upload to Telesis');
      expect(enMessages.FAQ.answer1).toContain('Telesis supports');
    });

    it('should have correct CTA section', () => {
      expect(enMessages.CTA.title).toBe('Ready to Transform Your Learning?');
      expect(enMessages.CTA.description).toContain('AI-powered micro-learning');
      expect(enMessages.CTA.button_text).toBe('Start Free Trial');
    });

    it('should have correct dashboard content', () => {
      expect(enMessages.Dashboard.meta_title).toBe('Telesis Learning Dashboard');
      expect(enMessages.DashboardIndex.title_bar).toBe('Learning Dashboard');
      expect(enMessages.DashboardIndex.message_state_title).toBe('Ready to Ask, Think, and Apply?');
      expect(enMessages.DashboardIndex.message_state_description).toContain('AI-powered micro-learning journey');
    });

    it('should have correct pricing content', () => {
      expect(enMessages.Pricing.section_title).toBe('Choose the Perfect Plan for Your Learning Goals');
      expect(enMessages.Pricing.section_description).toContain('AI transformations');
      expect(enMessages.PricingPlan.feature_website).toContain('AI Transformations');
    });

    it('should have proper meta information', () => {
      expect(enMessages.Index.meta_title).toBe('Telesis - AI-Powered Micro-Learning Platform | Ask. Think. Apply.');
      expect(enMessages.Index.meta_description).toContain('Transform training content into personalized micro-learning experiences');
    });
  });

  describe('French Localization Validation', () => {
    it('should exist and not contain old branding', () => {
      expect(frMessages).toBeDefined();
      expect(typeof frMessages).toBe('object');

      const jsonString = JSON.stringify(frMessages);

      // If French translations exist, they should also not contain old branding
      if (Object.keys(frMessages).length > 0) {
        const forbiddenTerms = [
          'SaaS Boilerplate',
          'Lorem ipsum',
          'placeholder text',
        ];

        forbiddenTerms.forEach((term) => {
          expect(jsonString).not.toContain(term);
        });
      }
    });
  });

  describe('Content Consistency Validation', () => {
    it('should use consistent terminology', () => {
      const jsonString = JSON.stringify(enMessages);

      // Check for consistent use of "micro-learning"
      expect(jsonString).toContain('micro-learning');
      expect(jsonString).not.toContain('microlearning');
      expect(jsonString).not.toContain('micro learning');
    });

    it('should use consistent AI terminology', () => {
      const jsonString = JSON.stringify(enMessages);

      // Check for consistent use of "AI-powered"
      expect(jsonString).toContain('AI-powered');
    });

    it('should have consistent CTAs', () => {
      // Primary CTAs should be learning-focused
      expect(enMessages.Hero.primary_button).toBe('Start Learning Free');
      expect(enMessages.CTA.button_text).toBe('Start Free Trial');
      expect(enMessages.Pricing.button_text).toBe('Start Free Trial');
    });

    it('should maintain consistent brand voice', () => {
      const jsonString = JSON.stringify(enMessages);

      // Check for consistent use of "Transform" in messaging
      expect(jsonString).toContain('Transform');

      // Check for consistent tagline
      expect(enMessages.Hero.description).toContain('Ask. Think. Apply.');
      expect(enMessages.DashboardIndex.message_state_title).toContain('Ask, Think, and Apply');
    });
  });

  describe('Technical Content Validation', () => {
    it('should have proper file upload information', () => {
      expect(enMessages.FAQ.answer1).toContain('PDFs, videos (MP4, MOV), presentations (PowerPoint, Google Slides)');
      expect(enMessages.Features.feature1_description).toContain('PDFs, videos, presentations, documents');
    });

    it('should have realistic processing times', () => {
      expect(enMessages.FAQ.answer3).toContain('2-5 minutes');
      expect(enMessages.FAQ.answer3).toContain('15 minutes');
    });

    it('should have proper security messaging', () => {
      expect(enMessages.FAQ.answer4).toContain('encrypted');
      expect(enMessages.FAQ.answer4).toContain('enterprise-grade security');
    });

    it('should have collaboration features described', () => {
      expect(enMessages.FAQ.answer5).toContain('team workspaces');
      expect(enMessages.FAQ.answer5).toContain('track team progress');
    });
  });

  describe('Navigation and Footer Validation', () => {
    it('should have proper navigation items', () => {
      expect(enMessages.Navbar.product).toBe('Product');
      expect(enMessages.Navbar.docs).toBe('Docs');
      expect(enMessages.Navbar.blog).toBe('Blog');
      expect(enMessages.Navbar.community).toBe('Community');
      expect(enMessages.Navbar.sign_in).toBe('Sign In');
      expect(enMessages.Navbar.sign_up).toBe('Sign Up');
    });

    it('should have proper footer structure', () => {
      expect(enMessages.Footer.product).toBe('Product');
      expect(enMessages.Footer.docs).toBe('Docs');
      expect(enMessages.Footer.blog).toBe('Blog');
      expect(enMessages.Footer.community).toBe('Community');
      expect(enMessages.Footer.company).toBe('Company');
    });

    it('should have proper dashboard navigation', () => {
      expect(enMessages.DashboardLayout.home).toBe('Home');
      expect(enMessages.DashboardLayout.billing).toBe('Billing');
      expect(enMessages.DashboardLayout.settings).toBe('Settings');
    });
  });

  describe('User Experience Content', () => {
    it('should have proper onboarding content', () => {
      expect(enMessages.DashboardIndex.message_state_description)
        .toContain('Upload your first training material to begin your AI-powered micro-learning journey');
      expect(enMessages.DashboardIndex.message_state_button).toBe('Upload Content');
      expect(enMessages.DashboardIndex.message_state_alternative)
        .toContain('New to micro-learning?');
    });

    it('should have proper billing content', () => {
      expect(enMessages.Billing.current_section_description)
        .toContain('Adjust your payment plan to best suit your requirements');
      expect(enMessages.Billing.manage_subscription_button).toBe('Manage Subscription');
    });

    it('should have proper error and state messages', () => {
      expect(enMessages.ProtectFallback.not_enough_permission)
        .toBe('You do not have the permissions to perform this action');
      expect(enMessages.DataTable.no_results).toBe('No results.');
    });
  });

  describe('All Content Sections Present', () => {
    it('should have all required top-level sections', () => {
      const requiredSections = [
        'Index',
'Navbar',
'Hero',
'Features',
'Pricing',
'PricingPlan',
        'FAQ',
'CTA',
'Footer',
'Dashboard',
'DashboardIndex',
'DashboardLayout',
        'SignIn',
'SignUp',
'Billing'
      ];

      requiredSections.forEach((section) => {
        expect(enMessages).toHaveProperty(section);
      });
    });

    it('should have all feature descriptions', () => {
      const features = ['feature1', 'feature2', 'feature3', 'feature4', 'feature5', 'feature6'];

      features.forEach((feature) => {
        expect(enMessages.Features).toHaveProperty(`${feature}_title`);
        expect(enMessages.Features).toHaveProperty(`${feature}_description`);
      });
    });

    it('should have all FAQ questions and answers', () => {
      const questions = ['question1', 'question2', 'question3', 'question4', 'question5'];

      questions.forEach((question) => {
        expect(enMessages.FAQ).toHaveProperty(question);
        expect(enMessages.FAQ).toHaveProperty(question.replace('question', 'answer'));
      });
    });
  });
});
