import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from 'react-bootstrap';
import CampaignsList from './components/CampaignsList';

function App() {
    return (
        <div className="w-100" style={{flex: '1 1'}}>
            <Navbar bg="primary">
                <Navbar.Brand href="#home">
                    <p className="text-light fw-bold fs-4 m-2">Order Management System</p>
                </Navbar.Brand>
            </Navbar>
            <CampaignsList />
        </div>
    );
}

export default App;
