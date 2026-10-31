import "../styles/About.css";
import Section from "./Section";

export default function About({ section }) {
  return (
    <Section section={section}>
      <div className="about-content">
        <div className="about-description">
          {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          {section.technologies?.length > 0 && <>
            <p>{section.technologyIntro}</p>
            <ul className="tech-stack">
              {section.technologies.map((technology) => <li key={technology}>{technology}</li>)}
            </ul>
          </>}
        </div>
        {section.photo?.src && <figure className={`about-image${section.photo.isPlaceholder ? " is-placeholder" : ""}`}>
          <img src={section.photo.src} alt={section.photo.alt} loading="lazy" width="280" height="320" />
          {section.photo.isPlaceholder && <figcaption>Your photo goes here</figcaption>}
        </figure>}
      </div>
    </Section>
  );
}
