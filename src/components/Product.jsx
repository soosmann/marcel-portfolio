import Section from './Section';
import '../styles/Product.css';

export default function Product({ section, profile }) {
  return (
    <Section section={section}>
      <div className="products-list">
        {section.items.map((product) => (
          <article className="product-showcase" key={product.id}>
            <div className="product-description">
              {product.status && (
                <span className="product-status">
                  <span aria-hidden="true" />
                  {product.status}
                </span>
              )}
              <h3 className="product-name">{product.name}</h3>
              <p className="product-tagline">{product.tagline}</p>
              <p className="product-summary">{product.description}</p>
              {product.features?.length > 0 && (
                <dl className="product-features">
                  {product.features.map((feature) => (
                    <div key={feature.title}>
                      <dt>{feature.title}</dt>
                      <dd>{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {product.technologies?.length > 0 && (
                <ul className="project-technologies" aria-label={`${product.name} technologies`}>
                  {product.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              )}
              <div className="product-links">
                {product.links
                  ?.filter((link) => link.url)
                  .map((link) => (
                    <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.label} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                {product.contactLabel && (
                  <a
                    className="intro-contact"
                    href={`mailto:${profile.email}?subject=${encodeURIComponent(product.name)}`}
                  >
                    {product.contactLabel} <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>
            {product.screenshot?.src && (
              <figure className="product-preview">
                <div className="product-phone">
                  <div className="phone-speaker" aria-hidden="true" />
                  <img
                    src={product.screenshot.src}
                    alt={product.screenshot.alt}
                    loading="lazy"
                    width="280"
                    height="560"
                  />
                  <div className="phone-home-indicator" aria-hidden="true" />
                </div>
                {product.screenshot.isPlaceholder && (
                  <figcaption>App screenshot placeholder</figcaption>
                )}
              </figure>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
