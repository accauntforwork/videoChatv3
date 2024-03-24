import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Videochat from "./pages/videochat";

function useAuthentication() {
  const [user, setUser] = useState(localStorage.getItem("user1"));

  useEffect(() => {
    if (localStorage.getItem("user1")) {
      setUser(localStorage.getItem("user1"));
    }
  }, []);

  return user;
}

function ProtectedRoute({ children }) {
  const user = useAuthentication();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/videochat" />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route index path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Videochat />
            </ProtectedRoute>
          }
        >
          <Route path="videochat" element={<Videochat />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
