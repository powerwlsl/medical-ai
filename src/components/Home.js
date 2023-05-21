import React from 'react'
import { Tooltip, Button } from "@material-tailwind/react";
import Dropzone from './Dropzone';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import env from "react-dotenv";
import BioDigitalComponent from '../BioDigitalComponent';

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${env.OPEN_API_API_KEY}`
}


export default function Home() {
  const [files, setFiles] = useState([]);
  const [enableUpload, setEnableUpload] = useState(false);

  useQuery(['postGpt'], async () => {
    alert("uploading!")
    const data = "Replace this with the actual medical report you want to explain.";

    const messages = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system",
          "content": "You're a medical expert and you're talking to a patient who wants to learn more about their conditions."
        },
        {
          "role": "user",
          "content": "This is what I got from my doctor. Please explain it to me using simple language that a high school student can understand. Keep your explanation within 500 characters:\n\n" + data
        }
      ]
    };

    const res = await axios.post(env.OPEN_AI_ENDPOINT, messages, { headers });
    console.log(res);
  }, { enabled: enableUpload });


  return (
    <>
      <h1 className='text-3xl font-bold leading-tight tracking-tight text-gray-900 mb-4'>
        Lung Cancer
      </h1>
      <Tooltip content="Material Tailwind">
        <button className="bg-blue-500 text-white font-bold rounded-full px-2 py-0">
          ?
        </button>
      </Tooltip>
      <iframe
        id="myWidget"
        src="https://human.biodigital.com/widget/?m=abdominal_aortic_aneurysm&dk=eb52c806e7d5ac9bcdd93662ab6d708639fc415e"
        width="100%"
        height="400px"
        title="Cochlear Implant Simulation"
      ></iframe>


      <Dropzone setFiles={setFiles} files={files} setEnableUpload={setEnableUpload} />
    </>
  )
}
