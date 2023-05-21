import { useDropzone } from 'react-dropzone';
import React, { useEffect, useState } from 'react';
import { PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Modal from './modal';

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

function Dropzone({ files, setFiles, upload }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      Promise.all(
        acceptedFiles.map(file =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                name: file.name,
                data: reader.result,
              });
              setOpen(true);
              setData({ name: file.name, text: reader.result })
            }

            reader.onerror = error => reject(error);
            reader.readAsText(file); // Read file as text


          })
        )
      )
        .then(textFiles => {
          setFiles([...files, ...textFiles]);
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
    <div className='bg-white px-6 py-10 rounded-lg shadow'>

      <h1 className='text-2xl font-bold leading-tight tracking-tight text-gray-800 mb-4'>
        Own Your Health Data
      </h1>
      <div className='max-w-sm m-auto mt-10'>

        <section className="container px-4 border-2 rounded-lg border-dashed border-gray-400 py-10">
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className="text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
              <div className="text-gray-600 text-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-500 "
                >
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
            </div>
          </div>
          <aside className='mt-4'>{fileItems}</aside>
        </section>
        <div className='flex justify-end mt-4'>
          {
            files.length > 0 ?
              <button className=" w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                onClick={upload}
              >
                Explain my data
              </button> :
              <button className=" w-full rounded-md bg-gray-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                onClick={upload}
                disabled={true}
              >
                Explain my data
              </button>
          }
        </div>
      </div>

      <Modal open={open} setOpen={setOpen} data={data} />
    </div>

  );
}

export default Dropzone;
