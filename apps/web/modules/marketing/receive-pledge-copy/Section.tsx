'use client';

import { useState, useEffect, useCallback } from 'react';
import SimpleButton from '@marketing/home/components/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@shared/components/Logo';
import { useUser } from '@saas/auth/hooks/use-user';
import QRCodeGenerator from '@marketing/shared/components/QRCodeGenerator';
import { apiClient } from '@shared/lib/api-client';
import { supabase } from '../../../lib/supabaseClient';

export default function PledgeCopy() {
  const router = useRouter();
  const { gifUrl, userGifRequestId } = useUser();
  const searchParams = useSearchParams();
  const noRemoveBackground = searchParams.get('noRemoveBackground');
  const additionUrl = noRemoveBackground
    ? `?noRemoveBackground=${noRemoveBackground}`
    : '?';

  const [downloadPledgeUrl, setDownloadPledgeUrl] = useState<string>('');
  const [downloadStatus, setDownloadStatus] = useState<{
    isDownloaded: boolean;
    downloadedAt: string | null;
    requestId: string | null;
  } | null>(null);

  const createTrackedDownloadUrlMutation =
    apiClient.uploads.createTrackedDownloadUrl.useMutation();

  // Initial query to get current download status
  const { data: initialDownloadStatus } =
    apiClient.uploads.getDownloadStatus.useQuery(
      { id: userGifRequestId ?? undefined },
      {
        enabled: !!userGifRequestId,
      }
    );

  const customFilename = 'pub_pledge_wall.gif';

  const redirectToThankYou = useCallback(() => {
    router.push(`/thank-you${additionUrl}`);
  }, [router, additionUrl]);

  // Set initial download status when data is loaded
  useEffect(() => {
    if (initialDownloadStatus) {
      setDownloadStatus({
        isDownloaded: initialDownloadStatus.isDownloaded,
        downloadedAt: initialDownloadStatus.downloadedAt
          ? typeof initialDownloadStatus.downloadedAt === 'string'
            ? initialDownloadStatus.downloadedAt
            : initialDownloadStatus.downloadedAt.toISOString()
          : null,
        requestId: initialDownloadStatus.requestId,
      });
    }
  }, [initialDownloadStatus]);

  // Set up Supabase Realtime subscription for download status updates
  useEffect(() => {
    const channel = supabase
      .channel('user-gif-request-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'UserGifRequest',
        },
        (payload) => {
          console.info('Realtime update received:', payload);
          const newRecord = payload.new as any;

          if (newRecord.isDownloaded !== undefined) {
            setDownloadStatus({
              isDownloaded: newRecord.isDownloaded,
              downloadedAt: newRecord.downloadedAt,
              requestId: newRecord.id,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Create tracked download URL with custom filename when gifUrl is available
  useEffect(() => {
    let cancelled = false;

    const createTrackedDownloadUrl = async () => {
      if (!gifUrl && !cancelled) {
        setDownloadPledgeUrl('');
        return;
      }

      try {
        // Extract the path from the gifUrl if it's already a full URL
        let gifPath = gifUrl;
        if (gifUrl?.includes('supabase')) {
          // Extract the path from a Supabase URL
          const urlParts = gifUrl.split('/');
          const bucketIndex = urlParts.findIndex((part) => part === 'gifs');
          if (bucketIndex !== -1) {
            gifPath = urlParts.slice(bucketIndex + 1).join('/');
          }
        }

        // Create tracked download URL with custom filename
        const { url } = await createTrackedDownloadUrlMutation.mutateAsync({
          filePath: gifPath || '',
          bucket: 'gifs',
          filename: customFilename,
          userGifRequestId: userGifRequestId || undefined,
        });

        if (!cancelled) {
          setDownloadPledgeUrl(url);
        }
      } catch (error) {
        console.error('Failed to create tracked download URL:', error);
        if (!cancelled) {
          // Fallback to original gifUrl with download parameter
          setDownloadPledgeUrl(
            gifUrl
              ? `${gifUrl}?download=${encodeURIComponent(customFilename)}`
              : ''
          );
        }
      }
    };

    createTrackedDownloadUrl();

    return () => {
      cancelled = true;
    };
  }, [gifUrl]);

  // Redirect to thank you page when download is detected
  useEffect(() => {
    if (downloadStatus?.isDownloaded) {
      // Small delay to ensure download completed, then redirect
      setTimeout(() => {
        redirectToThankYou();
      }, 1000);
    }
  }, [downloadStatus?.isDownloaded, redirectToThankYou]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-12 bg-white pb-20">
      <Logo />
      {/* TOP BAR */}
      <h1 className="text-center text-[80px] uppercase leading-[1] -tracking-[1.6px] portrait:mx-[300px] landscape:mx-20">
        Want a copy of your pledge?
      </h1>

      {/* INTRO TEXT */}
      <p className="text-center text-2xl leading-[1.25] text-black/70">
        Your pledge has joined others on our Live Pledge Wall!
        <br />
        You&apos;re now part of a growing wave of support for Singapore&apos;s
        coastal future.
      </p>

      {/* DOWNLOAD MY PLEDGE SECTION */}
      <div className="flex h-full w-full flex-col items-center justify-between portrait:mt-16 landscape:mt-0">
        <div className="flex flex-col gap-9">
          <h2 className="font-text-bold text-[48px] uppercase">
            DOWNLOAD MY PLEDGE
          </h2>

          <div className="flex flex-col items-center gap-6">
            <QRCodeGenerator
              value={downloadPledgeUrl}
              size={335}
              className="rounded-md"
            />
            {downloadPledgeUrl && (
              <div className="flex flex-col items-center gap-4">
                <p className="text-center text-sm text-gray-600">
                  Scan to download your pledge
                </p>
              </div>
            )}
          </div>
        </div>

        <SimpleButton
          className="w-[400px] items-center justify-center self-center rounded-full py-[26px] text-[32px] font-bold text-white"
          onClick={redirectToThankYou}
        >
          SKIP
        </SimpleButton>
      </div>
    </div>
  );
}
