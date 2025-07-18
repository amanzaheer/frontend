import React from "react";
import { assets } from "../assets/assets";
import Container from "./common/Container";
import { FiMessageCircle } from "react-icons/fi";

const whatsappNumber = "03219296932";
const whatsappLink = `https://wa.me/92${whatsappNumber.slice(1)}?text=Hi%2C%20I%20am%20interested%20in%20buying%20products%20from%20Amana%20Organics.`;

const Footer = () => {
  return (
    <>
      <Container className="mx-auto py-12 px-4">
        <div className="flex flex-col sm:grid grid-cols-1 md:grid-cols-3 gap-10 my-10">
          {/* About Section */}
          <div>
            <img src={assets.logo} className="mb-5 w-40" alt="Amana Organics Logo" />
            <p className="text-gray-600 text-base">
              Amana Organics is your trusted source for pure, organic food and natural skincare. We are dedicated to delivering quality, sustainability, and wellness to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xl font-semibold mb-5 text-green-700">Quick Links</p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <li><a href="/" className="hover:text-green-700 transition">Home</a></li>
              <li><a href="/about" className="hover:text-green-700 transition">About Us</a></li>
              <li><a href="/collection" className="hover:text-green-700 transition">Shop</a></li>
              <li><a href="/privacy-policy" className="hover:text-green-700 transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <p className="text-xl font-semibold mb-5 text-green-700">Get in Touch</p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <li>+92-313-622-4778</li>
              <li>support@amanaorganics.com</li>
              <li>Lahore, Pakistan</li>
            </ul>
          </div>
        </div>
      </Container>

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed z-50 bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-all"
        title="Chat with us on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.175.2-.298.3-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.363.709.244 1.262.389 1.694.497.712.181 1.36.156 1.872.095.571-.068 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 5.421h-.001a9.87 9.87 0 0 1-4.688-1.194l-.335-.179-3.484.917.933-3.396-.218-.348a9.86 9.86 0 0 1-1.51-5.19c.001-5.455 4.436-9.89 9.892-9.89 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.896 6.991c-.003 5.456-4.438 9.891-9.893 9.891m8.413-18.304A11.815 11.815 0 0 0 12.05 0C5.495 0 .06 5.435.058 12.09c0 2.137.56 4.223 1.623 6.067L.057 24l6.064-1.594a11.888 11.888 0 0 0 5.929 1.515h.005c6.554 0 11.989-5.435 11.991-12.09a11.86 11.86 0 0 0-3.487-8.422" />
        </svg>
      </a>

      <div className="w-full bg-green-700">
        <hr className="border-green-200" />
        <p className="py-5 text-base font-medium text-white text-center w-full">
          &copy; {new Date().getFullYear()} Amana Organics - All Rights Reserved.
        </p>
      </div>
    </>
  );
};

export default Footer;
