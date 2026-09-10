import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MotionProvider from "./components/MotionProvider";
import "./globals.css";
import "./greensoff.css";
import "../i18n";
export const metadata = {
  title: {
    default: "Greensoff — Hazera seeds in Uzbekistan",
    template: "%s | Greensoff",
  },
  description:
    "Greensoff is a distributor of Hazera seeds with a network of shops in Uzbekistan. Discover our seed range and local connections.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <MotionProvider>
          <Navbar />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
