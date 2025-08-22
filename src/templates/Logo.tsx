import { ThreeOlivesLogo } from '@/components/brand';
import { AppConfig } from '@/utils/AppConfig';

export const Logo = (props: {
  isTextHidden?: boolean;
  variant?: 'logomark' | 'horizontal' | 'stacked';
  size?: 'sm' | 'default' | 'lg' | 'xl' | '2xl';
  colorScheme?: 'default' | 'monochrome' | 'reverse';
  className?: string;
  onClick?: () => void;
}) => {
  const {
    isTextHidden = false,
    variant = 'horizontal',
    size = 'default',
    colorScheme = 'default',
    className,
    onClick,
    ...rest
  } = props;

  return (
    <ThreeOlivesLogo
      variant={isTextHidden ? 'logomark' : variant}
      size={size}
      colorScheme={colorScheme}
      showText={!isTextHidden}
      className={className}
      onClick={onClick}
      aria-label={`${AppConfig.name} - ${AppConfig.tagline}`}
      {...rest}
    />
  );
};
