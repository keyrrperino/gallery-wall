import { StaticImport } from "next/dist/shared/lib/get-img-props";

export type PlegeItemType = {
	topText: string;
  img?: StaticImport | string;
  bottomText: string;
  onClick?: (value: string) => void;
  selected?: boolean;
};