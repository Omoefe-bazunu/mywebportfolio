import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { dbase, auth } from "./FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export const Subscribers = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState("");

  // 🔹 Check Auth and Restrict Access
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email === "raniem57@gmail.com") {
        setIsAuthorized(true);
        setUserEmail(user.email);
      } else {
        setIsAuthorized(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Fetch Receipts
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchReceipts = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(dbase, "paymentReceipts")
        );
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().userEmail || "No email",
          receiptImage: doc.data().receiptURL || "",
          date: doc.data().timestamp?.toDate
            ? doc.data().timestamp.toDate()
            : null,
        }));

        setReceipts(data);
      } catch (error) {
        console.error("Error fetching receipts:", error);
      }
    };

    fetchReceipts();
  }, [isAuthorized]);

  // 🔹 Handle Subscription Update
  const updateSubscription = async (values, { setSubmitting, resetForm }) => {
    setMessage("");
    try {
      const usersRef = collection(dbase, "users");
      const q = query(usersRef, where("email", "==", values.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(dbase, "users", userDoc.id);

        await updateDoc(userRef, {
          isSubscribed: values.isSubscribed === "true",
        });

        setMessage(`Subscription updated for ${values.email}`);
        resetForm();
      } else {
        setMessage("User not found!");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      setMessage("Error updating subscription.");
    }

    setSubmitting(false);
  };

  // 🔹 Delete Receipt
  const deleteReceipt = async (receiptId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this receipt?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(dbase, "paymentReceipts", receiptId));
      setReceipts(receipts.filter((receipt) => receipt.id !== receiptId));
    } catch (error) {
      console.error("Error deleting receipt:", error);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="p-6 bg-gray-900 text-white rounded-lg text-center">
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Manage Subscriptions</h2>

      {/* 🔹 Formik Form */}
      <Formik
        initialValues={{ email: "", isSubscribed: "false" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
          isSubscribed: Yup.string().oneOf(
            ["true", "false"],
            "Invalid selection"
          ),
        })}
        onSubmit={updateSubscription}
      >
        {({ isSubmitting }) => (
          <Form className="mb-6 space-y-4 p-4 bg-gray-800 rounded-lg">
            <div>
              <label className="block text-sm font-medium">User Email</label>
              <Field
                type="email"
                name="email"
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Subscription Status
              </label>
              <Field
                as="select"
                name="isSubscribed"
                className="w-full p-2 rounded bg-gray-700 text-white"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </Field>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded"
            >
              {isSubmitting ? "Updating..." : "Update Subscription"}
            </button>

            {message && (
              <p className="text-center text-yellow-400">{message}</p>
            )}
          </Form>
        )}
      </Formik>

      {/* 🔹 Display Payment Receipts */}
      <h2 className="text-xl font-semibold mb-4">All Payment Receipts</h2>

      {receipts.length === 0 ? (
        <p className="text-yellow-400">No payment receipts found.</p>
      ) : (
        <div className="space-y-4">
          {receipts.map(({ id, email, receiptImage, date }) => (
            <div
              key={id}
              className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg"
            >
              {receiptImage ? (
                <img
                  src={receiptImage}
                  alt="Receipt"
                  className="w-16 h-16 rounded-md object-cover cursor-pointer hover:scale-110 transition"
                  onClick={() => setSelectedImage(receiptImage)}
                />
              ) : (
                <div className="w-16 h-16 bg-gray-700 flex items-center justify-center rounded-md">
                  ❌
                </div>
              )}
              <div className="flex-1">
                <p className="text-lg font-medium">{email}</p>
                <p className="text-sm text-gray-400">
                  {date ? date.toDateString() : "No date available"}
                </p>
              </div>
              {/* 🗑 Delete Button */}
              <button
                onClick={() => deleteReceipt(id)}
                className="text-red-500 hover:text-red-700 text-xl"
                title="Delete Receipt"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Full-Screen Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-2 hover:bg-red-500"
            >
              ✖
            </button>
            <img
              src={selectedImage}
              alt="Full Receipt"
              className="max-w-full max-h-screen object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
