import React from 'react';
import { FaTaxi, FaCar, FaCommentDots, FaUsers } from 'react-icons/fa';
import { FiCalendar } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';


const Count = () => {
    const { t } = useTranslation();

    return (
        <div className='dash__cards'>
            <div className='single__car'>
                <div className='card__content'>
                    <h4><span>{t('car')} </span></h4>
                    <span>41</span>
                </div>
                <div className='card__icon'>
                    <FaCar color="rgb(130, 5, 161)" />
                </div>
            </div>

            <div className='single__car'>
                <div className='card__content'>
                    <h4><span>
                        {t('user')}
                    </span> </h4>
                    <span>41</span>
                </div>
                <span className='card__icon'>
                    <FaUsers color="rgb(255, 251, 0)" />
                </span>
            </div>

            <div className='single__car'>
                <div className='card__content'>
                    <h4><span>
                        {t('reservation')}
                    </span> </h4>
                    <span>41</span>
                </div>
                <span className='card__icon'>
                    <FiCalendar color="rgb(255, 251, 0)" />
                </span>
            </div>

            <div className='single__car'>
                <div className='card__content'>
                    <h4><span>{t('message')}</span> </h4>
                    <span>41</span>
                </div>
                <span className='card__icon'>
                    <FaCommentDots color='rgb(0, 255, 213)' />
                </span>
            </div>
        </div>
    );
};

export default Count;
