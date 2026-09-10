import Hero from "./components/Hero";
import About from "./components/About";
import Partners from "./components/Partners";
import Solutions from "./components/Solutions";
import Elements from "./components/Elements";
import StayInformed from "./components/StayInformed";
import OurPartners from "./components/OurPartners";
import Shops from "./components/Shops";
export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <Partners />
      <Solutions />
      <Elements />
      <About />
      <OurPartners />
      <Shops />
      <StayInformed />
    </main>
  );
}
