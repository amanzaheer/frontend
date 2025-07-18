import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80", // Lifestyle/brand
    headline: "Welcome to Amana Organics",
    subtext:
      "Nourishing your body and skin with pure, organic products. Discover the best of nature for your wellness and beauty.",
    cta: "Discover Our Range",
    ctaLink: "/collection",
  },
  {
    image:
      "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=1500&q=80", // Organic food
    headline: "Eat Pure. Live Well.",
    subtext:
      "Explore our selection of organic foods for a healthier lifestyle. Fresh, natural, and chemical-free ingredients for your family.",
    cta: "Shop Organic Foods",
    ctaLink: "/collection?category=food",
  },
  {
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1500&q=80", // Skincare
    headline: "Glow Naturally",
    subtext:
      "Pamper your skin with our gentle, organic skincare essentials. Pure beauty, powered by nature.",
    cta: "Shop Skincare",
    ctaLink: "/collection?category=skincare",
  },
  {
    image:
      "https://images.pexels.com/photos/1666678/pexels-photo-1666678.jpeg?auto=compress&w=1500&q=80", // Shilajit (herbal resin in a jar)
    headline: "Shilajit: Nature's Miracle",
    subtext:
      "Experience the ancient power of pure Himalayan Shilajit for energy, vitality, and holistic wellness.",
    cta: "Shop Shilajit",
    ctaLink: "/collection?category=shilajit",
  },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 700,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  arrows: true,
  pauseOnHover: true,
};

const Hero = () => {
  return (
    <div className="relative h-[80vh] flex items-center overflow-hidden">
      <Slider {...sliderSettings} className="w-full h-full">
        {slides.map((slide, idx) => (
          <div key={idx} className="relative h-[80vh] flex items-center">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.headline}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center h-full">
              <div className="max-w-2xl bg-black/40 rounded-xl p-8 md:p-12 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-12 h-[2px] bg-green-400"></span>
                  <p className="text-green-400 font-semibold tracking-wider text-base uppercase">
                    Amana Organics
                  </p>
                </div>

                <h1 className="prata-regular text-4xl md:text-6xl text-white leading-tight mb-6 drop-shadow-lg">
                  {slide.headline}
                </h1>

                <p className="text-white/90 text-lg mb-8 max-w-xl drop-shadow">
                  {slide.subtext}
                </p>

                <Link
                  to={slide.ctaLink}
                  className="inline-flex items-center px-8 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all group shadow-lg"
                >
                  {slide.cta}
                  <svg
                    className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Hero;
