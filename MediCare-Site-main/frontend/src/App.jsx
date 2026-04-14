import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./components/LoginPage/LoginPage";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import HomeDoctors from "./components/HomeDoctors/HomeDoctors";
import ServicePage from "./components/ServicePage/ServicePage";
import Certification from "./components/Certification/Certification";
import Testimonial from "./components/Testimonial/Testimonial";
import ContactPage from "./components/ContactPage/ContactPage";
import Footer from "./components/Footer/Footer";
import DoctorsPage from "./components/DoctorsPage/DoctorsPage";
import ServiceDetailPage from "./src/pages/ServiceDetailPage/ServiceDetailPage";
import DoctorDetail from "./src/pages/DoctorDetail/DoctorDetail";
import AppointmentPage from "./components/AppointmentPage/AppointmentPage";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <Hero />
            <HomeDoctors />
            <ServicePage />
            <Certification />
            <Testimonial />
            <ContactPage />
            <Footer />
          </>
        } />
        <Route path="/doctors" element={<><Navbar /><DoctorsPage /><Footer /></>} />
        <Route path="/services" element={<><Navbar /><ServicePage /><Footer /></>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/doctor/:id" element={<><Navbar /><DoctorDetail /><Footer /></>} />
        <Route path="/service/:id" element={<><Navbar /><ServiceDetailPage /><Footer /></>} />
        <Route path="/appointments" element={<><Navbar /><AppointmentPage /><Footer /></>} />
      </Routes>
    </Router>
  );
}

export default App;
