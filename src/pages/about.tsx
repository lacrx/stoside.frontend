import Layout from '@/components/Layout/layout';
import Hero from '@/components/Hero/hero';
import Content from '@/components/Content/content';

const heroProps = {
  title: "About Us",
  style: { borderBottom: "none", paddingBottom: "1.5rem" },
};

export default function About() {
  return (
    <Layout>
      <Hero { ...heroProps } />
      <Content type="section">
        <p>
          We are a network of groups devoted to making North County an affordable,
          equitable, thriving community. Look through our{" "}
          <a href="https://www.meetup.com/north-county-urbanists/">events</a>. We
          have active groups for Oceanside, Encinitas, Poway and Temecula so far.
          All are welcome.
        </p>
        <p>
          If you're interested in starting a group for your own city, shoot us a
          message and we'll help start one. We can host your events on the main
          North County Org page.
        </p>
        <p>
          We started out as an Oceanside Strong Towns group, but it has exploded,
          so we're expanding to fit urbanism in all of North County. If our socials
          still show ST content, that's why. If you want to run the North County
          Urbanists social media, let us know!
        </p>
        <p>
          <a href="https://discord.com/invite/sraXTxwC3P">Join our Discord!</a>
        </p>
        <p>
          <a href="https://www.meetup.com/north-county-urbanists/">Check out our Meetup page</a>
        </p>
      </Content>
    </Layout>
  );
};

export { Head } from "@/components/Head/head";
