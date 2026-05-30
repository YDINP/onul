import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "오늘의 한 판",
    short_name: "오늘의 한 판",
    description: "하루 한 판, 한국어 추리 게임",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0d0d",
    theme_color: "#0d0d0d",
    lang: "ko",
    icons: [
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
