import React, { useState, FC } from 'react';
import Form from 'react-bootstrap/Form';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import LoaderButton from './LoaderButton';
import { useFormFields } from '../libs/hooksLib';
import './BillingForm.css';

interface IProps {
  isLoading: boolean;
  onSubmit: any; // change to proper type
}

const BillingForm: FC<IProps> = ({ isLoading, onSubmit }) => {
  const [fields, handleFieldChange] = useFormFields({
    name: '',
    storage: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  function validateForm(): boolean {
    return fields.name !== '' && fields.storage !== '' && isCardComplete;
  }

  async function handleSubmitClick(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.
      // Disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { token, error } = await stripe.createToken(cardElement!);

    setIsProcessing(false);

    onSubmit(fields.storage, { token, error });
  }

  return (
    <Form className="BillingForm" onSubmit={handleSubmitClick}>
      <Form.Group controlId="storage">
        <Form.Label>Storage</Form.Label>
        <Form.Control
          size="lg"
          min="0"
          type="number"
          value={fields.storage}
          onChange={handleFieldChange}
          placeholder="Number of notes to store"
        />
      </Form.Group>
      <hr />
      <Form.Group controlId="name">
        <Form.Label>Cardholder&apos;s name</Form.Label>
        <Form.Control
          size="lg"
          type="text"
          value={fields.name}
          onChange={handleFieldChange}
          placeholder="Name on the card"
        />
      </Form.Group>
      <Form.Label>Credit Card Info</Form.Label>
      <CardElement
        className="card-field"
        onChange={(e: any) => setIsCardComplete(e.complete)}
        options={{
          iconStyle: 'solid',
          style: {
            base: {
              fontFamily: "'Open Sans', sans-serif",
              color: '#495057',
              fontSize: '16px',
            },
          },
        }}
      />
      <LoaderButton
        block
        size="lg"
        type="submit"
        isLoading={isProcessing || isLoading}
        disabled={!validateForm()}
      >
        Purchase
      </LoaderButton>
    </Form>
  );
};

export default BillingForm;
