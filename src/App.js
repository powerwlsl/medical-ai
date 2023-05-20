import logo from './logo.svg';
import './App.css';
import Dropzone from './components/Dropzone';
import Layout from './Layout';
import { useState } from 'react';
import { Tooltip, Button } from "@material-tailwind/react";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
function App() {

  const [files, setFiles] = useState([]);

  return (
    <QueryClientProvider client={new QueryClient()}>
      <Layout children={<>
        <h1 className='text-3xl font-bold leading-tight tracking-tight text-gray-900 mb-4'>
          Lung Cancer
        </h1>
        <Tooltip content="Material Tailwind">
          <button className="bg-blue-500 text-white font-bold rounded-full px-2 py-0">
            ?
          </button>
        </Tooltip>
        <Dropzone setFiles={setFiles} files={files} />
      </>}>

      </Layout>
    </QueryClientProvider>
  );
}

export default App;
