import Layout from '@/components/Layout/layout';
import Hero from '@/components/Hero/hero';

const heroProps = {
  title: "Coming soon.",
  description: "We're still integrating the MeetUp API.",
  style: { paddingBottom: "4rem" }
};

export default function Events() {
  return (
    <Layout>
      <Hero { ...heroProps } />
    </Layout>
  );
};

export { Head } from "@/components/Head/head";
