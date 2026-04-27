import React from 'react';
import './Button.css';

export interface ButtonProps {
  /** Button label text */
  children: React.ReactNode;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Disable the button */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Full width */
  block?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  block = false,
  className = '',
}) => {
  return (
    <button
      className={[
        'morphix-btn',
        `morphix-btn--${variant}`,
        `morphix-btn--${size}`,
        block ? 'morphix-btn--block' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
