import React, { useContext, useState } from "react";
import { Link } from "react-router";
import FeatherIcon from "feather-icons-react";
import { CartContext } from "@components/context/Cart";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getQuantity } = useContext(CartContext);
  const quantity = getQuantity();
  return (
    <header className="border-border-light border-b-1 bg-bg-block px-1 sm:px-0">
      <div className="container mx-auto py-5">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to={`/`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 463 314"
                className="w-15 sm:w-20 h-auto text-text-title hover:text-primary-hover active:text-primary transition-all duration-300"
                fill="currentColor"
                style={{
                  shapeRendering: "geometricPrecision",
                  textRendering: "geometricPrecision",
                  imageRendering: "optimizeQuality",
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                }}
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <path d="M 444.5,4.5 C 448.675,3.88526 451.175,5.88526 452,10.5C 457.797,37.9715 456.13,64.9715 447,91.5C 438.83,109.002 426.997,123.502 411.5,135C 394.278,145.779 377.945,157.779 362.5,171C 325.1,182.946 286.767,189.613 247.5,191C 194.475,193.978 141.809,190.978 89.5,182C 68.9599,178.409 49.1266,172.575 30,164.5C 47.6402,223.141 85.8069,261.641 144.5,280C 201.805,296.088 255.805,288.755 306.5,258C 338.976,236.006 360.976,206.172 372.5,168.5C 380.361,164.406 388.027,160.073 395.5,155.5C 385.682,210.508 356.682,252.341 308.5,281C 263.505,306.145 215.505,314.478 164.5,306C 104.484,295.259 58.6503,264.092 27,212.5C 13.5,188.167 5.33335,162.167 2.5,134.5C 3.14874,121.042 9.48207,111.209 21.5,105C 36.2611,96.9673 51.9278,91.3006 68.5,88C 80.4757,85.5382 92.4757,83.2048 104.5,81C 125.943,58.8856 148.61,38.219 172.5,19C 195.652,1.7953 218.319,2.46197 240.5,21C 279.667,54.8333 316.167,91.3333 350,130.5C 341.884,84.1392 357.718,48.6392 397.5,24C 412.126,14.6775 427.793,8.17751 444.5,4.5 Z M 418.5,46.5 C 415.284,53.933 411.784,61.2663 408,68.5C 393.493,93.5117 379.493,118.845 366,144.5C 363.904,146.266 361.571,147.599 359,148.5C 370.021,118.129 385.021,89.7954 404,63.5C 408.377,57.39 413.211,51.7233 418.5,46.5 Z M 75.5,106.5 C 76.525,106.897 76.6917,107.563 76,108.5C 68.9683,115.197 62.3016,122.197 56,129.5C 52.6667,133.5 52.6667,137.5 56,141.5C 60.0267,144.596 64.5267,146.763 69.5,148C 95.391,154.937 121.724,159.27 148.5,161C 207.3,165.825 265.967,162.825 324.5,152C 332.412,150.196 340.078,147.696 347.5,144.5C 348.407,147.408 348.073,150.242 346.5,153C 309.29,163.735 271.29,169.402 232.5,170C 179.265,172.34 126.599,168.007 74.5,157C 60.8815,154.014 47.8815,149.347 35.5,143C 23.9622,136.088 23.6288,128.755 34.5,121C 47.7309,114.647 61.3975,109.814 75.5,106.5 Z" />
              </svg>
            </Link>
          </div>

          <nav className="hidden md:flex flex-1 justify-center gap-12 md:text-xl lg:text-2xl text-text-default">
            <Link
              to={`/`}
              className="
                relative 
                inline-block 
                after:content-[''] 
                after:absolute 
                after:left-0 
                after:bottom-0 
                after:h-[2px] 
                after:w-0 
                after:bg-current 
                after:transition-all 
                after:duration-300 
                after:ease-in-out
                hover:after:w-full
                hover:text-primary-hover
                active:text-primary
              "
            >
              Главная
            </Link>
            <Link
              to={`/catalog`}
              className="
                relative 
                inline-block 
                after:content-[''] 
                after:absolute 
                after:left-0 
                after:bottom-0 
                after:h-[2px] 
                after:w-0 
                after:bg-current 
                after:transition-all 
                after:duration-300 
                after:ease-in-out
                hover:after:w-full
                hover:text-primary-hover
                active:text-primary
              "
            >
              Каталог
            </Link>
            <Link
              to={`/#about`}
              className="
                relative 
                inline-block 
                after:content-[''] 
                after:absolute 
                after:left-0 
                after:bottom-0 
                after:h-[2px] 
                after:w-0 
                after:bg-current 
                after:transition-all 
                after:duration-300 
                after:ease-in-out
                hover:after:w-full
                hover:text-primary-hover
                active:text-primary
              "
            >
              О нас
            </Link>
            <Link
              to="#contacts"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("contacts");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });

                  element.classList.add(
                    "ring",
                    "ring-1",
                    "ring-border-light",
                    "rounded-md",
                    "ring-offset-2",
                    "ring-offset-primary",
                    "bg-bg-primary",
                    "transition-all",
                    "duration-500"
                  );

                  const observer = new IntersectionObserver(
                    ([entry]) => {
                      if (entry.isIntersecting) {
                        setTimeout(() => {
                          element.classList.remove(
                            "ring",
                            "ring-1",
                            "ring-border-light",
                            "rounded-md",
                            "ring-offset-2",
                            "ring-offset-primary",
                            "bg-bg-primary",
                            "transition-all",
                            "duration-500"
                          );
                        }, 1000);

                        observer.disconnect();
                      }
                    },
                    { threshold: 0.8 }
                  );

                  observer.observe(element);
                }
              }}
              className="
                relative 
                inline-block 
                after:content-[''] 
                after:absolute 
                after:left-0 
                after:bottom-0 
                after:h-[2px] 
                after:w-0 
                after:bg-current 
                after:transition-all 
                after:duration-300 
                after:ease-in-out
                hover:after:w-full
                hover:text-primary-hover
                active:text-primary
              "
            >
              Контакты
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to={`/profile`}>
              <FeatherIcon
                icon="user"
                strokeWidth={2.3}
                className="text-text-title w-9 h-auto active:opacity-90 hover:text-primary transition-all duration-300"
              />
            </Link>
            <Link to={`/cart`} className="relative">
              <FeatherIcon
                icon="shopping-cart"
                strokeWidth={2.3}
                className="text-text-title w-9 h-auto active:opacity-90 hover:text-primary transition-all duration-300"
              />
              {quantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-hover text-text-alt text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {quantity}
                </span>
              )}
            </Link>

            <button
              className="md:hidden flex flex-col gap-1"
              onClick={() => setIsOpen(!isOpen)}
            >
              <FeatherIcon icon="menu" className="text-text-title w-9 h-auto" />
            </button>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out m-0
    ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <nav className="flex flex-col gap-2 p-3 mt-2 text-lg">
            <Link
              to={`/`}
              className="active:text-primary hover:text-primary-hover"
            >
              Главная
            </Link>
            <Link
              to={`/catalog`}
              className="active:text-primary hover:text-primary-hover"
            >
              Каталог
            </Link>
            <Link
              to={`/#about`}
              className="active:text-primary hover:text-primary-hover"
            >
              О нас
            </Link>
            <Link
              to="#contacts"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("contacts");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });

                  element.classList.add(
                    "ring",
                    "ring-1",
                    "ring-border-light",
                    "rounded-md",
                    "ring-offset-2",
                    "ring-offset-primary",
                    "bg-bg-primary",
                    "transition-all",
                    "duration-500"
                  );

                  const observer = new IntersectionObserver(
                    ([entry]) => {
                      if (entry.isIntersecting) {
                        setTimeout(() => {
                          element.classList.remove(
                            "ring",
                            "ring-1",
                            "ring-border-light",
                            "rounded-md",
                            "ring-offset-2",
                            "ring-offset-primary",
                            "bg-bg-primary",
                            "transition-all",
                            "duration-500"
                          );
                        }, 1000);

                        observer.disconnect();
                      }
                    },
                    { threshold: 0.8 }
                  );

                  observer.observe(element);
                }
              }}
              className="active:text-primary hover:text-primary-hover"
            >
              Контакты
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
