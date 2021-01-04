import React, { FC, ReactNode } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useAppContext } from '../libs/contextLib';

interface IProps {
  children?: ReactNode;
  exact?: boolean;
  path?: string | string[];
}

const AuthenticatedRoute: FC<IProps> = ({ children, ...rest }) => {
  const { pathname, search } = useLocation();
  const { isAuthenticated } = useAppContext();
  return (
    <Route {...rest}>
      {isAuthenticated ? (
        children
      ) : (
        <Redirect to={`/login?redirect=${pathname}${search}`} />
      )}
    </Route>
  );
};

export default AuthenticatedRoute;
