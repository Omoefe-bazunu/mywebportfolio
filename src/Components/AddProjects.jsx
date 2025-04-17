import { useState } from "react";
import { storage, dbase } from "./FirebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

export const AddProjectForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!title || !description || !link || !image) {
      setError("All fields are required, including an image.");
      setLoading(false);
      return;
    }

    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `projects/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      // Add project to Firestore
      await addDoc(collection(dbase, "projects"), {
        title,
        description,
        link,
        ImageUrl: image.name,
        createdAt: new Date().toISOString(),
      });

      // Reset form
      setTitle("");
      setDescription("");
      setLink("");
      setImage(null);
      setError("Project added successfully!");
    } catch (err) {
      setError("Failed to add project: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-16 bg-gray-900 text-white" id="add-project">
      <div className="container mx-auto px-4 max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Add New Project</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project Title"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded h-24"
          />
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Project Link"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:bg-orange-700"
          >
            {loading ? "Adding..." : "Add Project"}
          </button>
        </form>
      </div>
    </section>
  );
};
