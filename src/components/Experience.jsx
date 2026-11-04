import JobList from './JobList';
import Section from './Section';
import '../styles/Experience.css';

export default function Experience({ section }) {
  return (
    <Section section={section}>
      <JobList items={section.items} sectionId={section.id} />
    </Section>
  );
}
