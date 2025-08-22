import type { Metadata } from 'next';

import { ResponsiveTypographyTest } from '@/components/ui/ResponsiveTypographyTest';

export const metadata: Metadata = {
  title: 'Responsive Typography Test - Telesis',
  description: 'Test page for responsive typography system implementation',
};

export default function TypographyTestPage() {
  return <ResponsiveTypographyTest />;
}
