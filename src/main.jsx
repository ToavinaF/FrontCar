import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

import 'flag-icon-css/css/flag-icons.min.css';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({

    supportedLngs: ['en', 'fr'],
    lng: document.querySelector('html').lang,
    fallbackLng: "en",
    detection: {
      order: ['cookie', 'htmlTag', 'localStorage', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/public/locales/{{lng}}/translation.json',
    },
    react: {
      useSuspense: false,
    },


  });

  const loadingMarkup = (
    <div>
      <h2>Loading..</h2>
    </div>
  )

ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback={loadingMarkup}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Suspense>
)
