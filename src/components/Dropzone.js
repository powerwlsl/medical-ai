import { useDropzone } from 'react-dropzone';
import React, { useEffect, useState } from 'react';
import { PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline';

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
};

function Dropzone({ files, setFiles, setEnableUpload }) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      Promise.all(
        acceptedFiles.map(file =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () =>
              resolve({
                name: file.name,
                data: reader.result,
                preview: URL.createObjectURL(file)
              });
            reader.onerror = error => reject(error);
          })
        )
      )
        .then(base64Files => {
          setFiles([...files, ...base64Files]);
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

  const fileItems = files.map(file => (
    <div key={file.name} className="relative mb-2 bg-blue-gray-50 p-3 rounded-lg">
      <p className="text-black text-sm">{file.name}</p>
      <button style={deleteButton} onClick={e => removeFile(file, e)}>
        <XCircleIcon />
      </button>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data URIs to avoid memory leaks, will run on unmount
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
        </div>
      </div>
      <aside className='mt-4'>{fileItems}</aside>

      <div className='flex justify-end'>
        {
          files.length > 0 &&
          <button className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"



            onClick={() => {
              setEnableUpload(true);
            }}
          >
            Upload
          </button>
        }
      </div>

    </section>
  );
}

export default Dropzone;
