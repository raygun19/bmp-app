import './App.css';
import DashboardRouter from './components/dashboard/DashboardRouter';
import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom'
import Welcome from './components/auth/Welcome';

function App() {

  return (
    <div className='top-level'>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome></Welcome>}></Route>
          <Route path="/dashboard" element={<DashboardRouter></DashboardRouter>}></Route>
        </Routes>
      </Router> 
    </div>
  );
}

export default App;
