import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import Home from "./components/home";

function App() {
  const user = localStorage.getItem("token");
  console.log("token", user);
  return (
    <Router>
      <header></header>
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {user && <Route path="/home" element={<Home />} />}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
