import FadeInSection from "./FadeInSection";

export default function Section({ section, children }) {
  return (
    <section id={section.id} className="portfolio-section" aria-labelledby={`${section.id}-title`}>
      <FadeInSection>
        <div className="section-header">
          <h2 id={`${section.id}-title`} className="section-title">/ {section.title}</h2>
        </div>
        {children}
      </FadeInSection>
    </section>
  );
}
