import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  openGraph?: {
    title: string;
    description: string;
    url: string;
    type: string;
    image?: string;
    site_name: string;
  };
  structured?: object;
  noindex?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonical,
  openGraph,
  structured,
  noindex = false
}) => {
  return (
    <Helmet>
      {/* Titre de la page */}
      <title>{title}</title>
      
      {/* Meta descriptions */}
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* URL canonique */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph pour réseaux sociaux */}
      {openGraph && (
        <>
          <meta property="og:title" content={openGraph.title} />
          <meta property="og:description" content={openGraph.description} />
          <meta property="og:url" content={openGraph.url} />
          <meta property="og:type" content={openGraph.type} />
          <meta property="og:site_name" content={openGraph.site_name} />
          {openGraph.image && <meta property="og:image" content={openGraph.image} />}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {openGraph && (
        <>
          <meta name="twitter:title" content={openGraph.title} />
          <meta name="twitter:description" content={openGraph.description} />
          {openGraph.image && <meta name="twitter:image" content={openGraph.image} />}
        </>
      )}
      
      {/* Données structurées JSON-LD */}
      {structured && (
        <script type="application/ld+json">
          {JSON.stringify(structured)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead; 