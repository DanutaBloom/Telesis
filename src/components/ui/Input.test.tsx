/**
 * Input Component Test Suite
 *
 * Tests Shadcn UI Input component with Modern Sage theme integration,
 * form accessibility, and validation states
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  expectElementToFollowModernSageSpacing,
  expectElementToHaveModernSageBorderRadius,
  expectElementToHaveModernSageFocus,
  testErrorMessageAccessibility,
  testFormAccessibility,
} from '@/test-utils';

import { Input } from './input';

describe('Input Component', () => {
  describe('Basic Rendering', () => {
    it('renders input element correctly', () => {
      render(<Input placeholder="Enter text" />);

      const input = screen.getByPlaceholderText('Enter text');

      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
    });

    it('applies default input type', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');

      expect(input).toHaveAttribute('type', 'text');
    });

    it('accepts different input types', () => {
      render(<Input type="email" data-testid="email-input" />);

      const input = screen.getByTestId('email-input');

      expect(input).toHaveAttribute('type', 'email');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Input ref={ref} />);

      expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
    });
  });

  describe('Modern Sage Theme Integration', () => {
    it('applies Modern Sage styling classes', () => {
      render(<Input data-testid="themed-input" />);

      const input = screen.getByTestId('themed-input');

      // Check for base styling
      expect(input).toHaveClass(
        'flex',
        'h-10',
        'w-full',
        'rounded-md',
        'border',
        'border-input',
        'bg-background',
        'px-3',
        'py-2',
      );
    });

    it('has proper Modern Sage focus styling', async () => {
      const user = userEvent.setup();
      render(<Input data-testid="focus-input" />);

      const input = screen.getByTestId('focus-input');
      await user.click(input);

      expectElementToHaveModernSageFocus(input);
    });

    it('follows Modern Sage spacing guidelines', () => {
      render(<Input data-testid="spacing-input" />);

      const input = screen.getByTestId('spacing-input');
      expectElementToFollowModernSageSpacing(input);
    });

    it('uses Modern Sage border radius', () => {
      render(<Input data-testid="radius-input" />);

      const input = screen.getByTestId('radius-input');
      expectElementToHaveModernSageBorderRadius(input);
    });

    it('applies Modern Sage color scheme', () => {
      render(<Input data-testid="color-input" />);

      const input = screen.getByTestId('color-input');

      // Should use theme border and background colors
      expect(input).toHaveClass('border-input', 'bg-background');
    });
  });

  describe('Input States and Variants', () => {
    it('handles disabled state correctly', () => {
      render(<Input disabled data-testid="disabled-input" />);

      const input = screen.getByTestId('disabled-input');

      expect(input).toBeDisabled();
      expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });

    it('handles readonly state', () => {
      render(<Input readOnly value="readonly" data-testid="readonly-input" />);

      const input = screen.getByTestId('readonly-input');

      expect(input).toHaveAttribute('readonly');
      expect(input).toHaveValue('readonly');
    });

    it('handles required state', () => {
      render(<Input required data-testid="required-input" />);

      const input = screen.getByTestId('required-input');

      expect(input).toBeRequired();
    });

    it('applies error state styling', () => {
      render(
        <div>
          <Input
            aria-invalid="true"
            aria-describedby="error-message"
            data-testid="error-input"
          />
          <div id="error-message" role="alert">This field is required</div>
        </div>,
      );

      const input = screen.getByTestId('error-input');
      testErrorMessageAccessibility(input, 'error-message');
    });
  });

  describe('User Interaction', () => {
    it('handles text input correctly', async () => {
      const user = userEvent.setup();
      render(<Input data-testid="text-input" />);

      const input = screen.getByTestId('text-input');
      await user.type(input, 'Hello World');

      expect(input).toHaveValue('Hello World');
    });

    it('handles onChange events', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Input onChange={handleChange} data-testid="change-input" />);

      const input = screen.getByTestId('change-input');
      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalledTimes(4); // Once per character
    });

    it('handles onBlur events', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();

      render(<Input onBlur={handleBlur} data-testid="blur-input" />);

      const input = screen.getByTestId('blur-input');
      await user.click(input);
      await user.tab(); // Move focus away

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('handles onFocus events', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();

      render(<Input onFocus={handleFocus} data-testid="focus-input" />);

      const input = screen.getByTestId('focus-input');
      await user.click(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Input data-testid="input-1" />
          <Input data-testid="input-2" />
        </div>,
      );

      const input1 = screen.getByTestId('input-1');
      const input2 = screen.getByTestId('input-2');

      // Tab to first input
      await user.tab();

      expect(input1).toHaveFocus();

      // Tab to second input
      await user.tab();

      expect(input2).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Input
          aria-label="Search input"
          aria-describedby="search-help"
          aria-required="true"
          data-testid="aria-input"
        />,
      );

      const input = screen.getByTestId('aria-input');

      expect(input).toHaveAttribute('aria-label', 'Search input');
      expect(input).toHaveAttribute('aria-describedby', 'search-help');
      expect(input).toBeRequired();
    });

    it('works with labels correctly', () => {
      render(
        <div>
          <label htmlFor="labeled-input">Username</label>
          <Input id="labeled-input" />
        </div>,
      );

      const input = screen.getByLabelText('Username');

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'labeled-input');
    });

    it('supports screen reader announcements', () => {
      render(
        <div>
          <Input
            aria-describedby="input-description"
            data-testid="described-input"
          />
          <div id="input-description">Please enter your full name</div>
        </div>,
      );

      const input = screen.getByTestId('described-input');
      const description = screen.getByText('Please enter your full name');

      expect(input).toHaveAttribute('aria-describedby', 'input-description');
      expect(description).toHaveAttribute('id', 'input-description');
    });

    it('announces validation errors', () => {
      render(
        <div>
          <Input
            aria-invalid="true"
            aria-describedby="validation-error"
            data-testid="invalid-input"
          />
          <div id="validation-error" role="alert">
            Email address is required
          </div>
        </div>,
      );

      const input = screen.getByTestId('invalid-input');
      testErrorMessageAccessibility(input, 'validation-error');
    });
  });

  describe('Form Integration', () => {
    it('integrates properly in forms', () => {
      render(
        <form>
          <label htmlFor="form-input">Email</label>
          <Input id="form-input" name="email" type="email" required />
          <button type="submit">Submit</button>
        </form>,
      );

      const form = screen.getByRole('form');
      testFormAccessibility(form);
    });

    it('handles form submission', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn(e => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <Input name="username" data-testid="form-input" />
          <button type="submit">Submit</button>
        </form>,
      );

      const input = screen.getByTestId('form-input');
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      await user.type(input, 'testuser');
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
    });

    it('validates required fields', async () => {
      const user = userEvent.setup();

      render(
        <form>
          <Input required name="required-field" data-testid="required-input" />
          <button type="submit">Submit</button>
        </form>,
      );

      const input = screen.getByTestId('required-input');
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      // Try to submit without filling required field
      await user.click(submitButton);

      // Browser should prevent submission and show validation message
      expect(input).toBeInvalid();
    });
  });

  describe('Custom Props and Styling', () => {
    it('accepts custom className', () => {
      // eslint-disable-next-line tailwindcss/no-custom-classname
      render(<Input className="custom-input-class" data-testid="custom-input" />);

      const input = screen.getByTestId('custom-input');

      expect(input).toHaveClass('custom-input-class');
      // Should still have default input classes
      expect(input).toHaveClass('flex', 'h-10', 'w-full');
    });

    it('spreads additional props', () => {
      render(
        <Input
          data-analytics="input-field"
          data-testid="props-input"
          maxLength={50}
          autoComplete="name"
        />,
      );

      const input = screen.getByTestId('props-input');

      expect(input).toHaveAttribute('data-analytics', 'input-field');
      expect(input).toHaveAttribute('maxlength', '50');
      expect(input).toHaveAttribute('autocomplete', 'name');
    });

    it('handles controlled components', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('');

        return (
          <Input
            value={value}
            onChange={e => setValue(e.target.value)}
            data-testid="controlled-input"
          />
        );
      };

      render(<TestComponent />);

      const input = screen.getByTestId('controlled-input');
      await user.type(input, 'controlled');

      expect(input).toHaveValue('controlled');
    });
  });

  describe('Input Types and Validation', () => {
    it('handles email input validation', async () => {
      const user = userEvent.setup();

      render(<Input type="email" data-testid="email-input" />);

      const input = screen.getByTestId('email-input');
      await user.type(input, 'invalid-email');

      // Trigger validation
      await user.tab();

      expect(input).toHaveAttribute('type', 'email');
      // Browser will validate email format
    });

    it('handles password input', async () => {
      const user = userEvent.setup();

      render(<Input type="password" data-testid="password-input" />);

      const input = screen.getByTestId('password-input');
      await user.type(input, 'secretpassword');

      expect(input).toHaveAttribute('type', 'password');
      expect(input).toHaveValue('secretpassword');
    });

    it('handles number input', async () => {
      const user = userEvent.setup();

      render(<Input type="number" min="0" max="100" data-testid="number-input" />);

      const input = screen.getByTestId('number-input');
      await user.type(input, '42');

      expect(input).toHaveAttribute('type', 'number');
      expect(input).toHaveValue(42);
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
    });
  });

  describe('Error Handling', () => {
    it('handles invalid props gracefully', () => {
      // Should not crash with invalid props
      render(<Input type="invalid-type" data-testid="invalid-input" />);

      const input = screen.getByTestId('invalid-input');

      expect(input).toBeInTheDocument();
    });

    it('handles null/undefined values', () => {
      render(<Input value={undefined} data-testid="undefined-value" />);

      const input = screen.getByTestId('undefined-value');

      expect(input).toBeInTheDocument();
      expect((input as HTMLInputElement).value).toBe('');
    });
  });
});
