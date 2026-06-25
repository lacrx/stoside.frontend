import type { PropsWithChildren } from "react";
import Nav from "@/components/Nav/nav";
import Footer from "@/components/Footer/footer";
import '@/styles/reset.module.css';
import '@/styles/global.module.css';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <main>
      <Nav />
      { children }
      <Footer />
    </main>
  );
};
