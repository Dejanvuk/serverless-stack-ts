export interface Note {
  noteId?: string;
  createdAt?: string;
  content: string;
  attachment: string;
}

export interface IUser {
  username: string;
  password: string;
}
