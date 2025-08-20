import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../../../trpc/base";
import { db } from "database";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client for realtime functionality
const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase credentials not configured");
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

export const createTrackedDownloadUrl = publicProcedure
  .input(
    z.object({
      filePath: z.string().min(1),
      bucket: z.string().min(1).default("gifs"),
      filename: z.string().optional(),
      userGifRequestId: z.string().optional(), // Use userGifRequestId for tracking
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { filePath, bucket, filename, userGifRequestId } = input;

    // Get the base URL from environment (for Next.js API routes)
    const getBaseUrl = () => {
      if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL;
      }
      
      if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
      }
      
      // Development fallback
      return "http://localhost:3000";
    };
    
    const baseUrl = getBaseUrl();

    // Create the tracked download URL using Next.js Edge Runtime API route
    const params = new URLSearchParams({
      bucket,
      path: filePath,
    });

    if (userGifRequestId) {
      params.append('userGifRequestId', userGifRequestId);
    }

    if (filename) {
      params.append('filename', filename);
    }

    const trackedUrl = `${baseUrl}/api/download-tracker?${params.toString()}`;

    return { 
      url: trackedUrl,
      filePath,
      bucket, 
      userGifRequestId
    };
  });

export const getDownloadStatus = publicProcedure
  .input(
    z.object({
      id: z.string().optional(),
    })
  )
  .query(async ({ input, ctx }) => {
    const id = input.id;
    const supabase = getSupabaseAdmin();

    // Get the user's gif request and check if it's downloaded using Supabase for realtime compatibility
    const { data: userGifRequest, error } = await supabase
      .from('UserGifRequest')
      .select('id, isDownloaded, downloadedAt, gifUrl')
      .eq('id', id)
      .eq('requestStatus', 'SUCCESS')
      .order('createdAt', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching download status:', error);
      throw new Error('Failed to fetch download status');
    }

    return {
      isDownloaded: userGifRequest?.isDownloaded || false,
      downloadedAt: userGifRequest?.downloadedAt || null,
      requestId: userGifRequest?.id || null,
    };
  });

export const markAsDownloaded = publicProcedure
  .input(
    z.object({
      requestId: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { requestId } = input;
    const supabase = getSupabaseAdmin();

    // If requestId is provided, update that specific request
    if (requestId) {
      const { data, error } = await supabase
        .from('UserGifRequest')
        .update({
          isDownloaded: true,
          downloadedAt: new Date().toISOString(),
        })
        .eq('id', requestId)
        .select();

      if (error) {
        console.error('Error updating download status:', error);
        throw new Error('Failed to mark as downloaded');
      }

      return { success: (data?.length || 0) > 0 };
    }

    throw new Error("Request ID is required");
  });

// Helper procedure to subscribe to download status changes in realtime
export const subscribeToDownloadStatus = publicProcedure
  .input(
    z.object({
      userGifRequestId: z.string().optional(),
    })
  )
  .query(async ({ input, ctx }) => {
    const { userGifRequestId } = input;
    
    // This procedure provides the table name and filter for client-side realtime subscriptions
    return {
      table: 'UserGifRequest',
      filter: userGifRequestId ? `id=eq.${userGifRequestId}` : '',
      schema: 'public',
      event: 'UPDATE', // Listen for updates to download status
      userGifRequestId,
    };
  });
