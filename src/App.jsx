import Intro from "./components/Intro";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Product from "./components/Product";
import Credits from "./components/Credits";
import NavBar from "./components/NavBar";
import { profile, sections } from "./data/portfolio";
import "./styles/Global.css";
import "./App.css";

const sectionComponents = {
  intro: Intro,
  about: About,
  experience: Experience,
  projects: Projects,
  product: Product,
};

function App() {
  const visibleSections = sections.filter(
    (section) => section.enabled !== false && sectionComponents[section.type],
  );

  return (
    <div className="App">
      <a className="skip-link" href="#content">Skip to content</a>
      <NavBar profile={profile} sections={visibleSections} />
      <main id="content" tabIndex={-1}>
        {visibleSections.map((section) => {
          const Component = sectionComponents[section.type];
          return <Component key={section.id} section={section} profile={profile} sectionIds={visibleSections.map((item) => item.id)} />;
        })}
      </main>
      <Credits profile={profile} />
    </div>
  );
}

export default App;
