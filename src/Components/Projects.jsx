import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { storage, dbase } from "./FirebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";

export const Projects = () => {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [projects, setProjects] = useState([]);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  useEffect(() => {
    // Fetch background image
    const fetchBackgroundImage = async () => {
      try {
        const imageRef = ref(storage, "general/bg3.jpg");
        const url = await getDownloadURL(imageRef);
        setBackgroundImage(url);
      } catch (error) {
        console.error("Error fetching background image:", error);
      }
    };

    // Fetch projects data from Firestore
    const fetchProjects = async () => {
      try {
        const projectsCollection = collection(dbase, "projects");
        const projectDocs = await getDocs(projectsCollection);

        const fetchedProjects = await Promise.all(
          projectDocs.docs.map(async (doc) => {
            const data = doc.data();
            const imageRef = ref(storage, `projects/${data["ImageUrl"]}`);
            const imageUrl = await getDownloadURL(imageRef);
            return { img: imageUrl, link: data.link };
          })
        );
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchBackgroundImage();
    fetchProjects();
  }, []);

  // Toggle to the next project
  const handleForward = () => {
    setCurrentProjectIndex((prevIndex) =>
      prevIndex === projects.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Toggle to the previous project
  const handleBackward = () => {
    setCurrentProjectIndex((prevIndex) =>
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
  };

  const currentProject = projects[currentProjectIndex];

  return (
    <div
      className="projects w-full h-fit py-16 bg-cover bg-center bg-no-repeat"
      id="projects"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full lg:w-[50%] h-fit lg:h-96 flex flex-col lg:flex-row items-center justify-center lg:items-start lg:justify-start gap-8 mx-auto px-8 lg:pl-8 ">
        <div className="w-full h-fit flex flex-col gap-8 justify-center items-center lg:items-start py-4">
          <div className="flex flex-col items-center justify-center lg:items-start lg:justify-start">
            <p className="text-white font-semibold">Projects</p>
            <hr className="w-8 h-0.5 bg-white border-none" />
          </div>
          <p className="w-[90%] lg:w-[80%] text-white text-center lg:text-left">
            Have a look at the projects I have worked on using my Stack.
          </p>
          <div className="w-full flex gap-6 items-center justify-center lg:items-start lg:justify-start">
            <div
              className="w-fit bg-secondary rounded p-2 text-white cursor-pointer"
              onClick={handleBackward}
            >
              <HiChevronLeft />
            </div>
            <div
              className="w-fit bg-secondary rounded p-2 text-white cursor-pointer"
              onClick={handleForward}
            >
              <HiChevronRight />
            </div>
          </div>
        </div>
        {currentProject && (
          <div
            className="w-full h-96 lg:h-full bg-slate-500 rounded-lg relative projectList border-2 border-tet"
            style={{
              backgroundImage: `url(${currentProject.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <a href={currentProject.link} target="_blank">
              <div className="w-12 h-12 rounded-full bg-tet flex justify-center items-center absolute -bottom-4 -right-4 scale-animation">
                <div className="w-8 h-8 rounded-full bg-secondary flex justify-center items-center">
                  <p className="text-white font-bold text-xs text-center">GO</p>
                </div>
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
