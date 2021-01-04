/* eslint-disable no-alert */
import React, { useRef, useState, FC } from 'react';
import { API } from 'aws-amplify';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import LoaderButton from '../components/LoaderButton';
import { onError } from '../libs/errorLib';
import { s3Upload } from '../libs/awsLib';
import config from '../config';

import { Note } from '../common/types';

import './NewNote.css';

const NewNote: FC = () => {
  const file = useRef<HTMLInputElement | null>(null);
  const history = useHistory();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function createNote(note: Note): Promise<void> {
    return API.post('notes', '/notes', {
      body: note,
    });
  }

  function validateForm(): boolean {
    return content.length > 0;
  }

  /*
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files !== null && event.target.files[0])
      file.current = event.target.files[0];
  }
  */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`,
      );
      return;
    }

    setIsLoading(true);

    try {
      const attachment = file.current ? await s3Upload(file.current) : null;

      if (attachment !== null) await createNote({ content, attachment });
      history.push('/');
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="NewNote">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Control
            value={content}
            as="textarea"
            onChange={e => setContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control ref={file} type="file" />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </Form>
    </div>
  );
};

export default NewNote;
