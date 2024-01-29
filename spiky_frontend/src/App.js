import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<HomePage />} path='/' exact />
          <Route element={<LoginPage />} path='/login' />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
