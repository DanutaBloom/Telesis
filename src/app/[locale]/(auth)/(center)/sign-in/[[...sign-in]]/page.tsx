import { getTranslations } from 'next-intl/server';

import { DynamicSignIn } from '@/components/clerk/DynamicClerkComponents';
import { getI18nPath } from '@/utils/Helpers';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'SignIn',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const SignInPage = (props: { params: { locale: string } }) => (
  <DynamicSignIn path={getI18nPath('/sign-in', props.params.locale)} />
);

export default SignInPage;
