import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, dbase } from "../FirebaseConfig";
import { PaystackButton } from "react-paystack";

export const SmartphoneBenefits = () => {
  const benefits = [
    {
      title: "Higher chances of landing a remote job",
      description:
        "Graphic Design skill is one of the most demanded remote skill today given the fact that many businesses are either transitioning to online platforms or simply adding it as an extra marketing tool. This is a good time to learn this skill and levergae the opportunities and your smartphone is a great starting point. ",
    },
    {
      title: "Opportunity for collaboration with Social Media Managers",
      description:
        "There are many social media managers today that are currently in need of Graphic Designers to work with in serving their social media management clients. You can fill this void with your progfessional designs crafted with your smartphone",
    },
    {
      title: "Start your own Graphic Design training course or YouTube channel",
      description:
        "When you get good at the skill, you can proceed to teach Graphic Design online or offline through digital courses that you sell on platforms like selar, YouTube channels, or physical training and earn unlimited income.",
    },

    {
      title: "Run freelance gigs",
      description:
        "Use platforms like Upwork, Fiverr, and Gigfc to offer Graphic design-related freelance services and earn extra income.",
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

  // Paystack configuration – adjust amount and public key as needed
  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: user?.email || "",
    amount: 200 * 100, // e.g. 10,000 NGN in kobo
    publicKey: "pk_test_709459aa3725033176d7a957bb7a3191624988e5",
  };

  const onSuccess = async (reference) => {
    // Payment successful: update Firestore user document
    try {
      if (user) {
        const userDocRef = doc(dbase, "users", user.uid);
        await updateDoc(userDocRef, {
          isSubscribed: true,
        });
        setIsSubscribed(true);
        alert("Payment successful. You are now subscribed!");
      }
    } catch (error) {
      console.error("Error updating subscription status:", error);
      alert(
        "Payment was successful, but we encountered an error updating your subscription status."
      );
    }
  };

  const onClose = () => {
    alert("Payment process was closed.");
  };

  return (
    <div className="w-full bg-primary">
      <div className="w-full lg:w-[50%] h-fit flex flex-col items-center gap-4 mx-auto px-6 lg:px-8 py-12">
        <p className="text-white text-lg font-semibold">
          Benefits of SmartPhone Graphic Design
        </p>
        <hr className="w-8 h-0.5 bg-white my-2 border-none" />
        <p className="border-y-2 border-white py-2 text-center text-white">
          Learning Smart Phone Graphic Design offers numerous opportunities for
          personal and professional growth, making it a valuable skill across
          various industries.
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
          <div className="mt-6">
            <PaystackButton
              {...paystackConfig}
              onSuccess={onSuccess}
              onClose={onClose}
              className="px-8 py-2 bg-secondary rounded-full mt-6 font-medium text-white text-center"
              text="SUBSCRIBE TO START"
            />
          </div>
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
