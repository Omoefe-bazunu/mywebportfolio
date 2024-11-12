import { useState } from "react";
import { dbase } from "./FirebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export const Contact = () => {
  // State variables for form data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable button during submission
    setError(null); // Reset error state
    setSuccess(false); // Reset success state

    try {
      // Add message to Firestore 'messages' collection
      await addDoc(collection(dbase, "messages"), {
        name,
        email,
        message,
        createdAt: new Date(),
      });

      setSuccess(true); // Show success message
      setName(""); // Clear form fields
      setEmail("");
      setMessage("");
    } catch (err) {
      setError("Error submitting your message, please try again.");
    } finally {
      setIsSubmitting(false); // Enable button after submission
    }
  };

  return (
    <div className="contact w-full h-fit py-16 bg-nursery" id="contact">
      <div className="w-full lg:w-[50%] h-fit flex flex-col lg:flex-row items-center justify-center lg:items-start lg:justify-start gap-8 mx-auto px-8 lg:pl-8">
        {/* Contact Information */}
        <div className="w-full lg:w-[45%] flex flex-col gap-4 justify-center text-center lg:text-left">
          <div className="flex flex-col items-center lg:items-start">
            <p className="text-white font-semibold text-lg lg:text-xl">
              Contact Me
            </p>
            <hr className="w-8 h-0.5 bg-white border-none mt-2" />
          </div>
          <p className="text-white text-sm lg:text-base w-[90%] lg:w-[80%] mx-auto lg:mx-0">
            Book a virtual class on Web Development or HIRE ME for a website
            project.
          </p>
          <p className="text-white text-sm lg:text-base w-full lg:w-[90%]">
            +234 9043970401 <br /> raniem57@gmail.com
          </p>
        </div>

        {/* Contact Form */}
        <div className="w-full lg:w-[55%] flex">
          <form
            onSubmit={handleSubmit}
            className="w-[90%] md:w-[80%] lg:w-full flex flex-col gap-6 items-center lg:items-start mx-auto"
          >
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b border-white outline-none text-white placeholder-white text-sm py-2"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-white outline-none text-white placeholder-white text-sm py-2"
            />
            <textarea
              placeholder="Message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-transparent border-b border-white outline-none text-white placeholder-white text-sm py-2"
            />
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            {success && (
              <div className="text-green-500 text-sm mt-2">Message sent!</div>
            )}
            <button
              type="submit"
              className="w-fit px-6 bg-secondary rounded py-1 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "SEND MESSAGE"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
