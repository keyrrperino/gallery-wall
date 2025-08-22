import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
export function BackButton() {
  const router = useRouter();
  return (
    <button
      className="rounded-full p-2 transition hover:bg-gray-100"
      onClick={() => router.back()}
      aria-label="Back"
    >
      <ChevronLeft size={24} />
    </button>
  );
}
