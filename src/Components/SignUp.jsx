import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { auth, dbase } from "./FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth/web-extension";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const Signup = () => {
  const navigate = useNavigate();

  // Validation Schema
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSignIn = () => {
    navigate("/Signin"); // Redirect to sign up form
  };

  // Handle Form Submission

  const handleSignup = async (values, { setSubmitting, setErrors }) => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      // Store user details in Firestore (using serverTimestamp)
      await setDoc(doc(dbase, "users", user.uid), {
        fullName: values.fullName,
        email: values.email.toLowerCase(), // Ensure lowercase in Firestore
        isSubscribed: false,
        createdAt: serverTimestamp(),
      });

      // Redirect to dashboard after successful signup
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error); // Log the full error object
      // More specific error handling based on error codes:
      if (error.code === "auth/email-already-in-use") {
        setErrors({ email: "Email already in use" });
      } else if (error.code === "auth/weak-password") {
        setErrors({ password: "Password is too weak" });
      } else {
        setErrors({ general: error.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white my-20 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      <Formik
        initialValues={{ fullName: "", email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSignup}
      >
        {({ isSubmitting, errors }) => (
          <Form className="space-y-4">
            <div>
              <label className="block font-semibold">Full Name</label>
              <Field
                type="text"
                name="fullName"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="fullName"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold">Email</label>
              <Field
                type="email"
                name="email"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold">Password</label>
              <Field
                type="password"
                name="password"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {errors.general && (
              <div className="text-red-500 text-sm">{errors.general}</div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </button>
            <div className="text-center mt-2">
              <p
                className="text-primary cursor-pointer hover:text-nursery"
                onClick={handleSignIn}
              >
                Already Signed Up? Sign In
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
