import { useDropzone } from 'react-dropzone';
import React, { useEffect, useState } from 'react';
import { PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline';


const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  position: 'relative',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
  borderRadius: '10px'
};

const deleteButton = {
  position: 'absolute',
  top: -10,
  right: -10,
  color: '#EA776D',
  width: '20px',
  height: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

function Dropzone({ files, setFiles }) {

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: acceptedFiles => {
      Promise.all(
        acceptedFiles.map(file =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve({ name: file.name, data: reader.result, preview: URL.createObjectURL(file) });
            reader.onerror = error => reject(error);
          })
        )
      )
        .then(base64Files => {

          setFiles([
            ...files,
            ...base64Files
          ]);
        })
        .catch(error => console.log(error));
    }
  });


  const removeFile = (file, e) => {
    e.preventDefault();
    const newFiles = files.filter(f => f !== file);
    setFiles(newFiles);
    URL.revokeObjectURL(file.preview); // revoke object URL to avoid memory leaks
  };


  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          alt={file.name}
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
        {/* main image check */}
      </div>
      <button style={deleteButton} onClick={(e) => removeFile(file, e)}>
        <XCircleIcon />
      </button>
      <input type="radio" name="mainImage" value={file.id} className='absolute b-0' />

    </div>
  ));


  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <section className="container p-4 border-2 rounded-lg border-dashed">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <div className="text-center">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
          <div className="text-gray-600 text-center">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-[#3ec795] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#3ec795] focus-within:ring-offset-2 hover:text-[#3ec795]"
            >
              <span>Upload a file</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>
    </section>
  );
}

export default Dropzone;