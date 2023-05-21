import React, { useEffect } from 'react'
import { Tooltip, Button, Spinner } from "@material-tailwind/react";

import Dropzone from "./Dropzone";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import env from "react-dotenv";
import Chat from "../Chat";
import BioDigitalComponent from "../BioDigitalComponent";


const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${env.OPEN_API_API_KEY}`,
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
      console.log(file.data);
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
          "content": "This is what I got from my doctor. Please explain it to me using simple language that a high school student can understand. Keep your explanation within 5 sentences:\n\n" + text
        }
      ]
    };

    const res = await axios.post(env.OPEN_AI_ENDPOINT, messages, { headers });
    console.log(res.data);
    setResult(res.data.choices[0].message.content);
    setLoading(false);
    return res.data;
  }, {
    enabled: false,
  });



  if (loading) {
    return (
      <Spinner color="blue" size="" className='m-auto mt-64' />
    )
  }

  if (!result) {
    return (
      <Dropzone setFiles={setFiles} files={files} upload={refetch} />
    )
  }

  return (
    <>
      <h1 className='text-3xl font-bold leading-tight tracking-tight text-gray-900 mb-4'>
        Appendicitis
      </h1>
      <Tooltip content="Material Tailwind">
        <button className="bg-blue-500 text-white font-bold rounded-full px-2 py-0">
          ?
        </button>
      </Tooltip>

      <iframe
        id="myWidget"
        src="https://human.biodigital.com/widget/?m=appendicitis_v02&dk=eb52c806e7d5ac9bcdd93662ab6d708639fc415e"
        width="100%"
        height="400px"
        title="Cochlear Implant Simulation"
      ></iframe>
      <h1 className='text-2xl font-bold leading-tight tracking-tight text-gray-900 mt-10'>
        Result</h1>
      <p className='mt-4'>
        {result}
      </p>

      <Chat show={showChat}></Chat>
      <button className="chatBtn" onClick={() => { setShowChat(!showChat) }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-16 h-16"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
          />
        </svg>
      </button>
    </>
  );
}
