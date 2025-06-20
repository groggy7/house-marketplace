import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PropTypes from "prop-types";

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="relative w-full box-border h-96 rounded-lg overflow-hidden">
      <div className="h-full w-full relative">
        {images.map((image, index) => (
          <img
            key={index}
            src={`${import.meta.env.VITE_R2_STORAGE}/${image}`}
            alt={`Apartment image ${index + 1}`}
            className={`w-full h-full object-cover object-center absolute top-0 left-0 transition-all duration-500 ${
              index === currentIndex
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full"
            }`}
          />
        ))}
      </div>

      {images.length > 1 ? (
        <div>
          <div className="absolute top-1/2 left-6 -translate-y-1/2">
            <button
              onClick={goToPrevious}
              className="p-2 bg-white opacity-60 hover:opacity-80 rounded-full hover:bg-opacity-80 transition-all cursor-pointer"
              aria-label="Previous image"
            >
              <FaChevronLeft size={12} />
            </button>
          </div>
          <div className="absolute top-1/2 right-6 -translate-y-1/2">
            <button
              onClick={goToNext}
              className="p-2 bg-white opacity-60 hover:opacity-80 rounded-full hover:bg-opacity-80 transition-all cursor-pointer"
              aria-label="Next image"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      ) : null}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === slideIndex
                ? "bg-gray-500  "
                : "bg-white bg-opacity-50"
            }`}
            aria-label={`Go to image ${slideIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
ImageSlider.defaultProps = {
  images: [],
};

ImageSlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
};

export default ImageSlider;
