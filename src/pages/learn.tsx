import Layout from '@/components/Layout/layout';
import Hero from '@/components/Hero/hero';
import Content from "@/components/Content/content";
import Map from '@/components/Map/map';

const heroProps = {
  title: "Our Wealth is Downtown.",
};

const contentProps = {
  type: "section"
}

export default function Learn() {
  return (
    <Layout>
      <Hero { ...heroProps } />
      <Content { ...contentProps } >
        <p>Downtown subsidizes the rest of Oceanside. We'd love to show you why with our interactive map. You're looking at the value-per-acre for every piece of land in Oceanside. Like a compressed gem, downtown's value is great despite its small footprint. This map shows us where Oceanside has made its best investments as a city, and who contributes most to its coffers.</p>
        <Map />
        <p>Suburban tax base is an oxymoron. We have spent generations laying intense infrastructure eastward to attract growth. But outward growth doesn't pay. And it's not sustainable. The city makes money from the coast and downtown. So we should treat them with respect. We need to begin making investments in our downtown again. Main Street Oceanside has never forgotten about our untapped yearning to be with each other downtown.</p>
        <p>We need to make downtown a pleasant place to be outside of a car. A four-lane arterial is no way to treat ourselves. We can do better. By fixing sidewalks and building benches, we're doing it.</p>
      </Content>
    </Layout>
  );
};

export { Head } from "@/components/Head/head";
