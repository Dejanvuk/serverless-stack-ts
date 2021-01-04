import React, { ReactNode } from 'react';
import { logError } from '../libs/errorLib';
import './ErrorBoundary.css';

interface IProps {
  children: ReactNode;
}

type Error = {
  hasError: boolean;
};

export default class ErrorBoundary extends React.Component<IProps, Error> {
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): Error {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any): void {
    logError(error, errorInfo);
  }

  render(): ReactNode {
    const { hasError } = this.state;
    const { children } = this.props;

    return hasError ? (
      <div className="ErrorBoundary text-center">
        <h3>Sorry there was a problem loading this page</h3>
      </div>
    ) : (
      children
    );
  }
}
