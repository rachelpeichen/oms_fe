import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import CampaignsListView from './components/CampaignsListView';
import CampaignDetailView from './components/CampaignDetailView';
import LineItemDetailView from './components/LineItemDetailView';
import InvoiceDetailView from './components/InvoiceDetailView';

function App() {
    return (
        <Router>
            <div className="w-100" style={{flex: '1 1'}}>
                <Navbar bg="primary">
                    <Navbar.Brand href="/">
                        <p className="text-light fw-bold fs-4 m-2">Order Management System</p>
                    </Navbar.Brand>
                </Navbar>
                <Routes>
                    <Route path="/" element={<CampaignsListView />} />
                    <Route path="/campaigns/:id" element={<CampaignDetailView />} />
                    <Route path="/lineitems/:id" element={<LineItemDetailView />} />
                    <Route path="/invoices/:id" element={<InvoiceDetailView />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
