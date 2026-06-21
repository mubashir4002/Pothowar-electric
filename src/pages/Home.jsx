import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import B2BSection from '../components/B2BSection';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Pothowar Electric | Trusted Electrical Supplier in Rawalpindi</title>
        <meta name="description" content="Rawalpindi's trusted supplier for electrical items, LED lights, fans, solar panels, and more. Genuine products with honest pricing for over 15 years." />
        <meta name="keywords" content="Electrical Supplier Rawalpindi, Buy Solar Panels Pakistan, Wholesale electrical items, LED Lights, Fans, DB Boxes" />
      </Helmet>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <B2BSection />
    </>
  );
};

export default Home;
