import { useTranslations } from 'next-intl';

import { MessageState } from '@/features/dashboard/MessageState';
import { TitleBar } from '@/features/dashboard/TitleBar';

const DashboardIndexPage = () => {
  const t = useTranslations('DashboardIndex');

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <MessageState
        icon={(
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M0 0h24v24H0z" stroke="none" />
            <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3M12 12l8-4.5M12 12v9M12 12L4 7.5" />
          </svg>
        )}
        title={t('message_state_title')}
        description={t('message_state_description')}
        button={(
          <>
            <a
              className="bg-sage-primary hover:bg-sage-primary/90 inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors"
              href="/dashboard/upload"
            >
              {t('message_state_button')}
            </a>
            <div className="mt-4 text-xs font-light text-muted-foreground">
              {t.rich('message_state_alternative', {
                url: chunks => (
                  <a
                    className="text-sage-primary hover:text-sage-primary/80"
                    href="#demo"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </div>
          </>
        )}
      />
    </>
  );
};

export default DashboardIndexPage;
