import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Accounts from '../src/screens/Accounts';
import Campaigns from '../src/screens/Campaigns';
import AdSets from '../src/screens/AdSets';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import RightSide from './components/RigtSide/RightSide';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="AppGlass">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Accounts />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/ad-sets" element={<AdSets />} />
          </Routes>
          {/* <RightSide /> */}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
