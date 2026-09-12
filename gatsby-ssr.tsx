import type { GatsbySSR } from "gatsby";
import { AuthProvider } from "./src/components/Auth/auth-context";

export const onRenderBody: GatsbySSR["onRenderBody"] = ({
  setHtmlAttributes,
  setHeadComponents,
}) => {
  setHtmlAttributes({ lang: "en" });
  setHeadComponents([
    <script
      key="auth-class"
      dangerouslySetInnerHTML={{
        __html: `try{if(localStorage.getItem('sto_admin')==='true')document.documentElement.classList.add('authed')}catch(e){}`,
      }}
    />,
  ]);
};

export const wrapRootElement: GatsbySSR["wrapRootElement"] = ({ element }) => (
  <AuthProvider>{element}</AuthProvider>
);
