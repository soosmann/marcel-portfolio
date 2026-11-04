import { useMediaQuery } from '@mui/material';
import { useEffect, useRef } from 'react';
import { Carousel } from 'react-bootstrap';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import Section from './Section';
import ExternalLinks from './ExternalLinks';
import '../styles/Projects.css';

function ProjectVideo({ video, title, poster }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const element = videoRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) element.pause();
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      element.pause();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={video.src}
      poster={video.poster || poster}
      controls
      playsInline
      preload="metadata"
      aria-label={video.alt || `${title} demo video`}
    >
      {video.captions?.src && (
        <track
          kind="captions"
          src={video.captions.src}
          srcLang={video.captions.language || 'en'}
          label={video.captions.label || 'English'}
          default
        />
      )}
      Your browser does not support embedded video. <a href={video.src}>Download video</a>.
    </video>
  );
}

function ProjectCard({ project, sectionIds, featured = false }) {
  const url =
    project.url?.startsWith('#') && !sectionIds.includes(project.url.slice(1)) ? '' : project.url;

  return (
    <article className={`projects-card${featured ? ' featured-project' : ''}`}>
      {featured && (
        <figure className="project-image">
          {project.video?.src ? (
            <ProjectVideo video={project.video} title={project.title} poster={project.image?.src} />
          ) : (
            <img
              src={project.image.src}
              alt={project.image.alt || project.title}
              loading="lazy"
              width="800"
              height="600"
            />
          )}
          {!project.video?.src && project.image?.isPlaceholder && (
            <figcaption>Project image placeholder</figcaption>
          )}
        </figure>
      )}
      <div className="project-details">
        <div className="project-card-header">
          <FolderOpenRoundedIcon className="folder-icon" sx={{ fontSize: 35 }} aria-hidden="true" />
          <ExternalLinks githubLink={project.github} openLink={url} name={project.title} />
        </div>
        <h4 className="project-title">{project.title}</h4>
        <p className="project-description">{project.description}</p>
        <ul className="project-technologies" aria-label={`${project.title} technologies`}>
          {project.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
        {project.video?.src && (
          <a
            className="project-text-link"
            href={project.video.src}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open video <span aria-hidden="true">↗</span>
          </a>
        )}
        {url && (
          <a
            className="project-text-link"
            href={url}
            {...(!url.startsWith('#') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {project.linkLabel || 'View project'} <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}

export default function Projects({ section, sectionIds }) {
  const isMobile = useMediaQuery('(max-width: 700px)');
  const featuredRef = useRef(null);
  const featured = section.items.filter((project) => project.video?.src || project.image?.src);
  const other = section.items.filter((project) => !project.video?.src && !project.image?.src);

  return (
    <Section section={section}>
      {featured.length > 0 && (
        <div
          ref={featuredRef}
          className="featured-projects"
          role="group"
          aria-labelledby={`${section.id}-featured-title`}
        >
          <h3 className="project-group-title" id={`${section.id}-featured-title`}>
            Featured projects
          </h3>
          {isMobile ? (
            <div className="featured-projects-list">
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} sectionIds={sectionIds} featured />
              ))}
            </div>
          ) : (
            <Carousel
              interval={null}
              controls={featured.length > 1}
              indicators={featured.length > 1}
              onSlide={() =>
                featuredRef.current?.querySelectorAll('video').forEach((video) => video.pause())
              }
              className={`featured-carousel${featured.length > 1 ? ' has-controls' : ''}`}
              aria-label="Featured software projects"
              indicatorLabels={featured.map((project) => `Show ${project.title}`)}
            >
              {featured.map((project) => (
                <Carousel.Item key={project.id}>
                  <ProjectCard project={project} sectionIds={sectionIds} featured />
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </div>
      )}
      {other.length > 0 && (
        <div className="other-projects" role="group" aria-labelledby={`${section.id}-other-title`}>
          <h3 className="project-group-title" id={`${section.id}-other-title`}>
            {featured.length ? 'More projects' : 'Projects'}
          </h3>
          <div className="projects-grid">
            {other.map((project) => (
              <ProjectCard key={project.id} project={project} sectionIds={sectionIds} />
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
