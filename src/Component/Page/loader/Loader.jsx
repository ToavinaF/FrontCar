import { Box, CircularProgress } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';

export default function Loader() {
    const { t } = useTranslation();
  return (
    <Box sx={{ pt: 0.5 }}>
        <center>
        <h1><CircularProgress color='secondary' width="60%" />  {t('Loading')}...</h1>
        </center>
        
    </Box>)
}
