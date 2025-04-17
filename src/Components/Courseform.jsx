import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { dbase } from "./FirebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const CourseForm = () => {
  // Available course collections
  const courseCollections = [
    "ExcelCourse",
    "SmartphoneDesign",
    "CV&Resume",
    "SocialMediaManagement",
    "WebDevelopment",
    "PCGraphics",
  ];

  // Validation Schema
  const validationSchema = Yup.object().shape({
    collection: Yup.string().required("Please select a course category"),
    lessonNumber: Yup.number()
      .typeError("Lesson number must be a number")
      .required("Lesson number is required"),
    title: Yup.string().required("Title is required"),
    videoLink: Yup.string()
      .url("Must be a valid URL")
      .required("Video link is required"),
  });

  // Handle Form Submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Add course details to selected Firestore collection
      const docRef = await addDoc(collection(dbase, values.collection), {
        lessonNumber: values.lessonNumber,
        title: values.title,
        videoLink: values.videoLink,
        createdAt: serverTimestamp(),
      });

      console.log("Document written with ID:", docRef.id);
      alert("Course uploaded successfully!");
      resetForm(); // Reset form after successful submission
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Error uploading course. Try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg my-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Course</h2>

      <Formik
        initialValues={{
          collection: "",
          lessonNumber: "",
          title: "",
          videoLink: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Select Course Collection */}
            <div>
              <label className="block font-semibold">Select Course</label>
              <Field
                as="select"
                name="collection"
                className="w-full p-2 border rounded"
              >
                <option value="">-- Select Course Category --</option>
                {courseCollections.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="collection"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Lesson Number */}
            <div>
              <label className="block font-semibold">Lesson Number</label>
              <Field
                type="text"
                name="lessonNumber"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="lessonNumber"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Lesson Title */}
            <div>
              <label className="block font-semibold">Title</label>
              <Field
                type="text"
                name="title"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Google Drive Video Link */}
            <div>
              <label className="block font-semibold">Video Link</label>
              <Field
                type="text"
                name="videoLink"
                className="w-full p-2 border rounded"
              />
              <ErrorMessage
                name="videoLink"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Upload Course"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CourseForm;
