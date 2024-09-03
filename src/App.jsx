import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { useNavigate, Routes, Route } from 'react-router-dom';
import './App.scss';
import Home from './Component/Home/Home';
import Login from './Component/Login/Login';
import ProtectedRoute from './Component/ProtectedRoute';
import { TokenProvider } from './TokenContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApiContext from './Component/Home/ApiContext';

const languages = [
  { code: 'fr', name: 'Français', country_code: 'fr' },
  { code: 'en', name: 'English', country_code: 'gb' }
];



function App() {
  const currentLanguageCode = Cookies.get('i18next') || 'en';
  const { t } = useTranslation();
  const [isToken, setIsToken] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.dir = currentLanguageCode === 'ar' ? 'rtl' : 'ltr';
    document.title = t('CarRint');
  }, [currentLanguageCode, t]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsToken(true);
    } else {
      setIsToken(false);
      navigate('');
    }
  }, [navigate]);

  return (
    <div className='App'>
      <ToastContainer />
      <TokenProvider value={[isToken, setIsToken]}>
        <ApiContext>
          <Routes>
            <Route path="/home/*" element={<ProtectedRoute ><Home /></ProtectedRoute>} />
            <Route path="" element={<Login />} />
            {/* Ajoutez d'autres routes ici */}
          </Routes>
        </ApiContext>
      </TokenProvider>
    </div>
  );
}

export default App;
