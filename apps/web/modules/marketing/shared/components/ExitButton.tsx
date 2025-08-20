"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ConfirmExitModal from "./ConfirmExitModal";
import { XIcon } from "lucide-react";
import { Button } from "@ui/components/button";

export default function ExitButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const noRemoveBackground = searchParams.get("noRemoveBackground");
  const additionUrl = noRemoveBackground
    ? `?noRemoveBackground=${noRemoveBackground}`
    : "";

  const handleConfirm = () => {
    setOpen(false);
    router.push("/" + additionUrl);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="hover:opacity-70 transition"
        aria-label="Exit"
        asChild
      >
        <XIcon color="black" className="w-12 h-12" strokeWidth={4} />
      </Button>

      {open && (
        <ConfirmExitModal
          onCancel={() => setOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
