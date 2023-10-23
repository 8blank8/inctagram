import { User } from '@prisma/client';

export class CreateDeviceModel {
  lastActiveDate?: string | null;
  ip?: string | null;
  title: string;
  userId: string;
  user: User;
}
