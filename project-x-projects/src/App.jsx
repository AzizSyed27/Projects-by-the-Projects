import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home/Home.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About";
import Projects from "./pages/Projects.jsx"
import GetInvolved from "./pages/GetInvolved.jsx"
import Donate from "./pages/Donate.jsx"
import ScrollToTop from "./components/ScrollToTop";


export default function App() {
  return (
    <>
      <ScrollToTop/>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects/>}/>
        <Route path="/get-involved" element={<GetInvolved/>} />
        <Route path="/donate" element={<Donate/>} />
        <Route path="/Contact" element={<Contact/>}/>

      </Routes>
      <Footer />
    </>
  );
}
