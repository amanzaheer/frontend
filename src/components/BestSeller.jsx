import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import Container from "./common/Container";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <Container className="my-10 mx-auto">
      <div className="text-center text-3xl py-8 w-full">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our most beloved products, handpicked by our community of
          passionate gardeners. These bestsellers represent the perfect blend of
          quality, innovation, and customer satisfaction.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 w-full">
        {bestSeller.map((item, index) => (
          <ProductItem
            key={index}
            slug={item.slug}
            name={item.name}
            image={item.image}
            price={item.price}
          />
        ))}
      </div>
    </Container>
  );
};

export default BestSeller;
