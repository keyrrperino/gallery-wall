import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
export function BackButton() {
  const router = useRouter();
  return (
    <button
      className="p-2 rounded-full hover:bg-gray-100 transition"
      onClick={() => router.back()}
      aria-label="Back"
    >
      <ChevronLeft size={24} />
    </button>
  );
}