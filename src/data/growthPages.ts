import { pageByPath, seoPages } from "./seoContent.mjs";

export type GrowthPage = {
  path: string;
  group: string;
  eyebrow: string;
  title: string;
  description: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
  bullets: string[];
};

export { seoPages };

export const growthPagesByPath = pageByPath as Record<string, GrowthPage>;
