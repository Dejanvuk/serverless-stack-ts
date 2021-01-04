import React, { FC, ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { NavItem } from 'react-bootstrap';

interface IProps {
  children?: ReactNode;
  href: string;
}

const RouteNavItem: FC<IProps> = props => {
  const { href } = props;
  return (
    <Route
      path={href}
      exact
      children={({ history }) => (
        <NavItem
          onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
              history.push(e.currentTarget.getAttribute('href')!)
            // eslint-disable-next-line react/jsx-curly-newline
          }
          {...props}
        >
          {props.children}
        </NavItem>
      )}
    />
  );
};

export default RouteNavItem;
