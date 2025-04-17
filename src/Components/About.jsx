import { useEffect, useState } from "react";
import { CgArrowRight } from "react-icons/cg";

import { storage } from "./FirebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";

export const About = () => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    // Fetch image URL from Firebase Storage
    const fetchImageUrl = async () => {
      try {
        const imageRef = ref(storage, "general/me.jpeg"); // Path to 'me.jpg' in 'general' folder
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      } catch (error) {
        console.error("Error fetching image: ", error);
      }
    };

    fetchImageUrl();
  }, []);

  return (
    <div className="about w-full h-fit bg-primary py-8" id="about">
      <div className="w-full lg:w-[50%] h-fit lg:h-72 flex flex-col lg:flex-row items-center gap-6 mx-auto px-6 lg:px-8 justify-center">
        <div className="w-full h-fit flex flex-col gap-4 items-center lg:items-start text-center lg:text-left py-4">
          <div className="flex flex-col items-center lg:items-start">
            <p className="text-3xl font-bold text-center text-white">
              About Me
            </p>
            {/* <hr className="w-8 h-0.5 bg-white border-none mt-2" /> */}
          </div>
          <p className="w-[90%] lg:w-[80%] text-white">
            I am intuitive, adaptive, and creative, transforming ideas into
            real-world applications using modern technologies and best
            practices.
          </p>
          <a
            href={"#contact"}
            className="flex gap-4 items-center font-semibold hover:font-normal hover:px-6 py-2 hover:bg-secondary rounded-full text-secondary hover:text-white"
          >
            <p className="w-fit ">Hire Me</p>
            {/* <CgArrowRight /> */}
          </a>
        </div>

        <div className="w-fit h-fit flex justify-center lg:justify-start py-4">
          <div className="w-32 h-32 md:w-36  md:h-36 bg-secondary rounded-full border-2 border-secondary relative overflow-hidden">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Profile Image"
                className="rounded-full bg-cover bg-center object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
