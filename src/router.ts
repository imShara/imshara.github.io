export {};

import "vue-router";

declare module "vue-router" {
  interface FrontmatterData {
    title: string;
    description: string;
  }

  interface RouteMeta {
    frontmatter?: FrontmatterData;
    date?: string;
  }
}
