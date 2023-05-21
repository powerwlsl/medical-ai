import React, { useEffect } from 'react'
import { Tooltip, Button, Spinner } from "@material-tailwind/react";

import Dropzone from "./Dropzone";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import env from "react-dotenv";
import Chat from "../Chat";
import BioDigitalComponent from "../BioDigitalComponent";
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';


const headers = {
  "Content-Type": "application/json",
  // Authorization: `Bearer ${process.env.REACT_APP_OPEN_API_API_KEY}`,

  Authorization: `Bearer ${"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"}`,
};

export default function Home() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);


  const { refetch } = useQuery(['postGpt'], async () => {
    setLoading(true);
    let text = ""

    files.forEach(file => {
      text += file.data;
    });




    const messages = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system",
          "content": "You're a medical expert and you're talking to a patient who wants to learn more about their conditions."
        },
        {
          "role": "user",
          "content": "This is what I got from my doctor. Please explain it to me using simple language that a high school student can understand, but keep it professional. Keep your explanation in around 3 paragraphs, less then 12 sentences :\n\n" + text
        }
      ]
    };
    // console.log(`sending request to ${process.env.REACT_APP_OPEN_AI_ENDPOINT}...`)
    const res = await axios.post("https://api.openai.com/v1/chat/completions", messages, { headers });
    console.log(res.data);
    setResult(res.data.choices[0].message.content);
    setLoading(false);
    return res.data;
  }, {
    enabled: false,
  });



  if (loading) {
    return (
      <Spinner color="blue" width="100" height="100" className='m-auto mt-64' />
    )
  }

  if (!result) {
    return (
      <>
        <Dropzone setFiles={setFiles} files={files} upload={refetch} />
        <Chat show={showChat}></Chat>
        <button className="chatBtn bg-blue-400 rounded-full" onClick={() => { setShowChat(!showChat) }}>
          <ChatBubbleLeftIcon className="h-8 w-8 text-white m-auto" />
        </button>
      </>

    )
  }

  return (
    <>
      <div className='bg-white px-6 py-10 rounded-lg shadow'>
        <div className='flex'>
          <h1 className='text-2xl font-bold leading-tight tracking-tight text-gray-800 mb-4'>

            Appendicitis
          </h1>
          <Tooltip content="Appendicitis is an inflammation of the appendix, a finger-shaped pouch that projects from your colon on the lower right side of your abdomen.">
            <button className="bg-blue-500 text-white font-bold rounded-full px-1 py-0 w-5 h-5 ml-2 mt-1 text-xs">
              ?
            </button>
          </Tooltip>

        </div>
        <p className='text-gray-600 mb-4'>
          Hover over the highlighted areas of the body to learn more about your condition.
        </p>
        <BioDigitalComponent tour="appendicitis_v02" />
      </div>

      <div className='bg-white px-6 py-10 rounded-lg shadow mt-10 mb-20'>
        <h1 className='text-2xl font-bold leading-tight tracking-tight text-gray-900'>
          Explanation
        </h1>
        <p className='mt-4 whitespace-pre-wrap'>
          {result}
        </p>
      </div>

      <Chat show={showChat}></Chat>
      <button className="chatBtn bg-blue-400 rounded-full" onClick={() => { setShowChat(!showChat) }}>
        <ChatBubbleLeftIcon className="h-8 w-8 text-white m-auto" />
      </button>
    </>
  );
}
