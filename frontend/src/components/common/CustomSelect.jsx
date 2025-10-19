import { useState, useRef, useEffect } from "react";
import FeatherIcon from "feather-icons-react";

const CustomSelect = ({ options, value, onChange, error, label, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2" ref={dropdownRef}>
      <label className="text-sm sm:text-lg md:text-2xl font-semibold text-text-title">
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex justify-between items-center p-2 text-sm sm:text-lg md:text-2xl rounded-md border text-text-title ${
            error ? "border-red-500" : "border-border-light"
          }  focus:outline-none focus:ring-1 focus:ring-primary`}
        >
          <span>{selectedOption?.label || "Выберите статус"}</span>
          <FeatherIcon
            icon="chevron-down"
            className={`transition-transform duration-300 ease-in-out ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            strokeWidth={2.3}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-bg-base border border-border-light rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="px-3 py-2 text-sm sm:text-lg md:text-2xl text-text-default hover:bg-bg-block cursor-pointer"
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default CustomSelect;
