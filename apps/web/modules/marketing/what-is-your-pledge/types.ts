import { StaticImport } from "next/dist/shared/lib/get-img-props";
import type { ReactNode } from "react";

export type PlegeItemType = {
	topText: string;
  img?: StaticImport | string;
  bottomText: string;
  onClick?: (value: string) => void;
  selected?: boolean;
};