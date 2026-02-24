import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// const manifestForPlugIn = {
//   registerType: "autoUpdate",
//   workbox: {
//     maximumFileSizeToCacheInBytes: 30 * 1024 * 1024, // 30 MB
//   },
//   includeAssests: ["favicon.ico", "apple-touch-icon.png", "maskable-icon.png"],
//   manifest: {
//     name: "Paisa Udhar",
//     short_name: "PU",
//     description: "Paisa Udhar",
//     icons: [
//       {
//         src: "Images/android-chrome-192x192.png",
//         sizes: "192x192",
//         type: "image/png",
//         purpose: "any",
//       },
//       {
//         src: "Images/android-chrome-512x512.png",
//         sizes: "512x512",
//         type: "image/png",
//         purpose: "any",
//       },
//       {
//         src: "Images/apple-touch-icon.png",
//         sizes: "180x180",
//         type: "image/png",
//         purpose: "any",
//       },
//       {
//         src: "Images/maskable-icon.png",
//         sizes: "512x512",
//         type: "image/png",
//         purpose: "any maskable",
//       },
//     ],
//     theme_color: "#003397",
//     background_color: "#dbe3f0",
//     display: "standalone",
//     scope: "/",
//     start_url: "/?source=pwa",
//     orientation: "portrait",
//   },
//   // devOptions: {
//   //   enabled: true,   // to enables PWA in dev
//   // },
// };

const manifestForPlugIn = {
  registerType: "autoUpdate",
  workbox: {
    maximumFileSizeToCacheInBytes: 30 * 1024 * 1024,
  },
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "maskable-icon.png"],
  // devOptions: {
  //   enabled: true, // to enables PWA in dev
  // },
  manifest: {
    id: "/",
    name: "Paisa Udhar",
    short_name: "PU",
    description: "Paisa Udhar",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#dbe3f0",
    theme_color: "#003397",
    orientation: "portrait",
    icons: [
      {
        src: "/Images/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/Images/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/Images/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/Images/maskable-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
});
