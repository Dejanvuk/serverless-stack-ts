/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-indent */
import React, { useState, useEffect, FC, ReactElement } from 'react';
import { Auth } from 'aws-amplify';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useHistory } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import ErrorBoundary from './components/ErrorBoundary';
import { AppContext } from './libs/contextLib';
import { onError } from './libs/errorLib';
import Routes from './Routes';
import './App.css';

const App: FC = () => {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  async function onLoad(): Promise<void> {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  useEffect(() => {
    onLoad();
  }, []);

  async function handleLogout(): Promise<void> {
    await Auth.signOut();

    userHasAuthenticated(false);

    history.push('/login');
  }

  function renderApp(): ReactElement | null {
    return isAuthenticating
      ? null
      : !isAuthenticating && (
          <div className="App container py-3">
            <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
              <LinkContainer to="/">
                <Navbar.Brand className="font-weight-bold text-muted">
                  Scratch
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                <Nav activeKey={window.location.pathname}>
                  {isAuthenticated ? (
                    <>
                      <LinkContainer to="/settings">
                        <Nav.Link>Settings</Nav.Link>
                      </LinkContainer>
                      <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                    </>
                  ) : (
                    <>
                      <LinkContainer to="/signup">
                        <Nav.Link>Signup</Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/login">
                        <Nav.Link>Login</Nav.Link>
                      </LinkContainer>
                    </>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            <ErrorBoundary>
              <AppContext.Provider
                value={{ isAuthenticated, userHasAuthenticated }}
              >
                <Routes />
              </AppContext.Provider>
            </ErrorBoundary>
          </div>
        );
  }

  return renderApp();
};

export default App;
