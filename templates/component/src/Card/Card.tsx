import React from 'react';
import './Card.css';

export interface CardProps {
  /** Card title */
  title?: string;
  /** Card content */
  children: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, footer, className = '' }) => {
  return (
    <div className={`morphix-card ${className}`}>
      {title && <div className="morphix-card__header">{title}</div>}
      <div className="morphix-card__body">{children}</div>
      {footer && <div className="morphix-card__footer">{footer}</div>}
    </div>
  );
};

export default Card;
