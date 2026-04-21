import { lazy, Suspense } from "react";
import { graphql, useStaticQuery } from "gatsby";
import * as styles from "./article-blocks.module.css";

const Choropleth3DMaplibre = lazy(
  () => import("@/components/viz/choropleth-3d-maplibre")
);

const RENDERERS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  "choropleth-3d-maplibre": Choropleth3DMaplibre,
};

type VisualizationBlockProps = {
  vizId: string;
  caption?: string | null;
  height: number;
  align: string;
};

export type GatsbyVisualization = {
  vizId: string;
  type: string;
  title: string | null;
  source: string | null;
  featuresFile: { publicURL: string | null } | null;
  featuresTilesFile: { publicURL: string | null } | null;
  posterFile: { publicURL: string | null } | null;
  posterFileMobile: { publicURL: string | null } | null;
  tilesLayer: string | null;
  camera: { center: number[]; zoom: number | null; pitch: number | null; bearing: number | null } | null;
  color: { field: string; domain: number[]; range: string[] } | null;
  elevation: { field: string; divisor: number | null } | null;
  fallback2d: { maxViewportWidth: number | null } | null;
};

type Query = {
  allGatsbyVisualization: { nodes: GatsbyVisualization[] };
};

export default function VisualizationBlock({ vizId, caption, height, align }: VisualizationBlockProps) {
  const { allGatsbyVisualization } = useStaticQuery<Query>(graphql`
    query AllGatsbyVisualization {
      allGatsbyVisualization {
        nodes {
          vizId
          type
          title
          source
          featuresFile { publicURL }
          featuresTilesFile { publicURL }
          posterFile { publicURL }
          posterFileMobile { publicURL }
          tilesLayer
          camera { center zoom pitch bearing }
          color { field domain range }
          elevation { field divisor }
          fallback2d { maxViewportWidth }
        }
      }
    }
  `);

  const artifact = allGatsbyVisualization.nodes.find(v => v.vizId === vizId);
  const alignClass =
    align === "full-bleed" ? styles.fullBleed : align === "wide" ? styles.wide : styles.inline;

  if (!artifact) {
    return (
      <figure className={`${styles.vizFigure} ${alignClass}`}>
        <div className={styles.vizMissing}>Missing visualization: <code>{vizId}</code></div>
      </figure>
    );
  }

  const Renderer = RENDERERS[artifact.type];
  if (!Renderer) {
    return (
      <figure className={`${styles.vizFigure} ${alignClass}`}>
        <div className={styles.vizMissing}>
          No renderer registered for type <code>{artifact.type}</code> (viz <code>{vizId}</code>)
        </div>
      </figure>
    );
  }

  const posterUrl = artifact.posterFile?.publicURL ?? null;
  const posterUrlMobile = artifact.posterFileMobile?.publicURL ?? null;

  return (
    <figure className={`${styles.vizFigure} ${alignClass}`}>
      <div className={styles.vizStage} style={{ height }}>
        {posterUrl && (
          <picture className={styles.vizPoster}>
            {posterUrlMobile && (
              <source media="(max-width: 768px)" srcSet={posterUrlMobile} />
            )}
            <img
              src={posterUrl}
              alt={artifact.title ?? artifact.vizId}
              className={styles.vizPoster}
              loading="lazy"
              decoding="async"
            />
          </picture>
        )}
        <Suspense fallback={<div className={styles.vizPosterFill} />}>
          <Renderer artifact={artifact} height={height} />
        </Suspense>
        <div className={styles.vizLoader} aria-hidden="true">
          <span>&bull;</span><span>&bull;</span><span>&bull;</span>
        </div>
      </div>
      {(caption || artifact.source) && (
        <figcaption className={styles.vizCaption}>
          {caption && <span>{caption}</span>}
          {caption && artifact.source && <span> &middot; </span>}
          {artifact.source && <span>Source: {artifact.source}</span>}
        </figcaption>
      )}
    </figure>
  );
}
