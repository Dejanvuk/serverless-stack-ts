import React, { FC, ReactNode } from 'react';
import Button from 'react-bootstrap/Button';
import { BsArrowRepeat } from 'react-icons/bs';
import './LoaderButton.css';

interface IProps {
  isLoading: boolean;
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
  block: any;
  size: 'sm' | 'lg' | undefined;
  type?: string;
  variant?: string;
  onClick?: (event: any) => void;
}

const LoaderButton: FC<IProps> = ({
  isLoading,
  className = '',
  disabled = false,
  ...props
}) => {
  const { children } = props;
  return (
    <Button
      disabled={disabled || isLoading}
      className={`LoaderButton ${className}`}
      {...props}
    >
      {isLoading && <BsArrowRepeat className="spinning" />}
      {children}
    </Button>
  );
};

export default LoaderButton;
