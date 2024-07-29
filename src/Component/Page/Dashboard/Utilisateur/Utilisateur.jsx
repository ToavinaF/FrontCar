import React, { useRef } from 'react'
import profil from '../../../../assets/images/profile-02.png'
import { IoCall } from "react-icons/io5";
import { BiMessageDetail } from "react-icons/bi";
import { FaVideo } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import "./Utilisateur.scss"
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
// import required modules
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';

const Utilisateur = ({ User }) => {
    const progressCircle = useRef(null);
    const progressContent = useRef(null);
    const onAutoplayTimeLeft = (s, time, progress) => {
        progressCircle.current.style.setProperty('--progress', 1 - progress);
        progressContent.current.textContent = `${Math.ceil(time / 100)}s`;
    };
    return (
        <div className='utilisateur'>
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                spaceBetween={30}
                autoplay={{
                    delay: 4500,
                    disableOnInteraction: false,
                }}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}

                pagination={true}
                modules={[EffectCoverflow, Pagination, Autoplay]}
                // onAutoplayTimeLeft={onAutoplayTimeLeft}

                className="mySwiper"
            >
                {
                    User.map((user, i) => (
                        <SwiperSlide key={i}>
                            <div className='card'>
                                <div className='profil'>
                                    <span> <BsThreeDotsVertical /></span>
                                </div>
                                <div className='image'>
                                    <img src={`http://127.0.0.1:8000/storage/ImageVehicule/${user.photo}`} alt="profil" />
                                </div>
                                <div className='detail'>
                                    <div className='nom'>
                                        <h1><span> {user.name}{user.firstname} </span></h1>
                                    </div>
                                    <div className='profession'>
                                        <p>{user.Job}</p>
                                    </div>
                                </div>
                                <div className='icon'>
                                    <div className='icons'><IoCall /> </div>
                                    <div className='icons'><BiMessageDetail /> </div>
                                    <div className='icons'><FaVideo /> </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))

                }

                <div className="autoplay-progress" slot="container-end">
                    <svg viewBox="0 0 48 48" ref={progressCircle}>
                        <circle cx="0" cy="0" r="0"></circle>
                    </svg>
                    <span ref={progressContent}></span>
                </div>

            </Swiper>


        </div>
    )
}

export default Utilisateur
