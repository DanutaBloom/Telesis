import { render, screen } from '@testing-library/react';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { Alert, AlertDescription, AlertTitle } from './alert';

describe('Alert Component', () => {
  it('renders with default variant', () => {
    render(
      <Alert data-testid="alert">
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('alert');

    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('role', 'alert');
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Alert description')).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const variants = ['default', 'destructive', 'info', 'success', 'warning', 'sage', 'sage-accent'] as const;

    variants.forEach((variant) => {
      const { unmount } = render(
        <Alert variant={variant} data-testid={`alert-${variant}`}>
          <AlertTitle>Title</AlertTitle>
          <AlertDescription>Description</AlertDescription>
        </Alert>
      );

      const alert = screen.getByTestId(`alert-${variant}`);

      expect(alert).toBeInTheDocument();

      unmount();
    });
  });

  it('applies Modern Sage theming for sage variants', () => {
    render(
      <Alert variant="sage" data-testid="sage-alert">
        <AlertTitle>Sage Alert</AlertTitle>
        <AlertDescription>Sage description</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('sage-alert');

    expect(alert).toHaveClass('sage-border');
  });

  it('renders with icon and proper spacing', () => {
    render(
      <Alert data-testid="alert-with-icon">
        <Info className="size-4" />
        <AlertTitle>Info Alert</AlertTitle>
        <AlertDescription>This is an info alert with an icon.</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('alert-with-icon');
    const icon = alert.querySelector('svg');

    expect(icon).toBeInTheDocument();
    expect(alert).toHaveClass('[&>svg]:absolute', '[&>svg]:left-4', '[&>svg]:top-4');
  });

  it('handles success variant with proper styling', () => {
    render(
      <Alert variant="success" data-testid="success-alert">
        <CheckCircle className="size-4" />
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>Operation completed successfully.</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('success-alert');

    expect(alert).toHaveClass('border-sage-growth/50', 'bg-sage-growth/10', 'text-sage-growth');
  });

  it('handles warning variant with proper styling', () => {
    render(
      <Alert variant="warning" data-testid="warning-alert">
        <AlertTriangle className="size-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Please check your input.</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('warning-alert');

    expect(alert).toHaveClass('border-orange-500/50', 'bg-orange-50', 'text-orange-800');
  });

  it('handles destructive variant with proper styling', () => {
    render(
      <Alert variant="destructive" data-testid="destructive-alert">
        <AlertCircle className="size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('destructive-alert');

    expect(alert).toHaveClass('border-destructive/50', 'text-destructive');
  });

  it('renders without title', () => {
    render(
      <Alert data-testid="alert-no-title">
        <AlertDescription>Description only</AlertDescription>
      </Alert>
    );

    expect(screen.getByTestId('alert-no-title')).toBeInTheDocument();
    expect(screen.getByText('Description only')).toBeInTheDocument();
  });

  it('renders without description', () => {
    render(
      <Alert data-testid="alert-no-description">
        <AlertTitle>Title only</AlertTitle>
      </Alert>
    );

    expect(screen.getByTestId('alert-no-description')).toBeInTheDocument();
    expect(screen.getByText('Title only')).toBeInTheDocument();
  });

  it('supports custom className', () => {
    render(
      <Alert className="custom-class" data-testid="custom-alert">
        <AlertTitle>Custom Alert</AlertTitle>
      </Alert>
    );

    expect(screen.getByTestId('custom-alert')).toHaveClass('custom-class');
  });

  it('has proper semantic HTML structure', () => {
    render(
      <Alert data-testid="semantic-alert">
        <AlertTitle>Semantic Title</AlertTitle>
        <AlertDescription>Semantic description</AlertDescription>
      </Alert>
    );

    const title = screen.getByText('Semantic Title');
    const description = screen.getByText('Semantic description');

    expect(title.tagName).toBe('H5');
    expect(description.tagName).toBe('DIV');
  });
});
