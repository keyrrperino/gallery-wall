/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { apiClient } from "@shared/lib/api-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


import SimpleButton from "../../../../../modules/marketing/home/components/Button";

import Modal from "@marketing/home/components/Popups/Modal";
import { cn } from "@ui/lib";

import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PhotoWithFrame, PhotoWithFrameState } from "@marketing/home/components/PhotoWithFrame";
import { useUser } from "@saas/auth/hooks/use-user";


enum MODAL_STATE {
  PRINTING = "PRINTING",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  DONE_PRINTING = "DONE_PRINTING",
  THANK_YOU = "THANK_YOU",
  EMPTY = ""
}

const formSchema = z.object({
  email: z.string().email()
});

type FormValues = z.infer<typeof formSchema>;

export default function Results(props) {
  const router = useRouter();
  console.log(props);
  const { imageUrlWithFrameData } = useUser();

  const { searchParams } = props ?? {};

  const { requestId } = searchParams ?? {};
  const [, setIsSendingEmail] = useState<boolean>(false);
  const [selectedImageWithFrame, setSelectedImageWithFrame] = useState<string | null>(null);

  const [modalState, setIsModalState] = useState<MODAL_STATE>(MODAL_STATE.EMPTY);

  const sendEmailMutation = apiClient.emails.sendEmail.useMutation();

  const { data: faceGenRequestImages, isLoading } = apiClient.images.getImages.useQuery({
    userFaceGenRequestId: requestId ?? ""
  },
    {
      enabled: !!requestId
    }
  );

  console.log({ faceGenRequestImages, isLoading })
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isPhotoLoaded, setIsPhotoLoaded] = useState<boolean>(false);


  useEffect(() => {
    const hasValueResult = faceGenRequestImages && (faceGenRequestImages ?? []).length > 0;
    if (hasValueResult) {
      setSelectedImage(faceGenRequestImages[0]?.imageResult)
    }
  }, [isLoading, faceGenRequestImages]);

  const printImage = () => {
    setIsModalState(MODAL_STATE.PRINTING);
    const beforePrint = window.onbeforeprint;
    const afterPrint = window.onafterprint;

    window.onbeforeprint = () => {
      console.log("Print Dialog Opened");
      setIsModalState(MODAL_STATE.PRINTING);
    }
    window.onafterprint = () => {
      console.log("Print Dialog Closed");
      setIsModalState(MODAL_STATE.DONE_PRINTING);
    }

    window.print();

    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;
  };

  //useEffect animation for printing message
  function PrintingModal() {
    const [dots, setDots] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots + 1) % 4);
      }, 500);

      return () => clearInterval(interval);
    }, []);

    return (
      <Modal isOpen>
        <p className="font-button-base text-5xl uppercase text-white">
          Processing{".".repeat(dots)}
        </p>
      </Modal>
    );
  }//ends here

  const onCloseError = async () => {
    setIsModalState(MODAL_STATE.EMPTY)
    router.push("/")
  }

  useEffect(() => {
    if (!isLoading) {
      if ((faceGenRequestImages ?? []).length === 0) {
        setIsModalState(MODAL_STATE.UNKNOWN_ERROR);
      }
    }
  }, [
    isLoading, faceGenRequestImages
  ]);

  const {
    handleSubmit,
    register,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onBackMenuClick = () => {
    router.push("/");
  }

  const onSubmit: SubmitHandler<FormValues> = async ({ email }: FormValues) => {
    try {
      setIsSendingEmail(true);

      if (faceGenRequestImages?.[selectedImageIndex]) {
        await sendEmailMutation.mutateAsync({
          email,
          imageUrl: faceGenRequestImages[selectedImageIndex].imageResult,
          imageBase64: selectedImageWithFrame ?? ""
        });

        setIsModalState(MODAL_STATE.THANK_YOU);
      } else {
        setIsModalState(MODAL_STATE.UNKNOWN_ERROR);
      }
    } catch (error) {
      console.log(error);
      setIsModalState(MODAL_STATE.UNKNOWN_ERROR);
    }
    setIsSendingEmail(false);
  }


  const renderImages =
    (faceGenRequestImages ?? []).map((faceGenRequestImage, index) => (
      <Image
        key={faceGenRequestImage.id}
        src={faceGenRequestImage.imageResult}
        alt={`${faceGenRequestImage.id}`}
        className={`h-full w-[17vh] cursor-pointer border-8 border-[white] object-cover transition-all duration-200 ${selectedImage === faceGenRequestImage.imageResult ? " shadow-[0px_0px_30px_5px_rgba(66,255,0,0.8)]" : ""
          }`}
        width={300}
        height={576}
        onClick={() => {
          if (isPhotoLoaded) {
            setIsPhotoLoaded(false);
            setSelectedImage(faceGenRequestImage.imageResult);
            setSelectedImageIndex(index);
          }
        }
        }
      />
    ))

  const generateAnotherPhoto = () => {
    setIsModalState(MODAL_STATE.EMPTY);
    router.push("/take-a-selfie")
  }

  const renderModalState = () => {
    switch (modalState) {
      case MODAL_STATE.PRINTING:
        return <Modal isOpen>
          <PrintingModal />;
        </Modal>;
      case MODAL_STATE.DONE_PRINTING:
        return <Modal isOpen>
          <form onSubmit={handleSubmit(onSubmit)} className="z-10 flex flex-col items-center justify-center gap-2 text-white opacity-100 transition-all duration-300">
            <div className="mb-[0.6vh] text-4xl font-bold text-white">
              <div className="w-full text-center">
                <h2 className="font-button-base mb-[1vh] text-[2.5vh] uppercase text-[#FF0000]">DONE PRINTING</h2>
                <div className="font-text-base mb-[1.5vh] text-center text-[1.5vh] uppercase tracking-[.05em]">
                  <p>ENTER YOUR EMAIL BELOW TO SAVE A COPY</p>
                </div>
                <input
                  autoComplete="off"
                  type="text"
                  placeholder="Enter email"
                  className="font-text-base h-[3.5vh] w-full rounded-full border border-[#42FF00] bg-black p-3 
              text-center text-[1.5vh] uppercase text-white ring-0 placeholder:text-white focus:border-none focus:bg-[#02170F]
              focus:ring-[#42FF00] focus:placeholder:text-white/50"
                  {...register("email")}
                />
              </div>
            </div>
            <div className="mb-[1vh] mt-4 flex flex-col items-center">
              <SimpleButton
                onClick={handleSubmit(onSubmit)}
              >
                SEND
              </SimpleButton>
            </div>
            <div className="font-text-base mb-4 pt-1 text-center text-[1vh] uppercase tracking-[.1em]">
              <p className="text-white">
                Share your photo on your social media
              </p>
            </div>
          </form>
        </Modal>;
      case MODAL_STATE.UNKNOWN_ERROR:
        return <Modal isOpen>
          <div className="mb-2 text-center font-bold">
            <h1 className="font-button-base text-center text-[2.5vh] uppercase text-[#FF0000]">Oops! Something went wrong.</h1>
          </div>
          <div className="font-text-base my-5 w-[700px] pt-1 text-center text-[1.2vh] uppercase tracking-[.1em]">
            <p className="text-white">
              Please try again! If errors persist please come back later. For concerns, please email us at [EMAIL ADDRESS].
            </p>
          </div>
          <div className="mt-4 flex flex-col items-center gap-6">
            <SimpleButton
              onClick={onCloseError}
            >
              Back to main menu
            </SimpleButton>
          </div>
        </Modal>;
      case MODAL_STATE.THANK_YOU:
        return <Modal isOpen>
          <div className="mb-2 text-center font-bold">
            <h1 className="font-button-base text-center text-[2.5vh] uppercase text-white">THANK YOU!</h1>
          </div>
          <div className="mt-4 flex flex-col items-center gap-6">
            <SimpleButton
              onClick={generateAnotherPhoto}
            >
              GENERATE ANOTHER PHOTO
            </SimpleButton>
          </div>
          <div className="font-text-base my-5 pt-1 text-center text-[1.2vh] uppercase tracking-[.1em]">
            <p className="text-white">
              Share your photo on your social media
            </p>
          </div>
        </Modal>;
      default:
        return <></>
    }
  }

  const renderSkipButton = modalState === MODAL_STATE.DONE_PRINTING && <div className="absolute z-50">
    <SimpleButton
      onClick={() => {
        setIsModalState(MODAL_STATE.THANK_YOU)
      }}
    >
      Skip
    </SimpleButton>
  </div>

  const renderBackToMainMenuButton = modalState === MODAL_STATE.THANK_YOU && <div className="absolute z-50 ml-[-30px] w-[130%] justify-center">
    <SimpleButton
      onClick={onBackMenuClick}
    >
      BACK TO MAIN MENU
    </SimpleButton>
  </div>

  return (
    <div className={cn(
      "flex size-full lg:my-32 my-12 xl:my-12 flex-col items-center",
    )}>
      {selectedImage && faceGenRequestImages != null && <PhotoWithFrame onGenerateFrame={(imageBase64) => {
        setSelectedImageWithFrame(imageBase64);
      }} imageUrl={faceGenRequestImages[selectedImageIndex].imageResult} onStateChange={(state) => {
        if (state === PhotoWithFrameState.LOADED) {
          setIsPhotoLoaded(true);
        }
        console.log("Is photo loaded: " + isPhotoLoaded);
      }} />}
      {renderModalState()}
      <div className={cn("relative flex w-full h-max mb-12 flex-col items-center justify-start", (faceGenRequestImages ?? []).length <= 0 && "invisible")}>
        <div className="flex w-full justify-center">
          <div>
            {selectedImage && <Image
              src={selectedImage}
              alt="Selected selfie"
              className="size-[53vh] border-8 border-white object-cover"
              style={{ objectPosition: "10% 35%" }}
              width={300}
              height={600}
            />}
          </div>
        </div>

        <h2 className="my-4 text-[4vh] uppercase">
          <span className="text-[#42FF00]">Select</span> <span className="text-white">a photo</span>
        </h2>
        <div className="flex h-[20vh] w-full flex-row justify-center gap-4 object-cover">
          {renderImages}
        </div>
      </div>
      <div className={cn("relative flex flex-col h-1/6 w-full items-center", (faceGenRequestImages ?? []).length <= 0 && "invisible")}>
        <div className="relative flex justify-center gap-4 pb-16">
          {renderSkipButton}
          {renderBackToMainMenuButton}
          {imageUrlWithFrameData.imageUrlWithFrameState === PhotoWithFrameState.IS_LOADING ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : <SimpleButton
            onClick={() => printImage()}
          >
            Print
          </SimpleButton>}
        </div>
      </div>
    </div>
  );
}
