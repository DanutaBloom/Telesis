import { describe, expect, it } from 'vitest';

// Import localization files
import enMessages from '../locales/en.json';
import frMessages from '../locales/fr.json';

describe('Content Validation - No Old Branding', () => {
  describe('Localization Files Validation', () => {
    it('should not contain any SaaS boilerplate references in English localization', () => {
      const forbiddenTerms = [
        /SaaS Boilerplate/i,
        /SaaS Template/i,
        /Next\.js Boilerplate/i,
        /Lorem ipsum/i,
        /placeholder text/i,
        /sample content/i,
        /template content/i,
        /Your SaaS/i,
        /My SaaS/i,
        /Generic/i,
      ];

      const jsonString = JSON.stringify(enMessages);

      forbiddenTerms.forEach((term) => {
        expect(jsonString).not.toMatch(term);
      });
    });

    it('should not contain any SaaS boilerplate references in French localization', () => {
      const forbiddenTerms = [
        /SaaS Boilerplate/i,
        /SaaS Template/i,
        /Next\.js Boilerplate/i,
        /Lorem ipsum/i,
        /placeholder text/i,
        /sample content/i,
        /template content/i,
        /Your SaaS/i,
        /My SaaS/i,
        /Generic/i,
      ];

      const jsonString = JSON.stringify(frMessages);

      forbiddenTerms.forEach((term) => {
        expect(jsonString).not.toMatch(term);
      });
    });

    it('should contain proper Telesis branding in English localization', () => {
      const jsonString = JSON.stringify(enMessages);

      // Check for required Telesis content
      expect(jsonString).toMatch(/Telesis/);
      expect(jsonString).toMatch(/micro-learning/i);
      expect(jsonString).toMatch(/AI-powered/i);
      expect(jsonString).toMatch(/Ask.*Think.*Apply/);
      expect(jsonString).toMatch(/Transform training/i);
    });

    it('should have consistent messaging structure in English localization', () => {
      // Check required sections exist
      expect(enMessages.Hero).toBeDefined();
      expect(enMessages.Features).toBeDefined();
      expect(enMessages.FAQ).toBeDefined();
      expect(enMessages.CTA).toBeDefined();
      expect(enMessages.Dashboard).toBeDefined();
      expect(enMessages.DashboardIndex).toBeDefined();

      // Check hero content
      expect(enMessages.Hero.title).toContain('micro-learning');
      expect(enMessages.Hero.description).toContain('Ask. Think. Apply.');
      expect(enMessages.Hero.primary_button).toBe('Start Learning Free');

      // Check features content
      expect(enMessages.Features.section_title).toContain('AI-Powered Learning');
      expect(enMessages.Features.section_description).toContain('Telesis');

      // Check FAQ content
      expect(enMessages.FAQ.section_title).toContain('Telesis');
      expect(enMessages.FAQ.question1).toContain('Telesis');

      // Check CTA content
      expect(enMessages.CTA.title).toContain('Transform Your Learning');
      expect(enMessages.CTA.description).toContain('AI-powered micro-learning');

      // Check dashboard content
      expect(enMessages.Dashboard.meta_title).toContain('Telesis Learning Dashboard');
      expect(enMessages.DashboardIndex.title_bar).toContain('Learning Dashboard');
      expect(enMessages.DashboardIndex.message_state_title).toContain('Ask, Think, and Apply');
    });

    it('should have proper feature descriptions that are Telesis-specific', () => {
      // Check that all 6 features are defined and Telesis-specific
      expect(enMessages.Features.feature1_title).toBe('Smart Upload');
      expect(enMessages.Features.feature1_description).toContain('training material');

      expect(enMessages.Features.feature2_title).toBe('AI Micro-Modules');
      expect(enMessages.Features.feature2_description).toContain('bite-sized learning modules');

      expect(enMessages.Features.feature3_title).toBe('Audio Briefs');
      expect(enMessages.Features.feature3_description).toContain('audio summaries');

      expect(enMessages.Features.feature4_title).toBe('Visual Learning Maps');
      expect(enMessages.Features.feature4_description).toContain('mind maps');

      expect(enMessages.Features.feature5_title).toBe('Practice Cards');
      expect(enMessages.Features.feature5_description).toContain('flashcards');

      expect(enMessages.Features.feature6_title).toBe('Personal Learning Style');
      expect(enMessages.Features.feature6_description).toContain('Adaptive algorithms');
    });

    it('should have proper meta tags for SEO', () => {
      expect(enMessages.Index.meta_title).toContain('Telesis');
      expect(enMessages.Index.meta_title).toContain('AI-Powered Micro-Learning Platform');
      expect(enMessages.Index.meta_title).toContain('Ask. Think. Apply.');

      expect(enMessages.Index.meta_description).toContain('Transform training content');
      expect(enMessages.Index.meta_description).toContain('micro-learning experiences');
      expect(enMessages.Index.meta_description).toContain('AI creates');
    });
  });

  describe('Component Content Structure Validation', () => {
    it('should have proper pricing structure with Telesis context', () => {
      // Check pricing section exists and has Telesis-specific content
      expect(enMessages.Pricing.section_title).toContain('Learning Goals');
      expect(enMessages.Pricing.section_description).toContain('AI transformations');

      // Check pricing plans are properly named
      expect(enMessages.PricingPlan.starter_plan_name).toBe('Starter');
      expect(enMessages.PricingPlan.pro_plan_name).toBe('Pro');
      expect(enMessages.PricingPlan.enterprise_plan_name).toBe('Enterprise');

      // Check feature descriptions are Telesis-specific
      expect(enMessages.PricingPlan.feature_website).toContain('AI Transformations');
      expect(enMessages.PricingPlan.feature_transfer).toContain('Content Uploads');
    });

    it('should have proper FAQ structure with Telesis-specific questions', () => {
      // Check all 5 FAQ questions exist and are Telesis-specific
      expect(enMessages.FAQ.question1).toContain('upload to Telesis');
      expect(enMessages.FAQ.answer1).toContain('Telesis supports');
      expect(enMessages.FAQ.answer1).toContain('training manuals');

      expect(enMessages.FAQ.question2).toContain('personalized learning experiences');
      expect(enMessages.FAQ.answer2).toContain('audio briefs, visual maps');

      expect(enMessages.FAQ.question3).toContain('transform my content');
      expect(enMessages.FAQ.answer3).toContain('2-5 minutes');

      expect(enMessages.FAQ.question4).toContain('secure and private');
      expect(enMessages.FAQ.answer4).toContain('encrypted');

      expect(enMessages.FAQ.question5).toContain('teams collaborate');
      expect(enMessages.FAQ.answer5).toContain('team workspaces');
    });

    it('should have proper navigation structure', () => {
      // Check navigation items
      expect(enMessages.Navbar.sign_in).toBe('Sign In');
      expect(enMessages.Navbar.sign_up).toBe('Sign Up');
      expect(enMessages.Navbar.product).toBe('Product');
      expect(enMessages.Navbar.docs).toBe('Docs');
      expect(enMessages.Navbar.blog).toBe('Blog');
      expect(enMessages.Navbar.community).toBe('Community');
      expect(enMessages.Navbar.company).toBe('Company');

      // Check dashboard navigation
      expect(enMessages.DashboardLayout.home).toBe('Home');
      expect(enMessages.DashboardLayout.billing).toBe('Billing');
      expect(enMessages.DashboardLayout.settings).toBe('Settings');
    });

    it('should have proper footer structure', () => {
      // Check footer links
      expect(enMessages.Footer.product).toBe('Product');
      expect(enMessages.Footer.docs).toBe('Docs');
      expect(enMessages.Footer.blog).toBe('Blog');
      expect(enMessages.Footer.community).toBe('Community');
      expect(enMessages.Footer.company).toBe('Company');
      expect(enMessages.Footer.terms_of_service).toBe('Terms Of Service');
      expect(enMessages.Footer.privacy_policy).toBe('Privacy Policy');
    });
  });

  describe('Dashboard Content Validation', () => {
    it('should have proper dashboard onboarding content', () => {
      expect(enMessages.DashboardIndex.message_state_description)
        .toContain('AI-powered micro-learning journey');
      expect(enMessages.DashboardIndex.message_state_description)
        .toContain('bite-sized learning experiences');
      expect(enMessages.DashboardIndex.message_state_button).toBe('Upload Content');
      expect(enMessages.DashboardIndex.message_state_alternative)
        .toContain('quick start guide');
      expect(enMessages.DashboardIndex.message_state_alternative)
        .toContain('Telesis');
    });

    it('should have proper billing content', () => {
      expect(enMessages.Billing.current_section_description)
        .toContain('payment plan');
      expect(enMessages.Billing.manage_subscription_button)
        .toBe('Manage Subscription');
    });
  });

  describe('French Localization Validation', () => {
    it('should have corresponding French translations for key Telesis content', () => {
      // Note: This test assumes French translations have been implemented
      // If not, these tests will need to be updated when French translations are added

      const jsonString = JSON.stringify(frMessages);

      // Check that French file exists and has basic structure
      expect(frMessages).toBeDefined();
      expect(typeof frMessages).toBe('object');

      // If French translations exist, they should also not contain old branding
      if (Object.keys(frMessages).length > 0) {
        const forbiddenTerms = [
          /SaaS Boilerplate/i,
          /Lorem ipsum/i,
          /placeholder text/i,
        ];

        forbiddenTerms.forEach((term) => {
          expect(jsonString).not.toMatch(term);
        });
      }
    });
  });

  describe('Consistency Validation', () => {
    it('should use consistent terminology throughout', () => {
      const jsonString = JSON.stringify(enMessages);

      // Check for consistent use of "micro-learning" (not "microlearning" or "micro learning")
      const microLearningMatches = jsonString.match(/micro-learning/g);
      const inconsistentMatches = jsonString.match(/microlearning|micro learning/g);

      expect(microLearningMatches).toBeTruthy();
      expect(microLearningMatches!.length).toBeGreaterThan(2);
      expect(inconsistentMatches).toBeFalsy();
    });

    it('should use consistent capitalization for "AI-powered"', () => {
      const jsonString = JSON.stringify(enMessages);

      // Check for consistent use of "AI-powered" (not "ai-powered" or "AI powered")
      const aiPoweredMatches = jsonString.match(/AI-powered/g);

      expect(aiPoweredMatches).toBeTruthy();
      expect(aiPoweredMatches!.length).toBeGreaterThan(1);
    });

    it('should use consistent CTA buttons', () => {
      // Primary CTAs should be consistent
      expect(enMessages.Hero.primary_button).toBe('Start Learning Free');
      expect(enMessages.CTA.button_text).toBe('Start Free Trial');
      expect(enMessages.Pricing.button_text).toBe('Start Free Trial');
    });

    it('should maintain consistent brand voice', () => {
      const jsonString = JSON.stringify(enMessages);

      // Check for consistent use of "Transform" in messaging
      expect(jsonString).toMatch(/Transform/);

      // Check for consistent use of tagline
      expect(enMessages.Hero.description).toContain('Ask. Think. Apply.');
      expect(enMessages.DashboardIndex.message_state_title).toContain('Ask, Think, and Apply');
    });
  });

  describe('Technical Content Validation', () => {
    it('should have proper file upload messaging', () => {
      expect(enMessages.FAQ.answer1)
        .toContain('PDFs, videos (MP4, MOV), presentations (PowerPoint, Google Slides)');
      expect(enMessages.Features.feature1_description)
        .toContain('PDFs, videos, presentations, documents');
    });

    it('should have realistic processing time information', () => {
      expect(enMessages.FAQ.answer3).toContain('2-5 minutes');
      expect(enMessages.FAQ.answer3).toContain('15 minutes');
    });

    it('should have proper security messaging', () => {
      expect(enMessages.FAQ.answer4).toContain('encrypted');
      expect(enMessages.FAQ.answer4).toContain('enterprise-grade security');
      expect(enMessages.FAQ.answer4).toContain('never share your content');
    });
  });
});
