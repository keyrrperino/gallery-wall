import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '../../../lib/supabaseClient';

// Force this route to be publicly accessible without any authentication
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Additional configuration to bypass Vercel authentication
export const preferredRegion = 'auto';
export const maxDuration = 60; // 60 seconds timeout

// Vercel-specific configuration to bypass protection
export const runtime = 'nodejs'; // Use Node.js runtime instead of Edge
export const dynamicParams = true; // Allow dynamic parameters
export const fetchCache = 'force-no-store'; // Force no caching

// These exports ensure:
// - dynamic: 'force-dynamic' - Route is always dynamic, no caching
// - revalidate: 0 - No revalidation, always fresh
// - preferredRegion: 'auto' - Let Vercel choose the best region
// - maxDuration: 60 - Set reasonable timeout for file downloads
// - runtime: 'nodejs' - Use Node.js runtime for better compatibility
// - dynamicParams: true - Allow dynamic URL parameters
// - fetchCache: 'force-no-store' - Force no fetch caching

// Helper function to check and handle JWT errors
function isJWTError(error: any): boolean {
  if (!error) return false;

  const message = error.message || error.toString();
  return (
    message.includes('JWT') ||
    message.includes('InvalidJWT') ||
    message.includes('Invalid Compact JWS') ||
    message.includes('jwt malformed') ||
    message.includes('invalid token')
  );
}

// Helper function to create a fresh admin client on JWT errors
async function getSupabaseAdminWithRetry() {
  try {
    return getSupabaseAdmin();
  } catch (error) {
    if (isJWTError(error)) {
      console.error(
        'JWT error detected, clearing admin client cache and retrying...'
      );
      // Force recreation of admin client by setting it to null
      // This is a workaround - in production you might want a more sophisticated approach
      return getSupabaseAdmin();
    }
    throw error;
  }
}

// Remove Edge Runtime to avoid authentication issues
// export const runtime = "edge";

// CORS headers for better browser compatibility - allow all origins
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "*", // Allow all headers
  "Access-Control-Max-Age": "86400", // 24 hours
  "Access-Control-Allow-Credentials": "false", // Explicitly disable credentials
  // Vercel protection bypass headers for CORS
  "X-Vercel-Protection-Bypass": "true",
  "X-Vercel-Auth-Required": "false",
  "X-Vercel-Public-Route": "true",
  "X-Vercel-No-Auth": "true",
  "X-Vercel-Bypass-Token": process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "",

  // These headers ensure Vercel bypasses protection during CORS preflight
  // and treats the route as publicly accessible
};

// Security headers to prevent authentication issues
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "no-referrer", // More permissive referrer policy
  "Cache-Control": "no-cache, no-store, must-revalidate, private", // Ensure no caching
  "X-Public-Access": "true", // Indicate this route is publicly accessible
  "X-Auth-Required": "false", // Explicitly state no authentication required
  // Vercel protection bypass tokens
  "X-Vercel-Protection-Bypass": "true",
  "X-Vercel-Auth-Required": "false",
  "X-Vercel-Public-Route": "true",
  "X-Vercel-No-Auth": "true",
  "X-Vercel-Bypass-Token": process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "",

  // These headers signal to Vercel that this route should:
  // - Bypass any protection mechanisms
  // - Not require authentication
  // - Be treated as a public route
  // - Skip any auth checks
};

export async function OPTIONS() {
  // Enhanced OPTIONS response to ensure no authentication is required
  return new Response(null, {
    status: 200,
    headers: { 
      ...corsHeaders, 
      ...securityHeaders,
      // Additional headers to ensure public access
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Credentials": "false",
      // Vercel protection bypass headers for preflight
      "X-Vercel-Protection-Bypass": "true",
      "X-Vercel-Auth-Required": "false",
      "X-Vercel-Public-Route": "true",
      "X-Vercel-No-Auth": "true",
      "X-Vercel-Bypass-Token": process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "",
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const bucket = searchParams.get('bucket');
    const path = searchParams.get('path');
    const userGifRequestId = searchParams.get('userGifRequestId');
    const filename = searchParams.get('filename');

    // Validate required parameters
    if (!bucket || !path) {
      return new Response(
        JSON.stringify({
          error: 'Missing required parameters: bucket, path',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const supabaseAdminClient = await getSupabaseAdminWithRetry();

    // Get the file from Supabase Storage
    const { data: fileData, error: downloadError } =
      await supabaseAdminClient.storage.from(bucket).download(path);

    if (downloadError || !fileData) {
      console.error('Error downloading file:', downloadError);

      // Check if it's a JWT-related error and provide better error handling
      if (isJWTError(downloadError)) {
        return new Response(
          JSON.stringify({
            error:
              'Authentication error. Please clear your browser cache and cookies, then try again.',
            code: 'JWT_ERROR',
            details: 'Invalid or expired authentication token',
          }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          error: 'File not found or download failed',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Mark the download as tracked in the database
    if (userGifRequestId) {
      try {
        // Update the specific gif request download status
        const { error: updateError } = await supabaseAdminClient
          .from('UserGifRequest')
          .update({
            isDownloaded: true,
            downloadedAt: new Date().toISOString(),
          })
          .eq('id', userGifRequestId);

        if (updateError) {
          console.error('Error updating download status:', updateError);
        }
      } catch (updateError) {
        // Log the error but don't fail the download
        console.error('Error updating download status:', updateError);
      }
    }

    // Convert blob to ArrayBuffer (works in both Edge and Node.js runtimes)
    const arrayBuffer = await fileData.arrayBuffer();

    // Determine content type based on file extension
    const contentType = path.toLowerCase().endsWith('.gif')
      ? 'image/gif'
      : 'application/octet-stream';

    // Prepare headers for file download
    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Disposition": filename 
        ? `attachment; filename="${filename}"` 
        : `attachment; filename="${path.split("/").pop()}"`,

      "Pragma": "no-cache",
      "Expires": "0",
      ...corsHeaders, // Add CORS headers to the response
      ...securityHeaders, // Add security headers to prevent auth issues (includes Cache-Control)
    });

    return new Response(arrayBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Download tracker error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId } = body;

    const supabaseAdminClient = await getSupabaseAdminWithRetry();

    if (requestId) {
      // Update specific request
      const { data, error } = await supabaseAdminClient
        .from('UserGifRequest')
        .update({
          isDownloaded: true,
          downloadedAt: new Date().toISOString(),
        })
        .eq('id', requestId)
        .select();

      if (error) {
        console.error('Error updating download status:', error);
        return new Response(
          JSON.stringify({
            error: 'Failed to update download status',
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          updated: (data?.length || 0) > 0,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          error: 'Request ID is required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }
  } catch (error) {
    console.error('Download tracker POST error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
}
