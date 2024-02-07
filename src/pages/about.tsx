import Layout from '@/components/Layout/layout';
import Hero from '@/components/Hero/hero';

const heroProps = {
  title: "This is the about page."
};

export default function About() {
  return (
    <Layout>
      <Hero { ...heroProps } />
    </Layout>
  );
};

export { Head } from "@/components/Head/head";
