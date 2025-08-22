import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Home } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

describe('Breadcrumb Components', () => {
  it('renders basic breadcrumb structure', () => {
    render(
      <Breadcrumb data-testid="breadcrumb">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    const breadcrumb = screen.getByTestId('breadcrumb');

    expect(breadcrumb).toBeInTheDocument();
    expect(breadcrumb).toHaveAttribute('aria-label', 'breadcrumb');
    expect(breadcrumb.tagName).toBe('NAV');

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Current Page')).toBeInTheDocument();
  });

  it('renders breadcrumb list as ordered list', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList data-testid="breadcrumb-list">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    const list = screen.getByTestId('breadcrumb-list');

    expect(list.tagName).toBe('OL');
    expect(list).toHaveClass('flex', 'flex-wrap', 'items-center');
  });

  it('renders breadcrumb items as list items', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem data-testid="breadcrumb-item">
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    const item = screen.getByTestId('breadcrumb-item');

    expect(item.tagName).toBe('LI');
    expect(item).toHaveClass('inline-flex', 'items-center');
  });

  it('handles breadcrumb links with proper accessibility', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" onClick={handleClick}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    const link = screen.getByRole('link', { name: 'Home' });

    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveClass('sage-hover-primary');

    await user.click(link);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders current page with proper accessibility attributes', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Current Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    const currentPage = screen.getByText('Current Page');

    expect(currentPage).toHaveAttribute('role', 'link');
    expect(currentPage).toHaveAttribute('aria-disabled', 'true');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
    expect(currentPage).toHaveClass('sage-text-primary');
  });

  it('renders separator with default chevron icon', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator data-testid="separator" />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    const separator = screen.getByTestId('separator');

    expect(separator).toHaveAttribute('role', 'presentation');
    expect(separator).toHaveAttribute('aria-hidden', 'true');
    expect(separator).toHaveClass('text-sage-stone');

    const chevronIcon = separator.querySelector('svg');

    expect(chevronIcon).toBeInTheDocument();
  });

  it('renders separator with custom content', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator data-testid="custom-separator">
            <span>/</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    const separator = screen.getByTestId('custom-separator');

    expect(screen.getByText('/')).toBeInTheDocument();
  });

  it('renders ellipsis component', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis data-testid="ellipsis" />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    const ellipsis = screen.getByTestId('ellipsis');

    expect(ellipsis).toHaveAttribute('role', 'presentation');
    expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
    expect(ellipsis).toHaveClass('flex', 'h-9', 'w-9', 'items-center', 'justify-center');

    const screenReaderText = screen.getByText('More');

    expect(screenReaderText).toHaveClass('sr-only');
  });

  it('supports asChild prop for custom link components', () => {
    const CustomLink = ({ children, ...props }: any) => (
      <a {...props} data-custom="true">
        {children}
      </a>
    );

    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <CustomLink href="/">Home</CustomLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    const link = screen.getByRole('link', { name: 'Home' });

    expect(link).toHaveAttribute('data-custom', 'true');
    expect(link).toHaveClass('sage-hover-primary');
  });

  it('applies Modern Sage focus styles', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" data-testid="sage-link">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    const link = screen.getByTestId('sage-link');

    expect(link).toHaveClass('sage-ring', 'sage-hover-primary');
  });

  it('renders complex breadcrumb with multiple levels', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="size-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products/electronics">Electronics</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    expect(screen.getByRole('link', { name: '' })).toBeInTheDocument(); // Home icon link
    expect(screen.getByRole('link', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Electronics' })).toBeInTheDocument();
    expect(screen.getByText('Current Product')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument(); // Ellipsis screen reader text
  });

  it('supports custom className on all components', () => {
    render(
      <Breadcrumb className="custom-breadcrumb">
        <BreadcrumbList className="custom-list">
          <BreadcrumbItem className="custom-item">
            <BreadcrumbLink href="/" className="custom-link">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="custom-separator" />
          <BreadcrumbItem>
            <BreadcrumbPage className="custom-page">Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    expect(screen.getByLabelText('breadcrumb')).toHaveClass('custom-breadcrumb');
    expect(screen.getByRole('list')).toHaveClass('custom-list');
    expect(screen.getByRole('link')).toHaveClass('custom-link');
    expect(screen.getByText('Current')).toHaveClass('custom-page');
  });
});
