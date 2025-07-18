import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import { FaArrowRight } from 'react-icons/fa';

const RelatedProducts = ({ category, currentProductId }) => {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products.length > 0 && category) {
            let productsCopy = products.slice();
            
            // Filter by category and exclude current product
            productsCopy = productsCopy.filter((item) => 
                item.category === category && 
                item._id !== currentProductId
            );

            // If not enough products in same category, add some from other categories
            if (productsCopy.length < 4) {
                const otherProducts = products.filter((item) => 
                    item.category !== category && 
                    item._id !== currentProductId
                );
                productsCopy = [...productsCopy, ...otherProducts];
            }

            setRelated(productsCopy.slice(0, 4));
        }
    }, [products, category, currentProductId]);

    if (related.length === 0) {
        return null; // Don't show section if no related products
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <span>You might also like</span>
                </div>
                <Title text1={'RELATED'} text2={"PRODUCTS"} />
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                    Discover more amazing products that complement your selection
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((item, index) => (
                    <div key={index} className="transform transition-all duration-300 hover:scale-105">
                        <ProductItem 
                            slug={item.slug} 
                            name={item.name} 
                            price={item.price} 
                            image={item.image}
                        />
                    </div>
                ))}
            </div>

            <div className="text-center mt-8">
                <button className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                    View All Products
                    <FaArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default RelatedProducts;
