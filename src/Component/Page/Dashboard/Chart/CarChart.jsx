import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, XAxis, BarChart, Bar, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_URL } from '../../../../apiConfig';
import { ApiCall } from '../../../../ApiCall';
import ApiService from '../../../../axiosConfig';

const CarChart = () => {
  const { t, i18n } = useTranslation();
  const [statistique, setStatistique] = useState([]);

  useEffect(() => {
    const fetchStatistique = async () => {
      try {
        const response = await ApiService.get(`/reservationschart`);
        const data = response.data.map(item => ({
          name: item.date,
          Stats: item.count
        }));

        // Trier les données par date (du plus ancien au plus récent)
        data.sort((a, b) => new Date(a.name) - new Date(b.name));

        setStatistique(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };
    fetchStatistique();
  }, [t, i18n.language]);

  return (
    <ResponsiveContainer width='100%'>
      <BarChart data={statistique}>
        <XAxis dataKey='name' stroke='var(--blanch)' />
        <Bar dataKey="Stats" stroke="var(--blanch)" fill='var(--color-principal)' barSize={15} radius={10} />
        <Tooltip wrapperClassName='tooltip__style' cursor={false} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CarChart;
