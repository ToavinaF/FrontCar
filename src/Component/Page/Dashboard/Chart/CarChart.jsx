import React from 'react'
import {ResponsiveContainer, XAxis, BarChart, Bar, Tooltip} from 'recharts';
import { useTranslation } from 'react-i18next';

const CarChart = () => {
  const { t } = useTranslation();

    const statistique = [
      { name: t('Sat'), Stats: 6000 },
      { name: t('Sun'), Stats: 5000 },
      { name: t('Mon'), Stats: 7000 },
      { name: t('Tue'), Stats: 5780 },
      { name: t('Wed'), Stats: 4890 },
      { name: t('Thu'), Stats: 6390 },
      { name: t('Fri'), Stats: 5490 }
      ];
  return (
    <ResponsiveContainer width='100%' >
        <BarChart data={statistique}>
        <XAxis dataKey='name' stroke='var(--blanch)'/>
        <Bar dataKey="Stats" stroke="var(--blanch)" fill='var(--color-principal)' barSize={15} radius={10}/>
        <Tooltip wrapperClassName='tooltip__style' cursor={false} />
        </BarChart>
    </ResponsiveContainer>
  )
}

export default CarChart
