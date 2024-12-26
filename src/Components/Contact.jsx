import { useState } from "react";
import emailjs from "@emailjs/browser";

export const Contact = ({ text }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable button during submission
    setError(null); // Reset error state
    setSuccess(false); // Reset success state

    try {
      const templateParams = {
        name,
        email,
        message,
      };

      // Replace the values here with your emailJS service, template, and user ID
      await emailjs.send(
        "service_ccid698", // Replace with your service ID
        "template_qml5dg9", // Replace with your template ID
        templateParams,
        "cZC6HUxRjsMFR5npe" // Replace with your user ID
      );

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
            {text}
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

            <button
              type="submit"
              className="w-fit px-8 bg-secondary rounded-full py-2 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "SEND MESSAGE"}
            </button>
            {success && (
              <div className="text-green-500 text-sm mt-2">Message sent!</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
