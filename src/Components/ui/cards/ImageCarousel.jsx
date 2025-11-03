import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, Mousewheel, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

export const ImageCarousel = ({ title, images }) => {
const pagination = {
    clickable: true,
    renderBullet: (index, className) => {
    return `
        <span class="${className} 
            inline-flex items-center justify-center 
            w-10 h-10 
            bg-blue-700 text-white font-bold text-base 
            rounded-full mx-1 mt-8
            hover:bg-blue-500 
            transition-all
            select-none
            mr-2
            ml-2
        ">
            ${index + 1}
        </span>`;
    },
};

return (
    <section className="my-20 px-4 select-none">
        <h2 className="text-2xl font-bold text-center mb-4 text-white">{title}</h2>

    <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        }}
        pagination={pagination}
        navigation={true}
        keyboard={true}
        loop={true}
        spaceBetween={30}
        modules={[EffectCoverflow, Pagination, Navigation, Mousewheel, Keyboard]}
        className="w-full h-auto mx-auto"
        >
        {images.map((img, index) => (
            <SwiperSlide key={index} style={{ width: '300px' }}>
            <div className="flex flex-col items-center bg-black/40 p-4 rounded-xl shadow-md mb-8">
                <img
                src={img.src}
                alt={img.alt}
                className="w-full h-60 object-cover rounded-md cursor-pointer hover:scale-105 transition-transform"
                onClick={() => window.open(img.src, '_blank')}
                />
                <p className="mt-2 text-white text-center">{img.description}</p>
                <button className="mt-3 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-white transition-all">
                Opciones
                </button>
            </div>
        </SwiperSlide>
        ))}
    </Swiper>
</section>
);
};
