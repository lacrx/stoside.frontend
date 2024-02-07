import { ReactNode } from "react";
import Nav from "@/components/Nav/nav";
import Footer from "@/components/Footer/footer";
import '@/styles/reset.module.css';
import '@/styles/global.module.css';

type PropsWithChildren<P = unknown> = P & { children: ReactNode };

export default function Layout({ children }: PropsWithChildren) {
  return (
    <main>
      <Nav />
      { children }
      <Footer />
    </main>
  );
};
