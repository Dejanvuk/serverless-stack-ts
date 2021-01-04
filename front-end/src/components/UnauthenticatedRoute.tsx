import React, { FC, ReactNode } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAppContext } from '../libs/contextLib';

function querystring(name: string, url = window.location.href): null | string {
  const editedName = name.replace(/[[]]/g, '\\$&');

  const regex = new RegExp(`[?&]${editedName}(=([^&#]*)|&|#|$)`, 'i');
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

interface IProps {
  children?: ReactNode;
  exact?: boolean;
  path?: string | string[];
}

const UnauthenticatedRoute: FC<IProps> = ({ children, ...rest }) => {
  const { isAuthenticated } = useAppContext();
  const redirect = querystring('redirect');
  return (
    <Route {...rest}>
      {!isAuthenticated ? (
        children
      ) : (
        <Redirect to={redirect === '' || redirect === null ? '/' : redirect} />
      )}
    </Route>
  );
};

export default UnauthenticatedRoute;
