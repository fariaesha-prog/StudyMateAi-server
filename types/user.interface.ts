import { Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  profilePicture: string;
  title: string;
  bio: string;
  favoriteSubjects: string[];
  comparePassword(password: string): Promise<boolean>;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}