import { getTranslations } from 'next-intl/server';

import { DynamicSignUp } from '@/components/clerk/DynamicClerkComponents';
import { getI18nPath } from '@/utils/Helpers';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'SignUp',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const SignUpPage = (props: { params: { locale: string } }) => (
  <DynamicSignUp path={getI18nPath('/sign-up', props.params.locale)} />
);

export default SignUpPage;
