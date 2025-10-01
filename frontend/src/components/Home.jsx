import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "./common/Layout";
import Hero from "./common/Hero";
import OurCollection from "./common/OurCollection";
import About from "./common/About";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const scrollToAnchor = () => {
      const { hash } = location;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              element.scrollIntoView({ behavior: "smooth" });
              window.history.replaceState(
                null,
                "",
                window.location.pathname + window.location.search
              );
            });
          });
        }
      }
    };

    scrollToAnchor();
  }, [location]);

  return (
    <Layout>
      <Hero />
      <OurCollection />
      <About />
    </Layout>
  );
};

export default Home;
