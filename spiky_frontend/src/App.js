import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import InboxPage from './pages/InboxPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route element={<PrivateRoute component={HomePage} />} path='/*' exact />
            <Route element={<PrivateRoute component={InboxPage} />} path="/inbox/:id" exact />
            <Route element={<LoginPage />} path='/login' />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
