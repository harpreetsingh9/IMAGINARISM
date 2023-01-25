import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { download, preview } from "../assets";
import { FormField, Loader } from "../components";
import { downloadImage, downloadImagePic, getRandomPrompt } from "../utils";

const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch("http://localhost:8080/api/v1/dalle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: form.prompt }),
        });
        const data = await response.json();

        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please enter a prompt");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/v1/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        await response.json();
        navigate("/");
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a prompt and generate image");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666375] text-[16px] max-w[500px]">
          Create imaginative and visually stunning images through DALL-E AI and
          OpenAI with IMAGINARISM and share them with friends.
        </p>
      </div>
      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your name"
            type="text"
            name="name"
            placeholder="Harpreet Singh"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A man from 25 century standing on the road"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div
            className="
          relative bg-gray-50 border border-gray-300
          text-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500
          w-64 p-3 h-64 flex justify-center items-center"
          >
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="
                w-9/12 h-9/12 object-contain opacity-40"
              />
            )}
            {generatingImg && (
              <div
                className="absolute
              inset-0 z-0 flex justify-center items-center
              bg-[rgba(0,0,0,0.5)] rounded-lg
              "
              >
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="
          text-white bg-green-700 font-medium rounded-md
          text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
          <button
            type="button"
            onClick={() => downloadImagePic(form.photo)}
            className={
              form.photo
                ? "text-white bg-red-600 font-medium rounded-md text-sm w-full sm:w-auto px-4 py-2.5 text-center flex gap-2"
                : "hidden"
            }
          >
            {" "}
            Download
            <img
              src={download}
              alt="download"
              className="w-5 h-5 object-contain invert"
            />
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            Once you have created the image you want, you can share it with
            others in the community
          </p>
          <div className="flex">
            <button
              type="submit"
              className="mt-3 text-white bg-[#6469ff]
            font-medium rounded-md text-sm w-full sm:w-auto 
            px-5 py-2.5 text-center"
            >
              {loading ? "Sharing..." : "Share with the community"}
            </button>
            {loading && (
              <div
                className="mt-3 ml-3
                inset-0 z-0 flex justify-center items-center
              "
              >
                <Loader />
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
