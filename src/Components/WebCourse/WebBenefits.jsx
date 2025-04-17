import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, dbase } from "../FirebaseConfig";

export const WebBenefits = () => {
  const benefits = [
    {
      title: "Higher chances of landing a high-paying job",
      description:
        "People who say websites are oudated are either living in a different reality or simply making excuses not to feel left out. Websites are much more useful and effective tiday than in the past and people who build websites are hardly in want of jobs, especially high-paying jobs.",
    },
    {
      title: "Opportunity for promotion or salary increase",
      description:
        "Scaling your skills at your current workplace can makes you very valuable as you could help build a website to help your organization go digital and reach new clients/customers. Therefore, motivating your employer to retain you with promotions or pay raises.",
    },
    {
      title:
        "Start your own Web development training course or YouTube channel",
      description:
        "You can teach web development online or offline through digital courses, YouTube channels, or physical training and earn unlimited income.",
    },
    {
      title: "Secure remote full-time or part-time jobs",
      description:
        "Your web development skill can open doors to remote job opportunities with both foreign and local companies.",
    },
    {
      title: "Run freelance gigs",
      description:
        "Use platforms like Upwork, Fiverr, and Gigfc to offer web development services and earn huge income.",
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
          Benefits of Learning Web Development
        </p>
        <hr className="w-8 h-0.5 bg-white my-2 border-none" />
        <p className="border-y-2 border-white py-2 text-center text-white">
          Learning to build websites offers numerous opportunities for personal
          and professional growth, making it a valuable skill across various
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
            href="/Payment"
            className="px-8 py-2 bg-secondary rounded-full mt-6 font-medium text-white text-center"
          >
            SUBSCRIBE TO START
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
