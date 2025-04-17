import { useEffect, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { storage } from "./FirebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";

export const Hero = () => {
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const imageRef = ref(storage, "general/bg2.jpg");
        const url = await getDownloadURL(imageRef);
        setBackgroundImage(url);
      } catch (error) {
        console.error("Error fetching background image:", error);
      }
    };

    fetchBackgroundImage();
  }, []);

  return (
    <div
      className="w-full h-fit bg-slate-600 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-[90%] h-[350px] md:h-[450px] flex items-center mx-auto py-12 md:py-0">
        <div className="w-full flex flex-col items-center text-white">
          <h2 className="text-center font-bold mb-2">
            I BUILD, SHIP & MAINTAIN
          </h2>

          {/* Rotating Text Section */}
          <div className="w-full text-center fade-container">
            <p className="fade-text text-4xl md:text-5xl font-extrabold">
              SCALABLE
            </p>
            <p className="fade-text text-4xl md:text-5xl font-extrabold">
              MODERN
            </p>
            <p className="fade-text text-4xl md:text-5xl font-extrabold">
              RESPONSIVE
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <hr className="w-8 md:w-12 h-0.5 bg-white" />
            <p className="text-sm md:text-base">WEB APPS</p>
            <hr className="w-8 md:w-12 h-0.5 bg-white" />
          </div>

          {/* Social Links */}
          <div className="w-full flex items-center justify-center gap-4 mt-2">
            <a
              href={"https://x.com/raniem57"}
              target="_blank"
              className="bg-white text-primary hover:bg-primary hover:text-white rounded-full p-2 text-xl md:text-2xl "
            >
              <FaXTwitter className="" />
            </a>
            <a
              href={"https://www.linkedin.com/in/omoefe-bazunu-651b72203/"}
              target="_blank"
              className="bg-white text-primary hover:bg-primary hover:text-white rounded-full p-2 text-xl md:text-2xl"
            >
              <FaLinkedinIn />
            </a>
            <a
              href={"https://github.com/Omoefe-bazunu"}
              target="_blank"
              className="bg-white text-primary hover:bg-primary hover:text-white rounded-full p-2 text-xl md:text-2xl"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
