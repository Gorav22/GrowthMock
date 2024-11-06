"use client";
import React, { useState, useRef } from "react";
import { chatSession } from "@/utils/GeminiAIModal";
import { FaLink } from "react-icons/fa6";
import { ClipboardCopyIcon } from '@heroicons/react/outline';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [image, setImage] = useState(null); // State to hold image file
  const [imagePreview, setImagePreview] = useState(null); // State to hold image preview URL
  const inputRef = useRef(null);
  const [copyStatus, setCopyStatus] = useState(null);

  const Userprompt = `
    You are an AI-powered mock interview helper chatbot designed to assist users in preparing for job interviews. Your task is to simulate an interactive mock interview experience by following these guidelines:
    1. **User Profile Understanding**: Begin by asking the user a series of questions to understand their background, including:
       - The job title and industry they are applying for.
       - Their level of experience (entry-level, mid-level, senior).
       - Key skills and qualifications relevant to the position.
       - Any specific areas they want to focus on (e.g., technical skills, behavioral questions, etc.).
    2. **Interview Structure**: Organize the mock interview into segments:
       - **Introduction**: Start with a brief introduction, mirroring a real interview setting.
       - **Behavioral Questions**: Pose common behavioral interview questions relevant to the user's role and background.
       - **Technical Questions**: Include role-specific technical questions if applicable, adjusting difficulty based on the user's experience level.
       - **Situational Questions**: Ask situational questions that require the user to demonstrate problem-solving skills.
       - **Closing**: End with a summary of the interview and provide constructive feedback on the user's responses.
    3. **Feedback Mechanism**: After each answer, provide personalized feedback that includes:
       - Strengths observed in their response.
       - Areas for improvement.
       - Suggestions for better articulation or examples to use.
    4. **Encouragement and Support**: Throughout the interaction, maintain a friendly and encouraging tone to help the user feel comfortable. Remind them that this is a safe space to practice.
    5. **Resources and Tips**: At the end of the session, offer additional resources such as:
       - Links to articles or videos on interview techniques.
       - Tips on body language and presentation during interviews.
       - Common pitfalls to avoid in interviews.
    6. **Follow-up Questions**: Encourage the user to ask follow-up questions or request additional practice sessions to focus on specific areas of concern.
    By strictly adhering to this structure and providing a comprehensive mock interview experience, you will help users build confidence and improve their interview skills effectively.
  `;

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      setMessages([...messages, { sender: "user", text: userInput }]);
      setUserInput("");

      try {
        const response = await chatSession.sendMessage(Userprompt + userInput);
        if (response.response.text() && response.response.text().length > 0) {
          const botResponse = response.response.text();
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", text: botResponse, copyable: true },
          ]);
        }
      } catch (error) {
        console.error("Error fetching from Gemini API:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "Sorry, I encountered an error!" },
        ]);
      }
    }

    // If there's an image, add it to the chat as well
    if (image) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", image: URL.createObjectURL(image) },
      ]);
      setImage(null); // Reset the image state after sending
      setImagePreview(null); // Reset the image preview after sending
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(null), 1500);
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Create a URL for the image preview
    }
  };

  return (
    <>
    <br/>
      <div className="flex flex-col max-w-4xl w-full mx-auto bg-gray-50 shadow-xl rounded-xl p-6">
        <div className="chat-history flex-grow overflow-y-auto space-y-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message p-4 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white ml-auto max-w-xs text-right"
                  : "bg-gray-200 text-gray-800 mr-auto max-w-4xl"
              }`}
            >
              {msg.text && <div className="message-text break-words whitespace-pre-wrap">{msg.text}</div>}
              {msg.image && (
                <div className="message-image mt-2 max-w-xs mx-auto">
                  <img src={msg.image} alt="uploaded" className="w-full h-auto rounded-lg" />
                </div>
              )}
              {msg.copyable && (
                <div className="mt-2 flex justify-end">
                  <button
                    className="flex items-center bg-blue-700 text-white text-xs px-3 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200"
                    onClick={() => handleCopy(msg.text)}
                  >
                    <ClipboardCopyIcon className="h-4 w-4 mr-1" />
                    {copyStatus ? copyStatus : "Copy"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {imagePreview && (
            <div className="mt-2 max-w-xs mx-auto">
              <img src={imagePreview} alt="preview" className="w-full h-auto rounded-2xl" />
            </div>
          )}
        <div className="input-area flex items-center mt-4 space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-grow p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200"
          >
            <FaLink />
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
