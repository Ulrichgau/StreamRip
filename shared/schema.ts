import { z } from "zod";

export const extractMp3Schema = z.object({
  url: z.string().url("Must be a valid URL"),
});

export type ExtractMp3Request = z.infer<typeof extractMp3Schema>;

export interface Mp3Result {
  id: string;
  filename: string;
  url: string;
  source: string;
}

export interface ExtractMp3Response {
  results: Mp3Result[];
  sourceUrl: string;
}
