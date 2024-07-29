import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import './App.scss';
import Home from './Component/Home/Home';
import Login from './Component/Login/Login';
import { Route, Routes } from 'react-router-dom';


const languages = [
  { code: 'fr', name: 'Français', country_code: 'fr' },
  { code: 'en', name: 'English', country_code: 'gb' }
];

function App() {
  const currentLanguageCode = Cookies.get('i18next') || 'en';
  const { t } = useTranslation();

  useEffect(() => {
    document.body.dir = currentLanguageCode === 'ar' ? 'rtl' : 'ltr';
    document.title = t('app_title');
  }, [t]);

  return (
    <div className='App'>
        <Routes>
        <Route path="/*" element={<Login/>} />
        <Route path="/Home/*" element={<Home/>} />
        </Routes>
    </div>
  );
}

export default App;
