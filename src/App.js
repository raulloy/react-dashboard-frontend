import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import MainDashboard from './components/MainDashboard/MainDashboard';
// import RightSide from './components/RigtSide/RightSide';

function App() {
  return (
    // <BrowserRouter>
    //   <main>
    //     <Container>
    //       <Routes>
    //         <Route path="/" element={<Accounts />} />
    //       </Routes>
    //     </Container>
    //   </main>
    // </BrowserRouter>
    <div className="App">
      <div className="AppGlass">
        <Sidebar />
        <MainDashboard />
        {/* <RightSide /> */}
      </div>
    </div>
  );
}

export default App;
