import React from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const Chart = () => {
    const CarStatique = [
        {
            name: "Sat",
            week: 4000,
            prevWeek: 2400,
          },
          {
            name: "Sun",
            week: 3000,
            prevWeek: 1398,
          },
          {
            name: "Mon",
            week: 2000,
            prevWeek: 9800,
          },
          {
            name: "Tue",
            week: 2780,
            prevWeek: 3908,
          },
          {
            name: "Wed",
            week: 1890,
            prevWeek: 4800,
          },
          {
            name: "Thu",
            week: 2390,
            prevWeek: 3800,
          },
          {
            name: "Fri",
            week: 3490,
            prevWeek: 4300,
          },
    ];
  return (
    <ResponsiveContainer width="100%">
        <AreaChart data={CarStatique} margin={{ top:10, right:30, left:0, bottom:0 }} >
            <defs>
                <linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset="5%" stopColor="" stopOpacity="0.8" />
                    <stop offset="95%" stopColor="" stopOpacity="0" />

                </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#ddd"/>
            <CartesianGrid strokeDasharray="0" stroke='#b7ffe913' />
            <Tooltip wrapperClassName='tooltip__style' cursor={false} />
            
            
            <Area type="monotone" dataKey="prevWeek" stroke="#ffc107" fillOpacity={1} fill="url(#colorPv)"/>
        </AreaChart>
    </ResponsiveContainer>
  )
}

export default Chart
