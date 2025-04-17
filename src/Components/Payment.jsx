import React, { useState } from "react";
import { auth, dbase, storage } from "./FirebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Monitor authentication state
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !user)
      return alert("Please upload a valid file and ensure you are logged in.");

    setUploading(true);
    const storageRef = ref(storage, `paymentReceipts/${user.uid}_${file.name}`);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Save receipt in Firestore
      const paymentRef = doc(dbase, "paymentReceipts", user.uid);
      await setDoc(paymentRef, {
        userEmail: user.email,
        userId: user.uid,
        receiptURL: downloadURL,
        timestamp: new Date(),
      });

      // Update user subscription status
      const userRef = doc(dbase, "users", user.uid);
      await updateDoc(userRef, { isSubscribed: true });

      alert("Payment receipt uploaded successfully. Subscription activated!");
      navigate(-1);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed. Please try again.");
    }
    setUploading(false);
  };

  return (
    <div className="w-full flex flex-col items-center p-6 my-20">
      <p className="border p-4 rounded-md text-white w-full max-w-md mb-4">
        Thanks for taking this step. Your subscription gives you full access to
        all the present and future courses within the duration of one month.
        After which you will have to renew with the same amount. Free to contact
        me if you have any concerns
      </p>
      <h2 className="text-xl font-semibold text-white mb-4">
        Bank Transfer Details
      </h2>
      <div className="border p-4 rounded-md bg-gray-100 w-full max-w-md">
        <p>
          <strong>Bank Name:</strong> FIRST BANK OF NIGERIA
        </p>
        <p>
          <strong>Account Name:</strong> OMOEFE BAZUNU
        </p>
        <p>
          <strong>Account Number:</strong> 3098523897
        </p>
        <p>
          <strong>Amount to Transfer:</strong> NGN1,000.00
        </p>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="mt-6 w-full max-w-md">
        <label className="block mb-2 font-semibold text-white text-center">
          Upload Payment Receipt (JPG/PNG):
        </label>
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleFileChange}
          className="mb-4 w-full border p-2 rounded-md text-white"
        />
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-secondary text-white py-2 rounded-md font-medium disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Submit Payment Receipt"}
        </button>
      </form>
    </div>
  );
};

export default Payment;
