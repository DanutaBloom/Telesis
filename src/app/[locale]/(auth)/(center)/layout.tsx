import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function CenteredLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { userId } = await auth();

  if (userId) {
    // Include locale in redirect path
    const dashboardPath = props.params?.locale && props.params.locale !== 'en'
      ? `/${props.params.locale}/dashboard`
      : '/dashboard';
    redirect(dashboardPath);
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      {props.children}
    </div>
  );
}
