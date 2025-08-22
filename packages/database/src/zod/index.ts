import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum([
  'ReadUncommitted',
  'ReadCommitted',
  'RepeatableRead',
  'Serializable',
]);

export const UserSessionScalarFieldEnumSchema = z.enum([
  'id',
  'userId',
  'createdAt',
  'expiresAt',
]);

export const UserScalarFieldEnumSchema = z.enum([
  'id',
  'email',
  'name',
  'userType',
  'createdAt',
  'updatedAt',
]);

export const UserGifRequestScalarFieldEnumSchema = z.enum([
  'id',
  'userId',
  'gifUrl',
  'selfieVideoUrl',
  'isShowed',
  'isDownloaded',
  'downloadedAt',
  'requestStatus',
  'createdAt',
  'updatedAt',
]);

export const SortOrderSchema = z.enum(['asc', 'desc']);

export const QueryModeSchema = z.enum(['default', 'insensitive']);

export const NullsOrderSchema = z.enum(['first', 'last']);

export const UserTypeSchema = z.enum(['PC', 'IPAD']);

export type UserTypeType = `${z.infer<typeof UserTypeSchema>}`;

export const RequestStatusSchema = z.enum([
  'PENDING',
  'STANDBY',
  'PROCESSING',
  'FAILED',
  'SUCCESS',
]);

export type RequestStatusType = `${z.infer<typeof RequestStatusSchema>}`;

export const FrameStatusSchema = z.enum(['PENDING', 'FAILED', 'SUCCESS']);

export type FrameStatusType = `${z.infer<typeof FrameStatusSchema>}`;

export const GifStatusSchema = z.enum(['PENDING', 'FAILED', 'SUCCESS']);

export type GifStatusType = `${z.infer<typeof GifStatusSchema>}`;

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SESSION SCHEMA
/////////////////////////////////////////

export const UserSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
});

export type UserSession = z.infer<typeof UserSessionSchema>;

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  userType: UserTypeSchema,
  id: z.string().cuid(),
  email: z.string().nullable(),
  name: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type User = z.infer<typeof UserSchema>;

/////////////////////////////////////////
// USER GIF REQUEST SCHEMA
/////////////////////////////////////////

export const UserGifRequestSchema = z.object({
  requestStatus: RequestStatusSchema,
  id: z.string(),
  userId: z.string(),
  gifUrl: z.string().nullable(),
  selfieVideoUrl: z.string().nullable(),
  isShowed: z.boolean(),
  isDownloaded: z.boolean(),
  downloadedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type UserGifRequest = z.infer<typeof UserGifRequestSchema>;
