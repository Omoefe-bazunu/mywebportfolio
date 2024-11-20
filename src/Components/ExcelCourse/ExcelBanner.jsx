import { useEffect, useState } from "react";
import { storage } from "../FirebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";

export const ExcelBanner = () => {
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
          <p className="text-center font-bold">THE COMPLETE</p>
          <h1 className="text-5xl lg:text-6xl text-excel font-black ">
            MS EXCEL
          </h1>
          <h2 className="text-3xl lg:text-4xl font-black">COURSE</h2>
          <a href="">
            <p className=" p-8 py-2 bg-secondary rounded-full mt-6 font-medium">
              GET COURSE
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};
