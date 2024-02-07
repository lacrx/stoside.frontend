import { useEffect } from 'react';
import { graphql, useStaticQuery } from "gatsby";
import { Loader } from "@googlemaps/js-api-loader";
import { GoogleMapsOverlay } from "@deck.gl/google-maps/typed";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
import { Feature } from "geojson";
import { scaleThreshold } from 'd3-scale';
import { Color } from '@deck.gl/core/typed';
import { map } from './map.module.css';

const geojsonQuery = graphql`
  query geojsonQuery {
    file(name: {eq: "analysis"}) {
      publicURL
    }
  }
`;

const COLORS = [
  [156, 156, 156],
  [46, 103, 62],
  [72, 151, 87],
  [122, 188, 108],
  [180, 214, 124],
  [223, 239, 152],
  [254, 255, 202],
  [248, 225, 151],
  [242, 176, 109],
  [228, 116, 78],
  [199, 61, 51],
  [151, 31, 41],
  [155, 29, 224]
];

export const COLOR_SCALE = scaleThreshold<number, number[]>()
.domain([0, 1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 10000000, 20000000, 30000000])
.range(COLORS);

const loader = new Loader({
  apiKey: "AIzaSyAj7VtuA1hFQnpt3zRFRClkLOtBmrvM77Q",
  version: "weekly",
});

export default function Map() {
  const { file: { publicURL } } = useStaticQuery(geojsonQuery);

  useEffect(() => {
    loader.load().then(async google => {
      const { Map } = await google.maps.importLibrary("maps");
      const map = new Map(document.getElementById("map"), {
        center: { lat: 33.21, lng: -117.32 },
        zoom: 12,
        heading: 310,
        tilt: 47.5,
        gestureHandling: "cooperative",
        mapId: "4d4c59d9795e9dae",
      });

      const buttons = [
        ["Rotate Left", "rotate", 20, google.maps.ControlPosition.LEFT_CENTER],
        ["Rotate Right", "rotate", -20, google.maps.ControlPosition.RIGHT_CENTER],
        ["Tilt Down", "tilt", 20, google.maps.ControlPosition.TOP_CENTER],
        ["Tilt Up", "tilt", -20, google.maps.ControlPosition.BOTTOM_CENTER],
      ];

      buttons.forEach(([text, mode, amount, position]) => {
        const controlDiv = document.createElement("div");
        const controlUI = document.createElement("button");

        controlUI.classList.add("ui-button");
        controlUI.innerText = `${text}`;
        controlUI.addEventListener("click", () => {
          adjustMap(mode, amount);
        });
        controlDiv.appendChild(controlUI);
        map.controls[position].push(controlDiv);
      });

      const adjustMap = function (mode: string, amount: number) {
        switch (mode) {
          case "tilt":
            map.setTilt(map.getTilt() + amount);
            break;
          case "rotate":
            map.setHeading(map.getHeading() + amount);
            break;
          default:
            break;
        }
      };

      const overlay = new GoogleMapsOverlay({
        layers: [ new GeoJsonLayer<{}>({
          id: "geojson-layer",
          data: await fetch(publicURL).then(response => response.json()),
          stroked: false,
          filled: true,
          extruded: true,
          pointType: "circle",
          lineWidthScale: 20,
          lineWidthMinPixels: 4,
          opacity: .6,
          getElevation: (feature: Feature) => feature?.properties?.vpa / 10000,
          getFillColor: (feature: Feature) => COLOR_SCALE(feature?.properties?.vpa) as Color,
          getPointRadius: 200,
          getLineWidth: 1,
        })]
      });

      overlay.setMap(map);
    });
  });

  return (
    <section className={ map }>
      <figure id="map" />
      <figcaption>
        <span>Data is from 2023 and shows the value-per-acre of every parcel in Oceanside.</span>
        <span>SOURCE: Regrid's Data with Purpose Program</span>
      </figcaption>
    </section>
  );
}
