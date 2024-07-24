import React from 'react'
import {ResponsiveContainer, XAxis, BarChart, Bar, Tooltip} from 'recharts';

const CarChart = () => {
    const statistique = [
        {
          name: "Sat",
          Stats: 6000,
        },
        {
          name: "Sun",
          Stats: 5000,
        },
        {
          name: "Mon",
          Stats: 7000,
        },
        {
          name: "Tue",
          Stats: 5780,
        },
        {
          name: "Wed",
          Stats: 4890,
        },
        {
          name: "Thu",
          Stats: 6390,
        },
        {
          name: "Fri",
          Stats: 5490,
        },
      ];
  return (
    <ResponsiveContainer width='100%'>
        <BarChart data={statistique}>
        <XAxis dataKey='name' stroke='var(--blanch)'/>
        <Bar dataKey="Stats" stroke="var(--blanch)" fill='var(--color-principal)' barSize={30} radius={15}/>
        <Tooltip wrapperClassName='tooltip__style' cursor={false} />
        </BarChart>
    </ResponsiveContainer>
  )
}

export default CarChart
