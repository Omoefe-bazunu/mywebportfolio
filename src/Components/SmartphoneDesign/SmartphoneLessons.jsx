import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth, dbase } from "../FirebaseConfig";
import { PaystackButton } from "react-paystack";

export const SmartphoneLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [user, setUser] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [introVideo, setIntroVideo] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(dbase, "SmartphoneDesign")
        );
        const lessonsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLessons(lessonsData);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    const fetchIntroVideo = async () => {
      try {
        const storage = getStorage();
        const introRef = ref(storage, "SmartphoneDesign/INTRODUCTION.mp4");
        const url = await getDownloadURL(introRef);
        setIntroVideo(url);
      } catch (error) {
        console.error("Error fetching introduction video:", error);
      }
    };

    fetchLessons();
    fetchIntroVideo();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(dbase, "users", currentUser.uid);
          const userSnap = await getDoc(userDocRef);
          setIsSubscribed(
            userSnap.exists() ? userSnap.data().isSubscribed : false
          );
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

  const toggleLesson = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: user?.email || "",
    amount: 200 * 100,
    publicKey: "pk_test_709459aa3725033176d7a957bb7a3191624988e5",
  };

  const onSuccess = async () => {
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
        "Payment was successful, but we encountered an error updating your subscription status."
      );
    }
  };

  const onClose = () => alert("Payment process was closed.");

  return (
    <div className="w-full bg-excel2" id="lessons">
      <div className="w-full lg:w-[50%] flex flex-col items-center gap-4 mx-auto px-6 lg:px-8 py-12">
        <p className="text-primary text-lg font-semibold">
          Course Video Lessons
        </p>
        <hr className="w-8 h-0.5 bg-primary my-2" />

        <div className="w-full mt-6">
          {/* Introduction Video */}
          <div className="w-full mb-6">
            <p className="font-semibold text-white">Introduction Video</p>
            {introVideo ? (
              <video
                controls
                controlsList="nodownload"
                className="w-full rounded-md"
                src={introVideo}
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <div className="w-full h-48 bg-black rounded-md flex items-center justify-center text-gray-500">
                No video uploaded yet
              </div>
            )}
          </div>

          {lessons.map((lesson, index) => (
            <div key={lesson.id} className="w-full text-white mb-4">
              <div
                className="flex justify-between items-center cursor-pointer bg-green-700 p-4"
                onClick={() => toggleLesson(index)}
              >
                <p className="font-semibold">
                  Lesson {index + 1}: {lesson.title}
                </p>
                <span>{expandedIndex === index ? "−" : "+"}</span>
              </div>
              {expandedIndex === index && (
                <div className="mt-2 bg-gray-800 p-4">
                  {isSubscribed ? (
                    lesson?.videoLink ? (
                      <video
                        controls
                        controlsList="nodownload"
                        className="w-full rounded-md"
                        src={lesson.videoLink}
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    ) : (
                      <p className="text-yellow-500">
                        No video link available for this lesson.
                      </p>
                    )
                  ) : (
                    <p className="text-white">
                      Subscribe to enable & watch this lesson video.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {!isSubscribed && (
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
  );
};
