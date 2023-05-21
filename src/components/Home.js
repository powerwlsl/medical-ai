import React, { useEffect } from 'react'
import { Tooltip, Button, Spinner } from "@material-tailwind/react";
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
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
          "role": "assistant",
          "content": "Sure, let's start with what you have. Can you please share the details that you received from your doctor?"
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
      <Spinner color="blue" size="large" className='m-auto' />
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
    </>
  )


}
