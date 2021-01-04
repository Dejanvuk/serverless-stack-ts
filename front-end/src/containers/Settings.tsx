/* eslint-disable no-alert */
import React, { useState, useEffect, FC } from 'react';
import { API } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { Stripe } from '@stripe/stripe-js';
import BillingForm from '../components/BillingForm';
import { onError } from '../libs/errorLib';
import config from '../config';
import './Settings.css';

const Settings: FC = () => {
  const history = useHistory();
  const [stripe, setStripe] = useState<Stripe>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (window.Stripe) setStripe(window.Stripe(config.STRIPE_KEY));
  }, []);

  function billUser(details: any): Promise<void> {
    return API.post('notes', '/billing', {
      body: details,
    });
  }

  async function handleFormSubmit(
    storage: any,
    { token, error }: { token: any; error: any },
  ): Promise<void> {
    if (error) {
      onError(error);
      return;
    }

    setIsLoading(true);

    try {
      await billUser({
        storage,
        source: token.id,
      });

      alert('Your card has been charged successfully!');
      history.push('/');
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  const fonts = [
    {
      cssSrc:
        'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800',
    },
  ];

  return (
    <div className="Settings">
      <Elements stripe={stripe as Stripe} options={{ fonts }}>
        <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
      </Elements>
    </div>
  );
};

export default Settings;
