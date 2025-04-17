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
  const storage = getStorage();

  useEffect(() => {
    // Fetch the Introduction video directly from Storage
    const fetchIntroVideo = async () => {
      try {
        const introRef = ref(storage, "SmartphoneDesign/INTRODUCTION.mp4");
        const url = await getDownloadURL(introRef);
        setIntroVideo(url);
      } catch (error) {
        console.error("Error fetching Introduction video:", error);
      }
    };

    // Fetch other lessons from Firestore
    const fetchLessons = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(dbase, "SmartPhoneDesign")
        );
        const lessonsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const lessonData = doc.data();

            if (lessonData.videoLink) {
              try {
                const videoUrl = await getDownloadURL(
                  ref(storage, lessonData.videoLink)
                );
                return { id: doc.id, ...lessonData, videoLink: videoUrl };
              } catch (error) {
                console.error("Error fetching video URL:", error);
              }
            }
            return { id: doc.id, ...lessonData, videoLink: null };
          })
        );

        // Ensure lessons are sorted by a specific field (e.g., lessonNumber)
        const sortedLessons = lessonsData
          .filter(Boolean) // Remove any undefined values caused by failed video fetches
          .sort((a, b) => a.lessonNumber - b.lessonNumber); // Sorting by a numerical field

        setLessons(sortedLessons);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    fetchIntroVideo();
    fetchLessons();

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

        {/* Introduction Video - Always Available */}
        <div className="w-full mt-6 text-white">
          <div className="flex justify-between items-center bg-green-700 p-4">
            <p className="font-semibold">Introduction</p>
          </div>
          <div className="mt-2 bg-gray-800 p-4">
            {introVideo ? (
              <video
                controls
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                className="w-full rounded-md"
                src={introVideo}
                type="video/mp4"
              />
            ) : (
              <p className="text-white">
                No video available. Course is starting in March, 2025. Stay
                connected
              </p>
            )}
          </div>
        </div>

        {/* Other Lessons - Subscription Required */}
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
                    lesson?.videoLink ? (
                      <video
                        controls
                        controlsList="nodownload"
                        onContextMenu={(e) => e.preventDefault()}
                        className="w-full rounded-md"
                        src={lesson.videoLink}
                        type="video/mp4"
                      />
                    ) : (
                      <p className="text-yellow-500">
                        No video available for this lesson.
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

        {/* Subscribe Button */}
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
