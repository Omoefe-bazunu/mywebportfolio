import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { storage, dbase } from "./FirebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";

export const Projects = () => {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [projects, setProjects] = useState([]);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const imageRef = ref(storage, "general/bg3.jpg");
        const url = await getDownloadURL(imageRef);
        setBackgroundImage(url);
      } catch (error) {
        console.error("Error fetching background image:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsCollection = collection(dbase, "projects");
        const projectDocs = await getDocs(projectsCollection);

        const fetchedProjects = [];
        for (const doc of projectDocs.docs) {
          const data = doc.data();

          let imageUrl = "";
          try {
            const imageRef = ref(storage, `projects/${data["ImageUrl"]}`);
            imageUrl = await getDownloadURL(imageRef);
          } catch (error) {
            console.error(
              `Error fetching image for ${data["ImageUrl"]}:`,
              error
            );
            imageUrl = "https://via.placeholder.com/300?text=Image+Not+Found";
            setError(
              `Image not found for project: ${data.title || "Untitled Project"}`
            );
          }

          let formattedLink = data.link;
          if (
            formattedLink &&
            !formattedLink.startsWith("http://") &&
            !formattedLink.startsWith("https://")
          ) {
            formattedLink = `https://${formattedLink}`;
          }

          fetchedProjects.push({
            img: imageUrl,
            link: formattedLink,
            title: data.title || "Untitled Project",
            description: data.description || "No description available.",
          });
        }

        setProjects(fetchedProjects);
        if (fetchedProjects.length === 0) {
          setError("No projects found.");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBackgroundImage();
    fetchProjects();
  }, []);

  const handleForward = () => {
    setCurrentProjectIndex((prevIndex) =>
      prevIndex === projects.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleBackward = () => {
    setCurrentProjectIndex((prevIndex) =>
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
  };

  const currentProject = projects[currentProjectIndex];

  return (
    <section
      className="w-full min-h-screen py-16 bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      id="projects"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Projects</h2>
        <div className="w-full max-w-4xl mx-auto">
          <p className="text-center mb-8">
            Have a look at the projects I have worked on using my Stack.
          </p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {loading && <p className="text-center mb-4">Loading projects...</p>}
          {!loading && projects.length === 0 && (
            <p className="text-center mb-4 text-gray-400">
              No projects to display.
            </p>
          )}
          {currentProject && (
            <div className="relative">
              <img
                src={currentProject.img}
                alt={currentProject.title}
                className="w-full h-64 lg:h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold">
                  {currentProject.title}
                </h3>
                <p className="mt-2">{currentProject.description}</p>
                {currentProject.link ? (
                  <a
                    href={currentProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-orange-500 text-white py-2 px-8 rounded-full hover:bg-orange-600"
                  >
                    Visit
                  </a>
                ) : (
                  <p className="mt-4 text-gray-400">No link available</p>
                )}
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleBackward}
                  className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600"
                >
                  <HiChevronLeft />
                </button>
                <button
                  onClick={handleForward}
                  className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600"
                >
                  <HiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
