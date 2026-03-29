import Home from "./pages/Home";
import { Routes, Route, BrowserRouter } from "react-router";
import Thumbnail from "./pages/Thumbnail";
import Layout from "./components/shared/Layout";
import FlayerDesigns from "./pages/FlayerDesigns";
import SocialMediaPosts from "./pages/SocialMediaPosts";
import StcikerDesigns from "./pages/StcikerDesigns";
import gsap from "gsap";
import { About } from "./pages/About";
import { ScrollTrigger, SplitText } from "gsap/all";
import { Contact } from "./pages/Contact";

gsap.registerPlugin(SplitText, ScrollTrigger);

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/thumbnails" element={<Thumbnail />} />
          <Route path="/flayers-designs" element={<FlayerDesigns />} />
          <Route path="/social-media-posts" element={<SocialMediaPosts />} />
          <Route path="/sticker-designs" element={<StcikerDesigns />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
