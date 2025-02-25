import { useEffect, useState } from "react";
import { storage, auth, dbase } from "../FirebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { PaystackButton } from "react-paystack";

export const SmartphoneBanner = () => {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [user, setUser] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const imageRef = ref(storage, "general/bg2.jpg");
        const url = await getDownloadURL(imageRef);
        setBackgroundImage(url);
      } catch (error) {
        console.error("Error fetching background image:", error);
      }
    };

    fetchBackgroundImage();
  }, []);

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

  const handleContinueWatching = () => {
    const lessonsSection = document.getElementById("lessons");
    if (lessonsSection) {
      lessonsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

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
    <div
      className="w-full h-fit bg-slate-600 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-[90%] h-[350px] md:h-[450px] flex items-center mx-auto py-12 md:py-0">
        <div className="w-full flex flex-col items-center text-white">
          <p className="text-center font-bold">
            CRAFT SMART & PRO DESIGNS <br />
            with your
          </p>
          <h1 className="text-5xl lg:text-6xl text-tet font-black">
            SMARTPHONE
          </h1>
          <p className="text-lg lg:text-xl text-white font-black">
            TO EARN COOL CASH
          </p>
          {isSubscribed ? (
            <button
              onClick={handleContinueWatching}
              className="p-8 py-2 bg-secondary rounded-full mt-6 font-medium"
            >
              CONTINUE WATCHING
            </button>
          ) : (
            <div className="mt-6">
              <PaystackButton
                {...paystackConfig}
                onSuccess={onSuccess}
                onClose={onClose}
                className="px-8 py-2 bg-secondary rounded-full mt-6 font-medium text-white text-center"
                text="SUBSCRIBE TO START"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
