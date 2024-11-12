import { useEffect, useState } from "react";
import { storage } from "./FirebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";

export const Stack = () => {
  const [images, setImages] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      const iconNames = [
        "NEXT.png",
        "react.png",
        "firebase.png",
        "tail.png",
        "js.png",
        "git.png",
      ];

      // Fetch icon URLs
      const imageUrls = await Promise.all(
        iconNames.map(async (name) => {
          const imageRef = ref(storage, `general/${name}`);
          return await getDownloadURL(imageRef);
        })
      );
      setImages(imageUrls);

      // Fetch background image URL
      const backgroundRef = ref(storage, "general/lap.png");
      const backgroundUrl = await getDownloadURL(backgroundRef);
      setBackgroundImage(backgroundUrl);
    };

    fetchImages();
  }, []);

  return (
    <div
      className="stack w-full h-fit py-16 bg-cover bg-center bg-no-repeat"
      id="stack"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full lg:w-[50%] h-fit flex flex-col items-center lg:items-start justify-center gap-8 mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center lg:items-start py-4">
          <p className="text-white font-semibold">My Stack</p>
          <hr className="w-8 h-0.5 bg-white border-none mt-1" />
        </div>

        <div className="w-full grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-6">
          {images.map((src, index) => (
            <div
              key={index}
              style={{ width: "auto", height: "auto" }}
              className="w-full h-28 rounded-lg bg-slate-600 overflow-hidden relative p-4 flex items-center justify-center"
            >
              <img
                src={src}
                alt={`tech-stack-${index}`}
                className="rounded-lg scale-animation w-24 h-24"
              />
            </div>
          ))}
        </div>

        <div className="w-full flex items-center justify-center lg:justify-start">
          <hr className="w-36 h-0.5 bg-white mt-8" />
        </div>
      </div>
    </div>
  );
};
