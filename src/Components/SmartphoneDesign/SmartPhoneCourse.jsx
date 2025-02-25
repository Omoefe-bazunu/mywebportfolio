import { Contact } from "../Contact";
import { AboutSmartphoneCourse } from "./AboutCourse";
import { SmartphoneBenefits } from "./SmartPhoneBenefits";
import { SmartphoneBanner } from "./SmartPhoneBanner";
import { SmartphoneLessons } from "./SmartphoneLessons";

export const SmartPhoneDesign = () => {
  return (
    <div>
      <SmartphoneBanner />
      <AboutSmartphoneCourse />
      <SmartphoneLessons />
      <SmartphoneBenefits />
      <Contact
        text={
          "Still Got Questions about this course? Send me a Personal Message."
        }
      />
    </div>
  );
};
