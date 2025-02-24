import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { auth } from "./FirebaseConfig";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [resetMessage, setResetMessage] = useState("");

  // Validation Schema
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Handle Sign In
  const handleSignIn = async (values, { setSubmitting, setErrors }) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      alert("Login Successful");
      navigate("/"); // Redirect on successful login
    } catch (error) {
      console.error("Sign in error:", error.message);
      setErrors({ general: "Invalid email or password" });
    }
    setSubmitting(false);
  };

  const handleSignUp = () => {
    navigate("/Signup"); // Redirect to sign up form
  };

  // Handle Password Reset
  const handleForgotPassword = async (email) => {
    if (!email) {
      setResetMessage("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Password reset link sent to your email.");
    } catch (error) {
      console.error("Password reset error:", error.message);
      setResetMessage("Failed to send reset email. Try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white my-20 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSignIn}
      >
        {({ isSubmitting, errors, values }) => (
          <Form className="space-y-4">
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
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>

            {/* Forgot Password Link */}
            <div className="text-center mt-2">
              <button
                type="button"
                className="text-secondary hover:underline"
                onClick={() => handleForgotPassword(values.email)}
              >
                Forgot Password?
              </button>
            </div>
            <div className="text-center mt-2">
              <p
                className="text-primary cursor-pointer hover:text-nursery"
                onClick={handleSignUp}
              >
                No Account yet? Sign Up
              </p>
            </div>

            {resetMessage && (
              <p className="text-center text-green-600 text-sm mt-2">
                {resetMessage}
              </p>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignIn;
