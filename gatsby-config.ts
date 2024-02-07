import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
    jsxRuntime: "automatic",
    plugins: [
      "gatsby-plugin-image",
      "gatsby-plugin-sharp",
      "gatsby-transformer-sharp",
      {
        resolve: "gatsby-source-filesystem",
        options: {
          name: "images",
          path: `${__dirname}/src/assets/images/`,
        },
      },
      {
        resolve: "gatsby-source-filesystem",
        options: {
          name: "data",
          path: `${__dirname}/src/assets/data/`,
        },
      },
      {
        resolve: "gatsby-plugin-manifest",
        options: {
          icon: `${__dirname}/src/assets/images/favicon.png`,
        }
      }
    ],
    siteMetadata: {
      title: "Strong Towns Oceanside",
    }
};

export default config;
