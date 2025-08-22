import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LabeledProgress, Progress } from './progress';

describe('Progress Component', () => {
  it('renders with default props', () => {
    render(<Progress data-testid="progress" />);

    const progress = screen.getByTestId('progress');

    expect(progress).toBeInTheDocument();
    expect(progress).toHaveAttribute('role', 'progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '0');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders with custom value', () => {
    render(<Progress value={75} data-testid="progress" />);

    const progress = screen.getByTestId('progress');

    expect(progress).toHaveAttribute('aria-valuenow', '75');

    const indicator = progress.querySelector('div');

    expect(indicator).toHaveStyle({ width: '75%' });
  });

  it('handles edge cases for value', () => {
    // Test negative value
    const { rerender } = render(<Progress value={-10} data-testid="progress" />);
    let progress = screen.getByTestId('progress');
    let indicator = progress.querySelector('div');

    expect(indicator).toHaveStyle({ width: '0%' });

    // Test value over 100%
    rerender(<Progress value={150} data-testid="progress" />);
    progress = screen.getByTestId('progress');
    indicator = progress.querySelector('div');

    expect(indicator).toHaveStyle({ width: '100%' });
  });

  it('supports custom max value', () => {
    render(<Progress value={50} max={200} data-testid="progress" />);

    const progress = screen.getByTestId('progress');

    expect(progress).toHaveAttribute('aria-valuemax', '200');

    const indicator = progress.querySelector('div');

    expect(indicator).toHaveStyle({ width: '25%' }); // 50/200 = 25%
  });

  it('applies different size variants', () => {
    const sizes = ['sm', 'default', 'lg', 'xl'] as const;

    sizes.forEach((size) => {
      const { unmount } = render(<Progress size={size} data-testid={`progress-${size}`} />);

      const progress = screen.getByTestId(`progress-${size}`);

      expect(progress).toBeInTheDocument();

      unmount();
    });
  });

  it('applies different style variants', () => {
    const variants = ['default', 'sage', 'accent', 'subtle'] as const;

    variants.forEach((variant) => {
      const { unmount } = render(<Progress variant={variant} data-testid={`progress-${variant}`} />);

      const progress = screen.getByTestId(`progress-${variant}`);

      expect(progress).toBeInTheDocument();

      unmount();
    });
  });

  it('applies Modern Sage styling for sage variant', () => {
    render(<Progress variant="sage" data-testid="sage-progress" />);

    const progress = screen.getByTestId('sage-progress');

    expect(progress).toHaveClass('bg-sage-mist/50');
  });

  it('supports custom indicator variant', () => {
    render(
      <Progress
        variant="default"
        indicatorVariant="success"
        value={50}
        data-testid="custom-indicator-progress"
      />
    );

    const progress = screen.getByTestId('custom-indicator-progress');
    const indicator = progress.querySelector('div');

    expect(indicator).toHaveClass('bg-sage-growth');
  });
});

describe('LabeledProgress Component', () => {
  it('renders with label and value', () => {
    render(
      <LabeledProgress
        label="Loading..."
        value={60}
        data-testid="labeled-progress"
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();

    const progress = screen.getByRole('progressbar');

    expect(progress).toHaveAttribute('aria-valuenow', '60');
  });

  it('renders without showing value when showValue is false', () => {
    render(
      <LabeledProgress
        label="Processing..."
        value={40}
        showValue={false}
        data-testid="no-value-progress"
      />
    );

    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.queryByText('40%')).not.toBeInTheDocument();
  });

  it('uses custom value formatter', () => {
    const customFormatter = (value: number) => `${value} of 100`;

    render(
      <LabeledProgress
        label="Custom Format"
        value={25}
        valueFormat={customFormatter}
        data-testid="custom-format-progress"
      />
    );

    expect(screen.getByText('25 of 100')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(
      <LabeledProgress
        value={80}
        data-testid="no-label-progress"
      />
    );

    expect(screen.getByText('80%')).toBeInTheDocument();

    const progress = screen.getByRole('progressbar');

    expect(progress).toHaveAttribute('aria-valuenow', '80');
  });

  it('renders with only label, no value display', () => {
    render(
      <LabeledProgress
        label="Just a label"
        value={30}
        showValue={false}
        data-testid="label-only-progress"
      />
    );

    expect(screen.getByText('Just a label')).toBeInTheDocument();
    expect(screen.queryByText('30%')).not.toBeInTheDocument();
  });

  it('handles zero value correctly', () => {
    render(
      <LabeledProgress
        label="Starting..."
        value={0}
        data-testid="zero-progress"
      />
    );

    expect(screen.getByText('0%')).toBeInTheDocument();

    const progress = screen.getByRole('progressbar');
    const indicator = progress.querySelector('div');

    expect(indicator).toHaveStyle({ width: '0%' });
  });

  it('applies Modern Sage theming to value text', () => {
    render(
      <LabeledProgress
        label="Sage themed"
        value={50}
        data-testid="sage-labeled-progress"
      />
    );

    const valueText = screen.getByText('50%');

    expect(valueText).toHaveClass('text-sage-stone');
  });
});
