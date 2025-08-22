import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { CenteredFooter } from '@/features/landing/CenteredFooter';
import { Section } from '@/features/landing/Section';
import { AppConfig } from '@/utils/AppConfig';

import { Logo } from './Logo';

export const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <Section className="pb-16 pt-0">
      <CenteredFooter
        logo={<Logo />}
        name={AppConfig.name}
        iconList={(
          <>
            <li>
              <Link href="mailto:hello@telesis.ai" aria-label="Contact Telesis">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </Link>
            </li>

            <li>
              <Link href="/sign-up" aria-label="Start Learning">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </li>

            <li>
              <Link href="#demo" aria-label="Watch Demo">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </Link>
            </li>
          </>
        )}
        legalLinks={(
          <>
            <li>
              <Link href="/terms">{t('terms_of_service')}</Link>
            </li>
            <li>
              <Link href="/privacy">{t('privacy_policy')}</Link>
            </li>
          </>
        )}
      >
        <li>
          <Link href="/#features">{t('product')}</Link>
        </li>

        <li>
          <Link href="/docs">{t('docs')}</Link>
        </li>

        <li>
          <Link href="/blog">{t('blog')}</Link>
        </li>

        <li>
          <Link href="/community">{t('community')}</Link>
        </li>

        <li>
          <Link href="/about">{t('company')}</Link>
        </li>
      </CenteredFooter>
    </Section>
  );
};
