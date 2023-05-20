import logo from './logo.svg';
import './App.css';
import Dropzone from './components/Dropzone';
import Layout from './Layout';
import { useState } from 'react';
function App() {

  const [files, setFiles] = useState([]);

  return (
    <Layout children={<>
      <Dropzone setFiles={setFiles} files={files} />
    </>}>

    </Layout>
  );
}

export default App;
