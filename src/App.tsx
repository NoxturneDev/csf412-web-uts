import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Layout from '@/components/layout/layout';
import Dashboard from '@/components/Dashboard';
import Customers from '@/components/Customers';
import Products from '@/components/Product';
import Transactions from '@/components/Transaction';
import Users from '@/components/Users';
import Login from '@/components/LoginPage'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login/>}/>
            </Routes>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/customers" element={<Customers/>}/>
                    <Route path="/products" element={<Products/>}/>
                    <Route path="/users" element={<Users/>}/>
                    <Route path="/transactions" element={<Transactions/>}/>
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;