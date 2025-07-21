"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cross2Icon } from "@radix-ui/react-icons";
import ConfirmExitModal from "./ConfirmExitModal";

export default function ExitButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleConfirm = () => {
    setOpen(false);
    router.push("/");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 hover:opacity-70 transition"
        aria-label="Exit"
      >
        <Cross2Icon color="black" className="w-8 h-8 md:w-[3vw] md:h-[3vw]" />
      </button>

      {open && (
        <ConfirmExitModal
          onCancel={() => setOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
