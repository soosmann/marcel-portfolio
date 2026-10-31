import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import "../styles/NavBar.css";

export default function NavBar({ profile, sections }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar fixed="top" expand="lg" className="navbar" data-bs-theme="dark"
      expanded={expanded} onToggle={setExpanded} aria-label="Main navigation">
      <Container>
        <Navbar.Brand href="#content" onClick={() => setExpanded(false)}>{profile.name}</Navbar.Brand>
        <Navbar.Toggle aria-controls="portfolio-navigation" aria-expanded={expanded} aria-label="Toggle navigation" />
        <Navbar.Collapse id="portfolio-navigation">
          <Nav className="me-auto" onSelect={() => setExpanded(false)}>
            {sections.filter((section) => section.navLabel).map((section) => <Nav.Link href={`#${section.id}`} key={section.id}>{section.navLabel}</Nav.Link>)}
          </Nav>
          <Nav className="social-links" onSelect={() => setExpanded(false)}>
            <Nav.Link href={`mailto:${profile.email}`} aria-label={`Email ${profile.name}`}><EmailRoundedIcon sx={{ fontSize: 20 }} /></Nav.Link>
            {profile.github && <Nav.Link href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHubIcon sx={{ fontSize: 20 }} /></Nav.Link>}
            {profile.linkedin && <Nav.Link href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedInIcon sx={{ fontSize: 20 }} /></Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
