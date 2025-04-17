import React from "react";

export const Contact = () => {
  return (
    <section className="w-full py-16 bg-gray-900 text-white" id="contact">
      <div className="container mx-auto px-4 max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Contact Me</h2>
        <p className="text-center mb-6">
          Book a virtual class on Web Development or{" "}
          <span className="text-orange-500">HIRE ME</span> for a website project
          <br />
          +234 9043970401 | raniem57@gmail.com
        </p>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          <textarea
            placeholder="Message"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded h-24"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
          >
            SEND MESSAGE
          </button>
        </form>
      </div>
    </section>
  );
};
