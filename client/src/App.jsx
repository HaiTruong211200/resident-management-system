import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Login from "./pages/login/Login";
import HomePage from "./pages/Home/HomePage";
import Contact from "./pages/home/Contact";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}

        <Route path="/login" element={<Login />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/ourteam" element={<Our_Team />} /> */}

      </Routes>
    </Router>
  );
  // return (
  //   <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  //     <h1 className="text-4xl font-bold text-blue-600">
  //       Tailwind CSS is working! 🎉
  //     </h1>
  //   </div>
  // );
}

export default App;
