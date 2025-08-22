import React, { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { RequestStatusSchema } from '../../../../../packages/database';
import { getBase64VersionDate } from 'utils';

export const GalleryWall: React.FC = () => {
  const [images, setImages] = useState<
    { id: string; gifUrl: string; isShowed: boolean }[]
  >([]);
  const [queueImages, setQueueImages] = useState<
    { id: string; gifUrl: string; isShowed: boolean }[]
  >([]);
  const [modalImage, setModalImage] = useState<{
    id: string;
    gifUrl: string;
    isShowed: boolean;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const [modalRect, setModalRect] = useState<DOMRect | null>(null);

  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const modalImgRef = useRef<HTMLImageElement | null>(null);

  // Fetch and subscribe to UserGifRequest
  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('UserGifRequest')
        .select('id, gifUrl, isShowed')
        .eq('requestStatus', RequestStatusSchema.Enum.SUCCESS)
        .not('gifUrl', 'is', null)
        .order('createdAt', { ascending: false });
      if (!error && data) {
        setImages(data);
        // Only queue images not shown yet
        setQueueImages((q) => {
          const qIds = new Set(q.map((i) => i.id));
          const newImages = data.filter(
            (img) => img.isShowed === false && !qIds.has(img.id)
          ) as { id: string; gifUrl: string; isShowed: boolean }[];
          return [...q, ...newImages.reverse()];
        });
      }
    };
    fetchImages()
      .then(() => {
        console.log('success');
      })
      .catch(() => {
        console.log('error');
      });

    const channel = supabase
      .channel('public:UserGifRequest')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'UserGifRequest' },
        (payload) => {
          console.log(payload);
          fetchImages();
        }
      )
      .subscribe();

    return () => {
      supabase
        .removeChannel(channel)
        .then(() => {
          console.log('success');
        })
        .catch(() => {
          console.log('error');
        });
    };
  }, []);

  // When queueImages changes, if modal is not open, open the oldest image in the queue
  useEffect(() => {
    if (!modalOpen && queueImages.length > 0 && !isOpening && !isClosing) {
      openModal(queueImages[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueImages, modalOpen, isOpening, isClosing]);

  // Open modal and record the thumbnail's bounding rect
  const openModal = useCallback(
    (img: { id: string; gifUrl: string; isShowed: boolean }, idx?: number) => {
      setModalImage(img);
      setModalOpen(true);
      setIsClosing(false);
      setIsOpening(true);
      setTimeout(() => {
        const imageIdx =
          typeof idx === 'number'
            ? idx
            : images.findIndex((i) => i.id === img.id);
        const rect = imgRefs.current[imageIdx]?.getBoundingClientRect();
        setOriginRect(rect ?? null);
      }, 0);
    },
    [images]
  );

  // When modal image is rendered, trigger zoom-in animation
  useEffect(() => {
    if (isOpening && modalImgRef.current && originRect) {
      requestAnimationFrame(() => {
        setIsOpening(false);
      });
    }
  }, [isOpening, originRect]);

  // Auto-close after 6 seconds
  useEffect(() => {
    if (modalOpen && !isClosing && !isOpening) {
      const t = setTimeout(() => handleClose(), 6000);
      return () => clearTimeout(t);
    }
  }, [modalOpen, isClosing, isOpening]);

  // On close, record modal image rect and trigger animation
  const handleClose = useCallback(() => {
    if (!modalImgRef.current) {
      return;
    }
    setModalRect(modalImgRef.current.getBoundingClientRect());
    setIsClosing(true);
  }, []);

  // After animation, remove modal and update isShowed in Supabase
  useEffect(() => {
    if (!isClosing) {
      return;
    }
    const timeout = setTimeout(async () => {
      setModalOpen(false);
      setIsClosing(false);
      setOriginRect(null);
      setModalRect(null);
      // Remove the displayed image from the queue and mark as shown
      setQueueImages((q) => {
        if (modalImage) {
          // Update isShowed in Supabase
          new Promise(async (resolve, reject) => {
            try {
              await supabase
                .from('UserGifRequest')
                .update({ isShowed: true })
                .eq('id', modalImage.id);
              resolve('success');
            } catch (error) {
              console.log(error);
              reject('error');
            }
          })
            .then(() => {
              console.log('success');
            })
            .catch(() => {
              console.log('error');
            });

          return q.filter((img) => img.id !== modalImage.id);
        }
        return q;
      });
      setModalImage(null);
    }, 600);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClosing]);

  return (
    <div className="w-[100%] cursor-none">
      <div className="flex h-[100%] w-full items-center justify-center gap-4 overflow-auto bg-black p-8">
        <div className="flex w-full flex-wrap justify-center gap-x-4 gap-y-2">
          {images.map((img, idx) => (
            <button
              key={`button-${img.id}`}
              onClick={() => {
                openModal(img, idx);
              }}
            >
              <img
                key={img.id}
                ref={(el: HTMLImageElement | null) => {
                  imgRefs.current[idx] = el;
                }}
                src={`${img.gifUrl}&v=${getBase64VersionDate()}`}
                draggable={false}
                alt="Gallery"
                className="h-auto w-[200px] cursor-none object-cover"
                style={{
                  transition: 'box-shadow 0.2s',
                  boxShadow:
                    modalImage &&
                    modalImage.gifUrl === img.gifUrl &&
                    modalOpen &&
                    !isClosing &&
                    !isOpening
                      ? '0 0 0 4px #fff'
                      : undefined,
                }}
              />
            </button>
          ))}
        </div>
      </div>
      {(modalOpen || isClosing || isOpening) && modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-colors"
          style={
            isClosing
              ? {
                  background: 'rgba(0,0,0,0)',
                  transition: 'background 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                  pointerEvents: 'none',
                }
              : isOpening
                ? {
                    background: 'rgba(0,0,0,0.2)',
                    transition:
                      'background 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                    pointerEvents: 'none',
                  }
                : {}
          }
        >
          <img
            ref={modalImgRef}
            src={modalImage.gifUrl}
            alt="Modal"
            className="max-h-[70%] w-[100%] max-w-[70%] rounded-lg object-contain shadow-2xl"
            draggable={false}
            style={
              isClosing
                ? (() => {
                    if (isClosing && originRect && modalRect) {
                      const scaleX = originRect.width / modalRect.width;
                      const scaleY = originRect.height / modalRect.height;
                      const translateX =
                        originRect.left +
                        originRect.width / 2 -
                        (modalRect.left + modalRect.width / 2);
                      const translateY =
                        originRect.top +
                        originRect.height / 2 -
                        (modalRect.top + modalRect.height / 2);

                      return {
                        transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
                        opacity: 0,
                        transition:
                          'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                        willChange: 'transform, opacity',
                        pointerEvents: 'none',
                      };
                    }
                    return {};
                  })()
                : isOpening && originRect && modalImgRef.current
                  ? (() => {
                      const modalRect =
                        modalImgRef.current.getBoundingClientRect();
                      const scaleX = originRect.width / modalRect.width;
                      const scaleY = originRect.height / modalRect.height;
                      const translateX =
                        originRect.left +
                        originRect.width / 2 -
                        (modalRect.left + modalRect.width / 2);
                      const translateY =
                        originRect.top +
                        originRect.height / 2 -
                        (modalRect.top + modalRect.height / 2);

                      return {
                        transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
                        opacity: 0.5,
                        transition: 'none',
                        willChange: 'transform, opacity',
                        pointerEvents: 'none',
                      };
                    })()
                  : {
                      transition:
                        'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s',
                      transform: 'none',
                      opacity: 1,
                    }
            }
          />
        </div>
      )}
    </div>
  );
};

export default GalleryWall;
