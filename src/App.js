import './App.css';
import Layout from './Layout';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Home from './components/Home';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>

      <Layout children={<Home></Home>} />

    </QueryClientProvider>
  );
}

export default App;
