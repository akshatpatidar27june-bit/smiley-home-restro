import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminPanel from "./admin/AdminPanel";
import DecorationGallery from "./admin/DecorationGallery";
import GalleryLightbox from "./GalleryLightbox";
import "./index.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

const queryClient = new QueryClient();
const isAdminRoute = window.location.pathname.replace(/\/+$/, "") === "/admin";

function PublicApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <App />
        <DecorationGallery />
        <GalleryLightbox />
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  isAdminRoute ? <AdminPanel /> : <PublicApp />,
);
