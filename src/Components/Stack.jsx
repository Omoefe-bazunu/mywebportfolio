import React from "react";

export const Stack = () => {
  const techStack = [
    {
      name: "Node.js",
      icon: "https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg",
    },
    {
      name: "React",
      icon: "https://cdn.worldvectorlogo.com/logos/react-2.svg",
    },
    {
      name: "Next.js",
      icon: "https://cdn.worldvectorlogo.com/logos/next-js.svg",
    },
    {
      name: "JavaScript",
      icon: "https://cdn.worldvectorlogo.com/logos/javascript-1.svg",
    },
    {
      name: "Firebase",
      icon: "https://cdn.worldvectorlogo.com/logos/firebase-1.svg",
    },
    {
      name: "GitHub",
      icon: "https://cdn.worldvectorlogo.com/logos/github-icon-1.svg",
    },
  ];

  return (
    <section className="w-full py-16 bg-gray-900 text-white" id="stack">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">My Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          {techStack.map((tech, index) => (
            <div
              key={index}
              className="text-center flex flex-col rounded items-center p-4 justify-center bg-gray-100"
            >
              <img
                src={tech.icon}
                alt={tech.name}
                className="w-16 h-16 mx-auto mb-2"
              />
              <p className="text-sm text-primary">{tech.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
