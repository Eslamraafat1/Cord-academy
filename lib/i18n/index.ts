import type { Locale } from "@/types";
import { ar } from "./ar";
import { en, type Dict } from "./en";

export * from "./format";
export type { Dict };

/** Server-only entry: importing this from a Client Component would ship both dictionaries. */
const dictionaries: Record<Locale, Dict> = { ar, en };
export const getDictionary = (l: Locale): Dict => dictionaries[l];
