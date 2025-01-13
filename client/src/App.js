import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import Home from "./components/home";

function App() {
  const user = localStorage.getItem("token");
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/signup" exact element={<Signup />} />
      {user && <Route path="/home" exact element={<Home />} />}
    </Routes>
  );
}

export default App;
