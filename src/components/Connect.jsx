import React from "react";
import Container from "./common/Container";

export default function Connect() {
  return (
    <Container className="mx-auto max-w-[1600px] py-10">
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl">
        {/* Background Image with Overlay */}
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
          alt="Organic lifestyle background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-green-900/60 z-10" />

        {/* Content */}
        <div className="relative z-20 grid md:grid-cols-2 items-center px-8 py-16">
          <div className="text-center md:text-left text-white py-8 md:py-16">
            <h2 className="text-4xl md:text-5xl font-bold prata-regular mb-6 drop-shadow-lg">
              Connect with Amana Organics –
              <br className="hidden md:block" />
              Wellness, Nutrition & Beauty
            </h2>
            <p className="my-5 text-lg md:text-xl text-white/90 max-w-xl drop-shadow">
              Join our community and discover a world of pure nutrition and natural beauty. Get expert tips, explore premium organic products, and start your journey to a healthier, more radiant you. Let's thrive together!
            </p>
            <a
              href="#contact"
              className="inline-block mt-4 px-8 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all shadow-lg"
            >
              Get in Touch
            </a>
          </div>
          <div />
        </div>
      </div>
    </Container>
  );
}
