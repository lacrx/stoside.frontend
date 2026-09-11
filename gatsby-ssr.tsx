import React from "react";
import type { GatsbySSR } from "gatsby";
import { AuthProvider } from "./src/components/Auth/auth-context";

export const onRenderBody: GatsbySSR["onRenderBody"] = ({ setHtmlAttributes }) => {
  setHtmlAttributes({ lang: "en" });
};

export const wrapRootElement: GatsbySSR["wrapRootElement"] = ({ element }) => (
  <AuthProvider>{element}</AuthProvider>
);
