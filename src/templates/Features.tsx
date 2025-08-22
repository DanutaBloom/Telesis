import { useTranslations } from 'next-intl';

import { Background } from '@/components/Background';
import { FeatureCard } from '@/features/landing/FeatureCard';
import { Section } from '@/features/landing/Section';

export const Features = () => {
  const t = useTranslations('Features');

  return (
    <Background>
      <Section
        subtitle={t('section_subtitle')}
        title={t('section_title')}
        description={t('section_description')}
      >
        <div className="grid grid-cols-1 gap-x-3 gap-y-8 md:grid-cols-3">
          <FeatureCard
            icon={(
              <svg
                className="stroke-primary-foreground stroke-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
              </svg>
            )}
            title={t('feature1_title')}
          >
            {t('feature1_description')}
          </FeatureCard>

          <FeatureCard
            icon={(
              <svg
                className="stroke-primary-foreground stroke-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            )}
            title={t('feature2_title')}
          >
            {t('feature2_description')}
          </FeatureCard>

          <FeatureCard
            icon={(
              <svg
                className="stroke-primary-foreground stroke-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5,6 9,2 9,2 15,6 15,11 19,13 19,13 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
            title={t('feature3_title')}
          >
            {t('feature3_description')}
          </FeatureCard>

          <FeatureCard
            icon={(
              <svg
                className="stroke-primary-foreground stroke-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6" />
                <path d="m21 12-6-3-6 3-6-3" />
                <path d="m21 12-6 3-6-3-6 3" />
                <path d="m12 1 6 3v6l-6 3-6-3V4l6-3" />
              </svg>
            )}
            title={t('feature4_title')}
          >
            {t('feature4_description')}
          </FeatureCard>

          <FeatureCard
            icon={(
              <svg
                className="stroke-primary-foreground stroke-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <path d="M7 7h5v5H7zM15 7h2v1h-2zM15 10h2v1h-2z" />
              </svg>
            )}
            title={t('feature5_title')}
          >
            {t('feature5_description')}
          </FeatureCard>

          <FeatureCard
            icon={(
              <svg
                className="stroke-primary-foreground stroke-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
                <path d="M12 14v7" />
                <path d="M8 21l8-8" />
              </svg>
            )}
            title={t('feature6_title')}
          >
            {t('feature6_description')}
          </FeatureCard>
        </div>
      </Section>
    </Background>
  );
};
