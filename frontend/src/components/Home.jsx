import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "@components/common/Layout";
import Hero from "@components/common/Hero";
import OurCollection from "@components/common/OurCollection";
import About from "@components/common/About";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const { hash } = location;
    if (!hash) return;

    const element = document.querySelector(hash);
    if (!element) return;

    const scrollToAnchor = () => {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    };

    scrollToAnchor();
    const resizeObserver = new ResizeObserver(() => {
      scrollToAnchor();
    });

    resizeObserver.observe(document.body);

    const timeout = setTimeout(() => resizeObserver.disconnect(), 2000);

    return () => {
      clearTimeout(timeout);
      resizeObserver.disconnect();
    };
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
