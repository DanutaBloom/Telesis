import { expectElementToHaveClasses, render, screen, userEvent, vi } from '@/test-utils';

import { ToggleMenuButton } from './ToggleMenuButton';

describe('ToggleMenuButton', () => {
  describe('Styling and Classes', () => {
    it('should have correct Tailwind classes applied', () => {
      render(<ToggleMenuButton data-testid="toggle-menu-button" />);
      const button = screen.getByTestId('toggle-menu-button');

      // Test button classes using our CSS testing utilities
      expectElementToHaveClasses(button, [
        'p-2',
        'focus-visible:ring-offset-0',
      ]);
    });

    it('should have proper SVG icon with correct classes', () => {
      render(<ToggleMenuButton data-testid="toggle-menu-button" />);
      const button = screen.getByTestId('toggle-menu-button');
      const svg = button.querySelector('svg');

      expect(svg).toBeInTheDocument();

      if (svg) {
        expectElementToHaveClasses(svg as unknown as HTMLElement, [
          'size-6',
          'stroke-current',
        ]);

        // Check SVG attributes (note: case-sensitive for SVG attributes)
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
        expect(svg).toHaveAttribute('stroke-width', '1.5');
        expect(svg).toHaveAttribute('fill', 'none');
        expect(svg).toHaveAttribute('stroke-linecap', 'round');
        expect(svg).toHaveAttribute('stroke-linejoin', 'round');
      }
    });
  });

  describe('Accessibility', () => {
    it('should be accessible as a button', () => {
      render(<ToggleMenuButton data-testid="toggle-menu-button" />);
      const button = screen.getByTestId('toggle-menu-button');

      expect(button).toBeInTheDocument();
      expect(button.tagName.toLowerCase()).toBe('button');
    });

    it('should be focusable', () => {
      render(<ToggleMenuButton data-testid="toggle-menu-button" />);
      const button = screen.getByTestId('toggle-menu-button');

      button.focus();

      expect(button).toHaveFocus();
    });
  });

  describe('Interactions', () => {
    it('should call the callback when the user clicks on the button', async () => {
      const handler = vi.fn();
      const user = userEvent.setup();

      render(<ToggleMenuButton onClick={handler} data-testid="toggle-menu-button" />);
      const button = screen.getByTestId('toggle-menu-button');

      await user.click(button);

      expect(handler).toHaveBeenCalledOnce();
    });

    it('should be activated with keyboard (Enter key)', async () => {
      const handler = vi.fn();
      const user = userEvent.setup();

      render(<ToggleMenuButton onClick={handler} data-testid="toggle-menu-button" />);
      const button = screen.getByTestId('toggle-menu-button');

      button.focus();
      await user.keyboard('{Enter}');

      expect(handler).toHaveBeenCalledOnce();
    });

    it('should be activated with keyboard (Space key)', async () => {
      const handler = vi.fn();
      const user = userEvent.setup();

      render(<ToggleMenuButton onClick={handler} data-testid="toggle-menu-button" />);
      const button = screen.getByTestId('toggle-menu-button');

      button.focus();
      await user.keyboard(' ');

      expect(handler).toHaveBeenCalledOnce();
    });
  });
});
