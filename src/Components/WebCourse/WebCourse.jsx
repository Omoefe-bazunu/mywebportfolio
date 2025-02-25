import { Contact } from "../Contact";
import { AboutWebCourse } from "./WebAboutCourse";
import { WebBenefits } from "./WebBenefits";
import { WebBanner } from "./WebBanner";
import { WebLessons } from "./WebLessons";

export const WebCourse = () => {
  return (
    <div>
      <WebBanner />
      <AboutWebCourse />
      <WebLessons />
      <WebBenefits />
      <Contact
        text={
          "Still Got Questions about this course? Send me a Personal Message."
        }
      />
    </div>
  );
};
