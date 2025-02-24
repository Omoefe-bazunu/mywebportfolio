import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, dbase } from "../FirebaseConfig";
import { PaystackButton } from "react-paystack";

export const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [user, setUser] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Fetch lessons from the ExcelCourse collection
    const fetchLessons = async () => {
      try {
        const querySnapshot = await getDocs(collection(dbase, "ExcelCourse"));
        const lessonsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLessons(lessonsData);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    fetchLessons();

    // Check user authentication and subscription status
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
  }, [dbase, auth]);

  const toggleLesson = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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
    <div className="w-full bg-excel2" id="lessons">
      <div className="w-full lg:w-[50%] h-fit flex flex-col items-center gap-4 mx-auto px-6 lg:px-8 py-12">
        <p className="text-primary text-lg font-semibold">
          Course Video Lessons
        </p>
        <hr className="w-8 h-0.5 bg-primary my-2" />
        <p className="border-y-2 border-primary py-4 text-center text-primary">
          This is a complete list of the video lessons for the course. You have
          to be subscribed to see the videos and stream them.
        </p>

        {/* Lessons List */}
        <div className="w-full mt-6">
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
                    <>
                      {lesson?.videoLink ? (
                        <video
                          controls
                          controlsList="nodownload"
                          onContextMenu={(e) => e.preventDefault()}
                          className="w-full rounded-md"
                          src={lesson.videoLink}
                          onError={(e) =>
                            console.error("Video load error:", e.target.error)
                          }
                          onLoadedData={() =>
                            console.log("Video loaded successfully")
                          }
                          type="video/mp4"
                        />
                      ) : (
                        <p className="text-yellow-500">
                          No video link available for this lesson.
                        </p>
                      )}
                    </>
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

        {/* If not subscribed, show the Paystack subscribe button */}
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
