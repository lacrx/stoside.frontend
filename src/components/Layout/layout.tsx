import type { PropsWithChildren } from "react";
import Nav from "@/components/Nav/nav";
import Footer from "@/components/Footer/footer";
import SignupForm from "@/components/SignupForm/signup-form";
import { signup } from "./layout.module.css";
import '@/styles/reset.module.css';
import '@/styles/global.module.css';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <main>
      <Nav />
      { children }
      <div>
        <section className={signup}>
          <p>Stay in the loop on what's happening in Oceanside.</p>
          <SignupForm placeholder="Your email" buttonText="Subscribe" />
        </section>
        <Footer />
      </div>
    </main>
  );
};
