import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import MainDash from './components/MainDash/MainDash';
import RightSide from './components/RightSide/RightSide';
import SigninScreen from './components/Signin/Signin';
import './App.css';

function App() {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  const signoutHandler = () => {
    localStorage.removeItem('userInfo');
    document.location.reload();
  };

  return (
    <div className="App">
      <div className="AppGlass">
        {userInfo ? (
          <BrowserRouter>
            <Sidebar signoutHandler={signoutHandler} />
            <MainDash />
            <RightSide />
          </BrowserRouter>
        ) : (
          <>
            <div></div>
            <SigninScreen />
            <div></div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
