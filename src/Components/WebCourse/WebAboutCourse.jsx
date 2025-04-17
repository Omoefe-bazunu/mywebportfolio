import { useEffect, useState } from "react";
import { storage } from "../FirebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth, dbase } from "../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const AboutWebCourse = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [user, setUser] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch course image URL from Firebase Storage
  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const imageRef = ref(storage, "general/webClass-02.jpeg");
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
            This course teaches you the very basics of Web Development from the
            important concepts to the practical aspects.
          </p>
          <p className="border-b-2 border-white pb-2">
            Even without any solid knowledge in computer science or any coding
            experience, you will be able to learn to code like an expert and
            build functional and modern websites.
          </p>
          <p className="border-b-2 border-white pb-2">
            You can join our GENERAL WEB DEV GROUP on{" "}
            <span className="text-excel mx-2">
              <a
                href="https://chat.whatsapp.com/LBWcksvYmJzIXQpLBE7xrJ"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </span>{" "}
            to meet with people who have subscribed and are currently taking
            this course and join in discussions, challenges and updates.
          </p>
        </div>
        {/* Show Paystack subscribe button if the user is not subscribed */}
        {!isSubscribed && (
          <a
            href="/Payment"
            className="px-8 py-2 bg-secondary rounded-full mt-6 font-medium text-white text-center"
          >
            SUBSCRIBE TO START
          </a>
        )}
      </div>
    </div>
  );
};
