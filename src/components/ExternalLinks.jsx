import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';

export default function ExternalLinks({ githubLink, openLink, name }) {
  return (
    <div className="external-links">
      {githubLink && (
        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} on GitHub`}
        >
          <GitHubIcon sx={{ fontSize: 22 }} />
        </a>
      )}
      {openLink && (
        <a
          href={openLink}
          aria-label={`Explore ${name}`}
          {...(!openLink.startsWith('#') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <OpenInNewRoundedIcon sx={{ fontSize: 22 }} />
        </a>
      )}
    </div>
  );
}
