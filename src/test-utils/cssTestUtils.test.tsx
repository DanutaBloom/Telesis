import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import {
  expectElementByTestIdToHaveClasses,
  expectElementToHaveA11yAttributes,
  expectElementToHaveClasses,
  expectElementToHaveDarkModeClasses,
  expectElementToHaveResponsiveClasses,
  getComputedStyles,
  logComputedStyles,
} from './cssTestUtils';

// Test component with various Tailwind classes
const TestComponent = () => (
  <div>
    <button
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      data-testid="primary-button"
      aria-label="Primary action button"
      type="button"
    >
      Primary Button
    </button>

    <div
      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
      data-testid="responsive-container"
    >
      Responsive Container
    </div>

    <div
      className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
      data-testid="dark-mode-element"
    >
      Dark Mode Element
    </div>

    <div
      className="flex items-center justify-center p-4"
      data-testid="flex-container"
    >
      <span className="text-lg font-medium">Flex Content</span>
    </div>
  </div>
);

describe('CSS Test Utilities', () => {
  describe('expectElementToHaveClasses', () => {
    it('should pass when element has all expected classes', () => {
      render(<TestComponent />);
      const button = screen.getByTestId('primary-button');

      expectElementToHaveClasses(button, [
        'bg-blue-500',
        'hover:bg-blue-700',
        'text-white',
        'font-bold',
        'py-2',
        'px-4',
        'rounded',
      ]);
    });

    it('should throw when element is missing expected classes', () => {
      render(<TestComponent />);
      const button = screen.getByTestId('primary-button');

      expect(() => {
        expectElementToHaveClasses(button, ['non-existent-class']);
      }).toThrow();
    });
  });

  describe('expectElementByTestIdToHaveClasses', () => {
    it('should work with test ID lookup', () => {
      render(<TestComponent />);

      expectElementByTestIdToHaveClasses('primary-button', [
        'bg-blue-500',
        'text-white',
        'font-bold',
      ]);
    });
  });

  describe('expectElementToHaveResponsiveClasses', () => {
    it('should verify responsive classes are applied', () => {
      render(<TestComponent />);
      const container = screen.getByTestId('responsive-container');

      expectElementToHaveResponsiveClasses(container, {
        base: ['w-full'],
        sm: ['sm:w-1/2'],
        md: ['md:w-1/3'],
        lg: ['lg:w-1/4'],
        xl: ['xl:w-1/5'],
      });
    });
  });

  describe('expectElementToHaveDarkModeClasses', () => {
    it('should verify both light and dark mode classes', () => {
      render(<TestComponent />);
      const element = screen.getByTestId('dark-mode-element');

      expectElementToHaveDarkModeClasses(
        element,
        ['bg-white', 'text-gray-900'],
        ['dark:bg-gray-800', 'dark:text-white'],
      );
    });
  });

  describe('expectElementToHaveA11yAttributes', () => {
    it('should verify accessibility attributes', () => {
      render(<TestComponent />);
      const button = screen.getByTestId('primary-button');

      expectElementToHaveA11yAttributes(button, {
        'aria-label': 'Primary action button',
        'type': 'button',
      });
    });
  });

  describe('getComputedStyles', () => {
    it('should return computed style object', () => {
      render(<TestComponent />);
      const flexContainer = screen.getByTestId('flex-container');

      const styles = getComputedStyles(flexContainer);

      expect(styles).toHaveProperty('display');
      expect(styles).toHaveProperty('flexDirection');
      expect(styles).toHaveProperty('alignItems');
      expect(styles).toHaveProperty('justifyContent');
      expect(styles).toHaveProperty('padding');
    });
  });

  describe('logComputedStyles', () => {
    it('should log computed styles with console mock', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      render(<TestComponent />);
      const button = screen.getByTestId('primary-button');

      logComputedStyles(button, 'Test Button');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Test Button computed styles:',
        expect.objectContaining({
          display: expect.any(String),
          backgroundColor: expect.any(String),
          color: expect.any(String),
        }),
      );

      consoleSpy.mockRestore();
    });
  });
});
