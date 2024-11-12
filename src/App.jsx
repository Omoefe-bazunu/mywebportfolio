import { About } from "./Components/About";
import { Contact } from "./Components/Contact";
import { Footer } from "./Components/Footer";
import { Hero } from "./Components/Hero";
import { NavBar } from "./Components/NavBar";
import { Projects } from "./Components/Projects";
import { Stack } from "./Components/Stack";

function App() {
  return (
    <>
      <NavBar />
      <Hero />
      <About />
      <Stack />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}

export default App;
