import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./component/protectedRoute";
import Dashboard from "./pages/Dashboard";
import Header from "./component/Header";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<ProtectedRoute element={Dashboard} />} />
          </Routes>
        </div>{" "}
      </div>
    </BrowserRouter>
  );
}

export default App;
