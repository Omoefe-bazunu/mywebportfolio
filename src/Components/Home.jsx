import { Hero } from "./Hero";
import { About } from "./About";
import { Stack } from "./Stack";
import { Projects } from "./Projects";
import { Contact } from "./Contact";

export const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Stack />
      <Projects />
      <Contact
        text={
          "Book a virtual class on Web Development or HIRE ME for a website project"
        }
      />
    </>
  );
};
