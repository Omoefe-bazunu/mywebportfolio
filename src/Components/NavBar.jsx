import { useState, useEffect } from "react"; // Import useEffect
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { auth } from "./FirebaseConfig"; // Import your auth instance
import { useNavigate } from "react-router-dom";

export const NavBar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Track user authentication state
  const navigate = useNavigate();

  useEffect(() => {
    // Observe changes in the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Cleanup the observer when the component unmounts
    return unsubscribe;
  }, []);

  const handleSignIn = () => {
    // Redirect to your sign-in page (or handle sign-in logic here)
    navigate("/signin"); // Assuming you have a '/signin' route
  };

  return (
    <div className="w-full h-16 bg-primary flex items-center overflow-x-hidden sticky top-0 z-20">
      <div className="w-[90%] mx-auto flex items-center justify-between px-4 md:px-8">
        <div className="text-white text-3xl">
          Omoefe<span className="text-secondary">.</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex text-white items-center">
          <a href={"/"}>
            <p className="px-4">Home</p>
          </a>
          <a href={"#about"}>
            <p className="px-4">About</p>
          </a>
          <a href={"#stack"}>
            <p className="px-4">Stack</p>
          </a>
          <a href={"#projects"}>
            <p className="px-4">Projects</p>
          </a>
          <a href={"/ExcelCourse"}>
            <p className="px-4">Excel Course</p>
          </a>
          {!user && ( // Conditionally render the Sign In link
            <a onClick={handleSignIn} className="px-4 cursor-pointer">
              <p>Sign In</p>
            </a>
          )}
          {user && (
            <div className="flex items-center">
              <button
                className="px-4 bg-secondary rounded-full py-2 text-white"
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
        <a href={"/"} onClick={() => setMobileMenuOpen(false)}>
          <p className="py-2 text-lg w-full">Home</p>
        </a>
        <a href={"#about"} onClick={() => setMobileMenuOpen(false)}>
          <p className="py-2 text-lg w-full">About</p>
        </a>
        <a href={"#stack"} onClick={() => setMobileMenuOpen(false)}>
          <p className="py-2 text-lg w-full">Stack</p>
        </a>
        <a href={"#projects"} onClick={() => setMobileMenuOpen(false)}>
          <p className="py-2 text-lg w-full">Projects</p>
        </a>
        <a href={"/ExcelCourse"} onClick={() => setMobileMenuOpen(false)}>
          <p className="py-2 w-full text-lg">Excel Course</p>
        </a>
        {!user && ( // Conditionally render the Sign In link in mobile menu
          <a
            onClick={() => {
              handleSignIn();
              setMobileMenuOpen(false);
            }}
            className="py-2 text-lg w-full"
          >
            <p>Sign In</p>
          </a>
        )}
        {user && (
          <div className="flex items-center">
            <button
              className="px-4 bg-secondary rounded-r-lg py-2 text-white mt-2"
              onClick={() => auth.signOut()}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
