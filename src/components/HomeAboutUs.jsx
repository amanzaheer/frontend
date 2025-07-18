import Container from "./common/Container";
import React from "react";
import Divider from "./common/Divider";
import Title from "./Title";

export default function HomeAboutUs() {
  return (
    <Container className="mx-auto max-w-[1200px] py-20 px-4">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Title text1={"ABOUT"} text2={"US"} />
        <p className="mt-4 text-green-700 text-2xl font-bold tracking-wide">
          Amana Organics: Where Nutrition Meets Beauty
        </p>
        <p className="mt-2 text-gray-600 text-lg">
          Pure, sustainable products for your health and your skin.
        </p>
      </div>

      <div className="relative grid md:grid-cols-2 gap-16 items-center bg-gradient-to-br from-green-50 via-white to-green-100 rounded-3xl shadow-2xl p-8 md:p-16">
        {/* Left: Text & Food Image */}
        <div className="flex flex-col gap-8 z-10">
          <div className="relative rounded-xl overflow-hidden shadow-lg w-full h-56 md:h-64 mb-4">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
              alt="Organic food assortment"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-md">Organic Food</span>
          </div>
          <p className="font-medium text-gray-700 leading-relaxed text-lg">
            At <span className="text-green-700 font-semibold">Amana Organics</span>, we believe that true wellness starts with what you eat. Our organic foods are grown with care, free from chemicals, and packed with natural goodness to nourish your body every day.
          </p>
        </div>

        {/* Right: Skincare Image & Text */}
        <div className="flex flex-col gap-8 z-10">
          <div className="relative rounded-xl overflow-hidden shadow-lg w-full h-56 md:h-64 mb-4">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
              alt="Natural skincare products"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-md">Natural Skincare</span>
          </div>
          <p className="font-medium text-gray-700 leading-relaxed text-lg">
            Our plant-based skincare line is crafted to bring out your natural glow. Experience gentle, effective beauty solutions made from the purest ingredients—because your skin deserves the best of nature.
          </p>
        </div>

        {/* Decorative Accent */}
        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-green-100 rounded-full opacity-30 blur-2xl z-0" />
      </div>

      <div className="mt-16 text-center">
        <p className="font-semibold text-green-700 text-xl mb-2">Our Promise</p>
        <p className="font-medium text-gray-700 leading-relaxed max-w-3xl mx-auto">
          We are committed to delivering only the best organic products, free from harmful chemicals and additives. Whether you’re looking to boost your health or care for your skin, Amana Organics is here to help you thrive naturally.
        </p>
      </div>
    </Container>
  );
}
