import { useState, useEffect } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./FirebaseConfig";
import { useNavigate } from "react-router-dom";

export const NavBar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCoursesModalOpen, setCoursesModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleSignIn = () => {
    navigate("/signin");
  };

  // List of course links
  const coursesLinks = [
    { label: "Excel Course", path: "/ExcelCourse" },
    { label: "Smartphone Design", path: "/SmartphoneDesign" },
    // { label: "CV & Resume", path: "/CV&Resume" },
    // { label: "Social Media Management", path: "/SocialMediaManagement" },
    { label: "Web Development", path: "/WebDevCourse" },
    // { label: "PC Graphics", path: "/PCGraphics" },
  ];

  return (
    <div className="relative">
      {/* Main Navbar */}
      <div className="w-full h-16 bg-primary flex items-center sticky top-0 z-20">
        <div className="w-[90%] mx-auto flex items-center justify-between px-4 md:px-8">
          <div className="text-white text-3xl">
            Omoefe<span className="text-secondary">.</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex text-white items-center">
            <a href="/">
              <p className="px-4">Home</p>
            </a>
            <a href="#about">
              <p className="px-4">About</p>
            </a>
            <a href="#stack">
              <p className="px-4">Stack</p>
            </a>
            <a href="#projects">
              <p className="px-4">Projects</p>
            </a>
            {/* Courses Modal Trigger */}
            <p
              onClick={() => setCoursesModalOpen(true)}
              className="px-4 py-2 bg-secondary rounded-full mr-4 cursor-pointer select-none"
            >
              Courses
            </p>
            {!user && (
              <a onClick={handleSignIn} className="px-4 cursor-pointer">
                <p>Sign In</p>
              </a>
            )}
            {user && (
              <div className="flex items-center">
                <button
                  className="py-2 text-white"
                  onClick={() => auth.signOut()}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div
            className="md:hidden text-white text-3xl cursor-pointer"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Slide-in Menu */}
      <div
        className={`fixed top-0 left-0 h-full z-20 w-full max-w-xs bg-primary text-white flex flex-col items-start py-10 px-6 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="self-end mr-4 mb-6 text-2xl"
        >
          <HiX />
        </button>
        <a href="/" onClick={() => setMobileMenuOpen(false)}>
          <p className="py-2 text-lg w-full">Home</p>
        </a>
        <a href="#about" onClick={() => setMobileMenuOpen(false)}>
          <p className="py-2 text-lg w-full">About</p>
        </a>
        <a href="#stack" onClick={() => setMobileMenuOpen(false)}>
          <p className="py-2 text-lg w-full">Stack</p>
        </a>
        <a href="#projects" onClick={() => setMobileMenuOpen(false)}>
          <p className="py-2 text-lg w-full">Projects</p>
        </a>
        {/* Mobile: Courses triggers the modal */}
        <p
          onClick={() => {
            setMobileMenuOpen(false);
            setCoursesModalOpen(true);
          }}
          className="py-2 text-lg w-full cursor-pointer select-none bg-secondary rounded-r-lg px-2"
        >
          Courses
        </p>
        {!user && (
          <a
            onClick={() => {
              handleSignIn();
              setMobileMenuOpen(false);
            }}
            className="py-2 text-lg w-full cursor-pointer"
          >
            <p>Sign In</p>
          </a>
        )}
        {user && (
          <div className="flex items-center">
            <button className="py-2 text-white" onClick={() => auth.signOut()}>
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Courses Modal */}
      {isCoursesModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-3/4 lg:w-1/2 relative">
            <button
              onClick={() => setCoursesModalOpen(false)}
              className="absolute top-4 right-4 text-2xl text-gray-700"
            >
              <HiX />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coursesLinks.map((course, idx) => (
                <div
                  key={idx}
                  className="border border-gray-300 rounded p-4 flex flex-col items-center"
                >
                  <p className="font-semibold mb-2">{course.label}</p>
                  <a
                    href={course.path}
                    onClick={() => setCoursesModalOpen(false)}
                    className="mt-auto text-sm inline-block px-4 py-2 bg-secondary text-white rounded"
                  >
                    Start Learning
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
