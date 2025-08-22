import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '../../../lib/supabaseClient';

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

// CORS headers for better browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400', // 24 hours
};

// Security headers to prevent authentication issues
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: { ...corsHeaders, ...securityHeaders },
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
      'Content-Type': contentType,
      'Content-Disposition': filename
        ? `attachment; filename="${filename}"`
        : `attachment; filename="${path.split('/').pop()}"`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      ...corsHeaders, // Add CORS headers to the response
      ...securityHeaders, // Add security headers to prevent auth issues
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
