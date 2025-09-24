import React from "react";
import Header from "./common/Header";
import { Layout } from "./common/Layout";
import Hero from "./common/Hero";
import OurCollection from "./common/OurCollection";

const Home = () => {
  return (
    <>
      <Layout>
        <Hero />
        <OurCollection />
      </Layout>
    </>
  );
};

export default Home;
