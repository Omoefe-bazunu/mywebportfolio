import { useEffect, useState } from "react";

import { storage } from "../FirebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";

export const AboutCourse = () => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    // Fetch image URL from Firebase Storage
    const fetchImageUrl = async () => {
      try {
        const imageRef = ref(storage, "general/EXCEL COURSE.jpg"); // Path to 'me.jpg' in 'general' folder
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      } catch (error) {
        console.error("Error fetching image: ", error);
      }
    };

    fetchImageUrl();
  }, []);

  return (
    <div className=" w-full bg-primary">
      <div className="w-full lg:w-[50%] h-fit flex flex-col items-center gap-4 mx-auto px-6 lg:px-8 py-12">
        <p className=" text-white">About the Course</p>
        <hr className=" w-8 h-0.5 bg-" />
        <div
          className=" bg-cover bg-no-repeat bg-center w-72 h-72"
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
        <div className=" flex flex-col gap-6 text-white text-center mt-4">
          <p className="border-y-2 border-white py-2">
            This is a comprehensive course that introduces you to the basic,
            intermediate and advanced topics of Microsoft Excel, a well sought
            after tool in many organizations across different
            sectors/industries.
          </p>

          <p className="border-b-2 border-white pb-2">
            The course was recorded in a very detailed and explanatory manner
            for anyone to understand regardless of your skill level in EXCEL. It
            is also loaded with practical tasks which you will be performing
            along with each lesson you cover to get a hands-on experience.{" "}
          </p>
          <p className="border-b-2 border-white pb-2">
            The course is divided into short lessons that cover different topics
            in an orderly manner. This was intentionally done so you don’t get
            bored over a long hour lesson or get lost on any topic. The lessons
            can be downloaded and watched offline on Phone or Laptop/Desktop.
          </p>
          <p className="border-b-2 border-white pb-2">
            You are advised not attempt to resell the course as that will
            attract legal actions from the course owner. Wish you success by
            God's grace!!!
          </p>
          <p className="border-b-2 border-white pb-2">
            You can
            <span className=" text-excel mx-2">
              <a href="https://chat.whatsapp.com/LBWcksvYmJzIXQpLBE7xrJ">
                join our GENERAL GROUP on WhatsApp
              </a>
            </span>
            to meet with people who have bought the course and those who are
            still deciding as a way to get convinced to make your decision.
          </p>
        </div>
        <a href="">
          <p className=" p-8 py-2 bg-secondary rounded-full mt-6 font-medium text-white">
            GET COURSE
          </p>
        </a>
      </div>
    </div>
  );
};
