import React from 'react'
import { useTranslation } from 'react-i18next';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const Chart = () => {
  const { t } = useTranslation();

  const CarStatique = [
    { name: t('Sat'), week: 4000, prevWeek: 2400 },
    { name: t('Sun'), week: 3000, prevWeek: 1398 },
    { name: t('Mon'), week: 2000, prevWeek: 9800 },
    { name: t('Tue'), week: 2780, prevWeek: 3908 },
    { name: t('Wed'), week: 1890, prevWeek: 4800 },
    { name: t('Thu'), week: 2390, prevWeek: 3800 },
    { name: t('Fri'), week: 3490, prevWeek: 4300 }
  ];
  return (
    <ResponsiveContainer width="100%">
      <AreaChart data={CarStatique} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} >
        <defs>
          <linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
            <stop offset="5%" stopColor="" stopOpacity="0.8" />
            <stop offset="95%" stopColor="" stopOpacity="0" />

          </linearGradient>
        </defs>
        <XAxis dataKey="name" stroke="var(--blanch)" />
        <CartesianGrid strokeDasharray="0" stroke='#b7ffe913' />
        <Tooltip wrapperClassName='tooltip__style' cursor={false} />


        <Area type="monotone" dataKey="prevWeek" stroke="var(--color-principal)" fillOpacity={1} fill="url(#colorPv)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default Chart
