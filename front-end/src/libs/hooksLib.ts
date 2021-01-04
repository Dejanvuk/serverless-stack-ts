import React, { useState } from 'react';

export function useFormFields(initialState: any): any {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    function (event: React.ChangeEvent<HTMLInputElement>) {
      setValues({
        ...fields,
        [event.target.id]: event.target.value,
      });
    },
  ];
}