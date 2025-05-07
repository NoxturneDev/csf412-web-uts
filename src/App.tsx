import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/layout';
import Dashboard from '@/components/Dashboard';
import Customers from '@/components/Customers';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;