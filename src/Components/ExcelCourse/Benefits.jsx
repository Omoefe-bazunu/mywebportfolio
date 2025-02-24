import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, dbase } from "../FirebaseConfig";

export const Benefits = () => {
  const benefits = [
    {
      title: "Higher chances of landing a high-paying job",
      description:
        "Excel skills are in high demand for roles involving Data Entry, Tracking, Analysis, and Reporting across all sectors.",
    },
    {
      title: "Opportunity for promotion or salary increase",
      description:
        "Excel proficiency makes you invaluable at your workplace, motivating employers to retain you with promotions or pay raises.",
    },
    {
      title: "Start your own Excel training course or YouTube channel",
      description:
        "Teach Excel online or offline through digital courses, YouTube channels, or physical training and earn unlimited income.",
    },
    {
      title: "Secure remote full-time or part-time jobs",
      description:
        "Excel skills can open doors to remote job opportunities with both foreign and local companies.",
    },
    {
      title: "Run a freelance gig",
      description:
        "Use platforms like Upwork, Fiverr, and Gigfc to offer Excel-related freelance services and earn extra income.",
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [user, setUser] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const toggleDescription = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Listen for auth state changes and fetch the user's subscription status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(dbase, "users", currentUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            setIsSubscribed(userSnap.data().isSubscribed);
          } else {
            setIsSubscribed(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsSubscribed(false);
        }
      } else {
        setIsSubscribed(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full bg-primary">
      <div className="w-full lg:w-[50%] h-fit flex flex-col items-center gap-4 mx-auto px-6 lg:px-8 py-12">
        <p className="text-white text-lg font-semibold">
          Benefits of Learning Excel
        </p>
        <hr className="w-8 h-0.5 bg-white my-2 border-none" />
        <p className="border-y-2 border-white py-2 text-center text-white">
          Learning Excel offers numerous opportunities for personal and
          professional growth, making it a valuable skill across various
          industries.
        </p>
        <div className="w-full mt-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="w-full text-primary mb-4">
              <div
                className="flex justify-between items-center cursor-pointer bg-excel2 p-4"
                onClick={() => toggleDescription(index)}
              >
                <p className="font-semibold">
                  {index + 1}. {benefit.title}
                </p>
                <span>{expandedIndex === index ? "−" : "+"}</span>
              </div>
              {expandedIndex === index && (
                <p className="mt-2 text-sm bg-excel2 p-4">
                  {benefit.description}
                </p>
              )}
            </div>
          ))}
        </div>
        {/* Conditional Button */}
        {!isSubscribed ? (
          <a
            href="https://selar.co/w21g55"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="py-2 px-8 bg-secondary rounded-full mt-6 font-medium text-white text-center">
              SUBSCRIBE TO START
            </p>
          </a>
        ) : (
          <button
            onClick={() =>
              document
                .getElementById("lessons")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="py-2 px-8 bg-secondary rounded-full mt-6 font-medium text-white text-center"
          >
            CONTINUE WATCHING
          </button>
        )}
      </div>
    </div>
  );
};
