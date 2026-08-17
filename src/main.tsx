import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { portfolio } from "./content/portfolio";

document.title = portfolio.seoTitle;

const metaDescription = document.querySelector('meta[name="description"]');
if (metaDescription) {
  metaDescription.setAttribute("content", portfolio.seoDescription);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
