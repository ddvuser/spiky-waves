import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import InboxPage from "./pages/InboxPage";
import Register from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

import Modal from "react-modal";
import "./pages/HomePage.css";

Modal.setAppElement("#root");

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route
              element={<PrivateRoute component={HomePage} />}
              path="/*"
              exact
            />
            <Route
              element={<PrivateRoute component={InboxPage} />}
              path="/inbox/:id"
              exact
            />
            <Route
              element={<PrivateRoute component={ProfilePage} />}
              path="/profile"
              exact
            />
            <Route element={<LoginPage />} path="/login" />
            <Route element={<Register />} path="/register" />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
