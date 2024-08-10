import { env } from "@/env";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Inputs",
  description: "Collection of input fields built with shadcn-ui and radix-ui.",
  url:
    env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://inputs.sadmn.com",
  links: { github: "https://github.com/sadmann7/inputs" },
};
