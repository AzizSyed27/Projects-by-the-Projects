import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home/Home.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About";
import Projects from "./pages/Projects.jsx"
import ProjectDetail from "./pages/ProjectDetail";
import GetInvolved from "./pages/GetInvolved.jsx"
import Donate from "./pages/Donate.jsx"
import ScrollToTop from "./components/ScrollToTop";

import AdminLogin from "./admin/AdminLogin.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminProjectEditor from "./admin/AdminProjectEditor.jsx";
import ProtectedRoute from "./admin/ProtectedRoute.jsx";

import AdminEvents from "./admin/AdminEvents.jsx";
import AdminEventEditor from "./admin/AdminEventEditor.jsx";

import SubscribeVerify from "./pages/SubscribeVerify.jsx";
import SubscribeUnsubscribe from "./pages/SubscribeUnsubscribe.jsx";

import NewsletterPopup from "./components/NewsletterPopup.jsx";


export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop/>

      {!isAdminRoute && <Navbar />}

      <NewsletterPopup />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects/>}/>
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/get-involved" element={<GetInvolved/>} />
        <Route path="/donate" element={<Donate/>} />
        <Route path="/Contact" element={<Contact/>}/>

        <Route path="/subscribe/verify" element={<SubscribeVerify />} />
        <Route path="/subscribe/unsubscribe" element={<SubscribeUnsubscribe />} />

        
        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/new"
          element={
            <ProtectedRoute>
              <AdminProjectEditor mode="create" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/:id/edit"
          element={
            <ProtectedRoute>
              <AdminProjectEditor mode="edit" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <AdminEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events/new"
          element={
            <ProtectedRoute>
              <AdminEventEditor mode="create" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events/:id/edit"
          element={
            <ProtectedRoute>
              <AdminEventEditor mode="edit" />
            </ProtectedRoute>
          }
        />
      </Routes>

      



      {!isAdminRoute && <Footer />}
    </>
  );
}
