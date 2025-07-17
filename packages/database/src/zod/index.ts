import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserSessionScalarFieldEnumSchema = z.enum(['id','userId','createdAt','expiresAt']);

export const ImagesScalarFieldEnumSchema = z.enum(['id','userFaceGenRequestId','imageResult','prompt','gcpStoragePath','gcpSignedUrl','createdAt','updatedAt']);

export const UserScalarFieldEnumSchema = z.enum(['id','facebookUserId','name','gender','isEighteenAndAbove','email','userType','imageGenerationState','conversationId','createdAt','updatedAt','iAgreeToPrivacyPolicyTermsAndConditions']);

export const UserFaceGenRequestsScalarFieldEnumSchema = z.enum(['id','userId','facebookUserId','imageResult','requestType','requestStatus','imageUrls','prompt','tune','createdAt','updatedAt']);

export const UserTicketsScalarFieldEnumSchema = z.enum(['id','userId','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const RequestTypeSchema = z.enum(['KIOSK','MESSENGER']);

export type RequestTypeType = `${z.infer<typeof RequestTypeSchema>}`

export const UserTypeSchema = z.enum(['KIOSK','MESSENGER']);

export type UserTypeType = `${z.infer<typeof UserTypeSchema>}`

export const RequestStatusSchema = z.enum(['PENDING','FAILED','SUCCESS']);

export type RequestStatusType = `${z.infer<typeof RequestStatusSchema>}`

export const GenderSchema = z.enum(['MALE','FEMALE']);

export type GenderType = `${z.infer<typeof GenderSchema>}`

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
})

export type UserSession = z.infer<typeof UserSessionSchema>

/////////////////////////////////////////
// IMAGES SCHEMA
/////////////////////////////////////////

export const ImagesSchema = z.object({
  id: z.number().int(),
  userFaceGenRequestId: z.string(),
  imageResult: z.string(),
  prompt: z.string(),
  gcpStoragePath: z.string().nullable(),
  gcpSignedUrl: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Images = z.infer<typeof ImagesSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  gender: GenderSchema.nullable(),
  userType: UserTypeSchema,
  id: z.string().cuid(),
  facebookUserId: z.string().nullable(),
  name: z.string().nullable(),
  isEighteenAndAbove: z.boolean().nullable(),
  email: z.string().nullable(),
  imageGenerationState: z.string().nullable(),
  conversationId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  iAgreeToPrivacyPolicyTermsAndConditions: z.boolean().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER FACE GEN REQUESTS SCHEMA
/////////////////////////////////////////

export const UserFaceGenRequestsSchema = z.object({
  requestType: RequestTypeSchema,
  requestStatus: RequestStatusSchema,
  id: z.string(),
  userId: z.string(),
  facebookUserId: z.string().nullable(),
  imageResult: z.string().nullable(),
  imageUrls: z.string().array(),
  prompt: z.string().nullable(),
  tune: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UserFaceGenRequests = z.infer<typeof UserFaceGenRequestsSchema>

/////////////////////////////////////////
// USER TICKETS SCHEMA
/////////////////////////////////////////

export const UserTicketsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UserTickets = z.infer<typeof UserTicketsSchema>
