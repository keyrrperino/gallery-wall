'use client';
import Image from "next/image";

import { Button } from "@ui/components/button";
import {
	ArrowRightIcon,
	CloudIcon,
	MousePointerIcon,
	PaperclipIcon,
	PhoneIcon,
	StarIcon,
	UploadIcon,
} from "lucide-react";
import SeawallSticker from "../../../../public/images/stickers/seawall-sticker.svg";
import ZygodactylousSticker from "../../../../public/images/stickers/zygodactylous-sticker.svg";
import MangroveSticker from "../../../../public/images/stickers/mangrove-sticker.svg";
import CenterImage from "../../../../public/images/dummy/WhatsApp Image.png";
import { useRouter } from "next/navigation";

export function Section() {
	const router = useRouter();

	return (
		<section className="py-24 text-card-foreground">
			<div className="container">
				{/* Section header */}
				<div className="text-center">
					<h1 className="font-bold text-4xl lg:text-5xl">
						PLEDGE WALL TITLE HERE
					</h1>
					<p className="mt-3 text-foreground/60 text-lg">
					Lorem ipsum dolor sit amet consectetur. Est pharetra morbi in amet id. In diam faucibus viverra quam. Amet felis leo venenatis augue quis blandit. Ut consectetur senectus eget scelerisque nec
					</p>
				</div>

				<div className="mt-12 grid grid-cols-1 gap-8">
					{/* Feature 1 */}
					<div className="grid items-center gap-8 p-8 lg:grid-cols-2 lg:gap-16">
						<div className="overflow-hidden rounded-xl p-12 flex items-center justify-center">
							<Image
								src={ZygodactylousSticker}
								alt="Sticker 1"
								width={100}
							/>
							<Image
								src={SeawallSticker}
								alt="Sticker 2"
								width={100}
							/>
							<Image
								src={MangroveSticker}
								alt="Sitcker 3"
								width={100}
							/>
						</div>

						<div className="flex items-center justify-center">
							<Button variant="secondary" size="sm" className="mt-4 bg-[#7EC7FF]" onClick={() => router.push("/how-do-you-feel")}>
								LET'S GO
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
