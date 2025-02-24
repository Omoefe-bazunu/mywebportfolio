import { useEffect, useState } from "react";
import { storage } from "../FirebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth, dbase } from "../FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { PaystackButton } from "react-paystack";

export const AboutCourse = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [user, setUser] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch course image URL from Firebase Storage
  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const imageRef = ref(storage, "general/EXCEL COURSE.jpg");
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      } catch (error) {
        console.error("Error fetching image: ", error);
      }
    };
    fetchImageUrl();
  }, []);

  // Check user authentication and subscription status
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
    amount: 10000 * 100, // 10,000 NGN in kobo
    publicKey: "YOUR_PAYSTACK_PUBLIC_KEY",
  };

  const onSuccess = async (reference) => {
    try {
      if (user) {
        const userDocRef = doc(dbase, "users", user.uid);
        await updateDoc(userDocRef, { isSubscribed: true });
        setIsSubscribed(true);
        alert("Payment successful. You are now subscribed!");
      }
    } catch (error) {
      console.error("Error updating subscription status:", error);
      alert(
        "Payment was successful, but an error occurred updating your subscription status."
      );
    }
  };

  const onClose = () => {
    alert("Payment process was closed.");
  };

  return (
    <div className="w-full bg-primary">
      <div className="w-full lg:w-[50%] h-fit flex flex-col items-center gap-4 mx-auto px-6 lg:px-8 py-12">
        <p className="text-white">About the Course</p>
        <hr className="w-8 h-0.5 bg-white" />
        <div
          className="bg-cover bg-no-repeat bg-center w-72 h-72"
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
        <div className="flex flex-col gap-6 text-white text-center mt-4">
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
            along with each lesson you cover to get a hands-on experience.
          </p>
          <p className="border-b-2 border-white pb-2">
            The course is divided into short lessons that cover different topics
            in an orderly manner. This was intentionally done so you don’t get
            bored over a long hour lesson or get lost on any topic.
          </p>
          <p className="border-b-2 border-white pb-2">
            You can join our GENERAL GROUP on{" "}
            <span className="text-excel mx-2">
              <a
                href="https://chat.whatsapp.com/LBWcksvYmJzIXQpLBE7xrJ"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </span>{" "}
            to meet with people who have subscribed and ask your questions about
            the course to help you decide on getting the course.
          </p>
        </div>
        {/* Show Paystack subscribe button if the user is not subscribed */}
        {!isSubscribed && (
          <div className="mt-6">
            <PaystackButton
              {...paystackConfig}
              onSuccess={onSuccess}
              onClose={onClose}
              className="p-8 py-2 bg-secondary rounded-full mt-6 font-medium text-white"
              text="SUBSCRIBE TO START"
            />
          </div>
        )}
      </div>
    </div>
  );
};
