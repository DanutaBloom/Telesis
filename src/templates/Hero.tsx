import { useTranslations } from 'next-intl';

import { badgeVariants } from '@/components/ui/badgeVariants';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { CenteredHero } from '@/features/landing/CenteredHero';
import { Section } from '@/features/landing/Section';

export const Hero = () => {
  const t = useTranslations('Hero');

  return (
    <Section className="py-36">
      <CenteredHero
        banner={(
          <a
            className={badgeVariants({ variant: 'sage-primary' })}
            href="/sign-up"
          >
            <svg className="mr-1 size-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {' '}
            {t('follow_twitter')}
          </a>
        )}
        title={t.rich('title', {
          important: chunks => (
            <span className="sage-text-gradient">
              {chunks}
            </span>
          ),
        })}
        description={t('description')}
        buttons={(
          <>
            <a
              className={buttonVariants({ variant: 'sage-gradient', size: 'lg' })}
              href="/sign-up"
            >
              {t('primary_button')}
            </a>

            <a
              className={buttonVariants({ variant: 'sage-subtle', size: 'lg' })}
              href="#demo"
            >
              <svg className="mr-2 size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              {t('secondary_button')}
            </a>
          </>
        )}
      />
    </Section>
  );
};
