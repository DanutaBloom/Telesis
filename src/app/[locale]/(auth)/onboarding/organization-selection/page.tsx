import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

import { DynamicOrganizationList } from '@/components/clerk/DynamicClerkComponents';
import { isOrganizationsEnabled } from '@/libs/ClerkUtils';

import { DynamicOrganizationList } from '@/components/clerk/DynamicClerkComponents';
import { isOrganizationsEnabled } from '@/libs/ClerkUtils';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const OrganizationSelectionPage = (props: { params: { locale: string } }) => {
  // If organizations are disabled, redirect to dashboard
  if (!isOrganizationsEnabled()) {
    const locale = props.params.locale;
    const dashboardPath = locale ? `/${locale}/dashboard` : '/dashboard';
    redirect(dashboardPath);
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Select Organization</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose an organization to continue or create a new one
          </p>
        </div>
        <DynamicOrganizationList
          afterSelectOrganizationUrl="/dashboard"
          afterCreateOrganizationUrl="/dashboard"
          hidePersonal
          skipInvitationScreen
        />
      </div>
    </div>
  );
};

export const dynamic = 'force-dynamic';

export default OrganizationSelectionPage;
