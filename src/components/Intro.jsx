import '../styles/Intro.css';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import AsciiPortrait from './AsciiPortrait';

export default function Intro({ section, profile }) {
  return (
    <section id={section.id} className="intro" aria-labelledby={`${section.id}-title`}>
      <figure className="intro-simulation">
        <AsciiPortrait src={section.portrait.src} alt={section.portrait.alt} />
        {section.portrait.isPlaceholder && <figcaption>Your portrait goes here</figcaption>}
      </figure>
      <div className="intro-block">
        <h1 id={`${section.id}-title`} className="intro-title">
          hi, <span className="intro-name">{profile.firstName.toLowerCase()}</span> here.
          <span className="intro-cursor" aria-hidden="true">
            |
          </span>
        </h1>
        <p className="intro-desc">{section.description}</p>
        <a href={`mailto:${profile.email}`} className="intro-contact">
          <EmailRoundedIcon aria-hidden="true" /> Contact
        </a>
      </div>
    </section>
  );
}
