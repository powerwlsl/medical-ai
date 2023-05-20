import React from 'react'
import { Tooltip, Button } from "@material-tailwind/react";
import Dropzone from './Dropzone';
import { useState } from 'react';

export default function Home() {
  const [files, setFiles] = useState([]);

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
      <Dropzone setFiles={setFiles} files={files} />
    </>
  )
}
