import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import OurPolicy from "../components/OurPolicy";
import HomeAboutUs from "../components/HomeAboutUs";
import Connect from "../components/Connect";
import { faqs } from "../../localData";
import Accordian from "../components/common/Accordian";

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <HomeAboutUs />
      <OurPolicy />
      <Connect />
      <Accordian options={faqs} />
    </div>
  );
};

export default Home;
