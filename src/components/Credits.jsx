import "../styles/Credits.css";

export default function Credits({ profile }) {
  return (
    <footer id="contact">
      <a className="footer-email" href={`mailto:${profile.email}`}>{profile.email}</a>
      <p>© {new Date().getFullYear()} {profile.name}</p>
      <p className="template-credit">Based on a template by <a href="https://github.com/gazijarin/Gazi-V2" target="_blank" rel="noopener noreferrer">Gazi Jarin</a></p>
    </footer>
  );
}
