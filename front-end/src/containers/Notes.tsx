/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useRef, useState, useEffect, FC } from 'react';
import Form from 'react-bootstrap/Form';
import { API, Storage } from 'aws-amplify';
import { useParams, useHistory } from 'react-router-dom';
import LoaderButton from '../components/LoaderButton';
import { onError } from '../libs/errorLib';
import { s3Upload } from '../libs/awsLib';
import config from '../config';
import { Note } from '../common/types';
import './Notes.css';

interface RouteParams {
  id: string;
}

interface INoteAttachment extends Note {
  attachmentURL?: string;
}

const Notes: FC = () => {
  const file = useRef<HTMLInputElement | null>(null);
  const { id } = useParams<RouteParams>();
  const history = useHistory();
  const [note, setNote] = useState<INoteAttachment | null>(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadNote(): Promise<INoteAttachment> {
      return API.get('notes', `/notes/${id}`, '') as Promise<INoteAttachment>;
    }

    async function onLoad(): Promise<void> {
      try {
        const loadedNote = await loadNote();
        const { content, attachment } = loadedNote;

        if (attachment) {
          loadedNote.attachmentURL = (await Storage.vault.get(
            attachment,
          )) as string;
        }

        setContent(content);
        setNote(loadedNote);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm(): boolean {
    return content.length > 0;
  }

  function formatFilename(str: string): string {
    return str.replace(/^\w+-/, '');
  }

  /*
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    file.current = event.target.files[0];
  }
  */

  function saveNote(note: INoteAttachment): Promise<void> {
    return API.put('notes', `/notes/${id}`, {
      body: note,
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    let attachment;

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
      if (file.current) {
        attachment = await s3Upload(file.current);
      }

      if (attachment !== null && note != null) {
        await saveNote({
          content,
          attachment: attachment || note.attachment,
        });
      }

      history.push('/');
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteNote(): Promise<void> {
    return API.del('notes', `/notes/${id}`, '');
  }

  async function handleDelete(event: any): Promise<void> {
    event.preventDefault();

    const confirmed = window.confirm(
      'Are you sure you want to delete this note?',
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteNote();
      history.push('/');
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="Notes">
      {note && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              as="textarea"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            {note.attachment && (
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={note.attachmentURL}
                >
                  {formatFilename(note.attachment)}
                </a>
              </p>
            )}
            <Form.Control ref={file} type="file" />
          </Form.Group>
          <LoaderButton
            block
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </Form>
      )}
    </div>
  );
};

export default Notes;
