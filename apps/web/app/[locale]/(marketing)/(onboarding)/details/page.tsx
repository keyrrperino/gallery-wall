/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { FEMALE, MALE } from "utils";
import { z } from "zod";
import "../../../globals.css";

import SimpleButton from "../../../../../modules/marketing/home/components/Button";
import FairUsePopup from "../../../../../modules/marketing/home/components/Popups/FairUse";
import PrivatePolicyPopup from "../../../../../modules/marketing/home/components/Popups/PrivatePolicy";
import TermsConditionsPopup from "../../../../../modules/marketing/home/components/Popups/TermsConditions";

import ErrorPopup from "@marketing/home/components/Popups/Error";
import { useUser } from "@saas/auth/hooks/use-user";
import { UserContextProvider } from "@saas/auth/lib/user-context";
import { apiClient } from "@shared/lib/api-client";

const formSchema = z.object({
  gender: z.enum([MALE, FEMALE]),
  name: z.string().min(3),
  agree: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function StepThree() {
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(false);
  const [showFairUsePopup, setShowFairUsePopup] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [showPrivatePopup, setShowPrivatePopup] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { user: sessionuser, updateUser: updateSessionUser } = useUser();
  console.log({ sessionuser })

  const {
    handleSubmit,
    register,
    formState: { isValid },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const createUser = apiClient.auth.createUser.useMutation();

  const watchAgree = watch("agree");

  const onClickProceed = async ({ name, gender, agree }: FormValues) => {
    setIsSaving(true);
    try {
      const createdUser = await createUser.mutateAsync({
        name,
        gender,
        isEighteenAndAbove: agree
      });

      updateSessionUser({
        name,
        gender,
        isEighteenAndAbove: agree
      })

      const isUserUpdated = createdUser?.name === name && createdUser?.gender === gender && createdUser.isEighteenAndAbove === agree;

      if (!isUserUpdated) {
        setHasError(true)
      }

      setIsVisible(false);

      setTimeout(() => {
        router.push(
          "/take-a-selfie");
      }, 500);
    } catch (error) {
      console.log(error);
      setHasError(true);
    }

    setIsSaving(false);
  };

  const onSubmit: SubmitHandler<FormValues> = async ({ gender, name, agree }: FormValues) => {
    try {
      await onClickProceed({ gender, name, agree });
    } catch {
      setHasError(true)
    }
  };

  const openFairUsePopup = () => setShowFairUsePopup(true);
  const closeFairUsePopup = () =>
    setTimeout(() => {
      setShowFairUsePopup(false);
    }, 100);


  const openTermsPopup = () => setShowTermsPopup(true);
  const closeTermsPopup = () =>
    setTimeout(() => {
      setShowTermsPopup(false);
    }, 100);

  const openPrivatePopup = () => setShowPrivatePopup(true);
  const closePrivatePopup = () =>
    setTimeout(() => {
      setShowPrivatePopup(false);
    }, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [])

  const onCloseError = async () => {
    console.log("onCloseError");
  }

  const errorMessage = hasError && <ErrorPopup onClose={onCloseError} />;
  return (

    <UserContextProvider initialUser={sessionuser}>
      {errorMessage}
      <div className="relative h-full">
        {showFairUsePopup && <FairUsePopup onClose={closeFairUsePopup} />}
        {showTermsPopup && <TermsConditionsPopup onClose={closeTermsPopup} />}
        {showPrivatePopup && <PrivatePolicyPopup onClose={closePrivatePopup} />}

        <form onSubmit={handleSubmit(onSubmit)} className={`z-10 mt-[-1vh] flex h-full flex-col items-center justify-center gap-2 text-white transition-all duration-300 ${isVisible ? " opacity-100" : " opacity-0"}`}>
          <div className={`font-text-base mt-[2.5vh] text-center text-[1.8vh] font-bold uppercase tracking-[.2em] transition-all focus:outline-none xl:text-xl ${isVisible ? "scale-100" : "scale-125"}`}>
            <p>Start your epic night here</p>
          </div>

          <div className="mt-[2.5vh] flex  w-full max-w-[700px] flex-col gap-7">
            <input
              autoComplete="off"
              type="text"
              placeholder=""
              className="font-button-base h-[5.5vh] w-full rounded-full border-2 border-[#42FF00] bg-transparent p-3 text-center 
              text-[1.9vh] uppercase text-white ring-0 placeholder:text-white focus:border-none focus:bg-[rgb(2,23,15)] focus:ring-[#42FF00] focus:placeholder:text-white/50"
              {...register("name")}
            />
            <div className="font-text-base text-center text-[1.5vh] font-semibold tracking-[.1em]">
              <p>NAME</p>
            </div>

            <select
              className="font-button-base h-[5.5vh] w-full rounded-full border-2 border-[#42FF00] bg-transparent p-1 text-center 
              text-[1.9vh] uppercase text-white ring-0 focus:border-none focus:bg-[#02170F] focus:ring-[#42FF00]"
              {...register("gender")}
            >
              <option className="text-sm" value=""></option>
              <option className="text-sm " value={MALE}>Male</option>
              <option className="text-sm" value={FEMALE}>Female</option>
            </select>
            <div className="font-text-base text-center text-[1.5vh] font-semibold tracking-[.1em]">
              <p>GENDER IDENTITY</p>
            </div>
          </div>
          <div className="z-10 mb-[3.5vh] mt-[2vh] flex w-full justify-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agree"
                className="mr-8 size-12 rounded border-[#42FF00] bg-black/0 text-[#42FF00] accent-black 
                outline-none ring-0
                focus:border-none focus:outline-none focus:ring-[#42FF00] focus:ring-offset-0 
                active:border-none active:outline-[#42FF00] active:ring-[#42FF00] xl:size-6"
                {...register("agree")}
              />
              <label htmlFor="agree" className="font-text-base text-[1vh] uppercase tracking-[.1em] xl:text-xl">
                I agree to the Fair use of&nbsp;
                <a href="#private_policy" onClick={openPrivatePopup} className="text-[#42FF00] underline">Privacy policy</a>, &nbsp;
                <a href="#terms_and_conditions" onClick={openTermsPopup} className="text-[#42FF00] underline">Terms and conditions</a>.
                <a href="#fair_use_policy" onClick={openFairUsePopup} className="hidden text-[#42FF00] underline">Fair use policy</a>
              </label>
            </div>
          </div>

          <SimpleButton
            onClick={handleSubmit(onSubmit)}
          >
            PROCEED
          </SimpleButton>
        </form>

      </div>
    </UserContextProvider>
  );
}
