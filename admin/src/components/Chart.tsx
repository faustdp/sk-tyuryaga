'use client'

import { useState } from 'react';
import {  Button } from '@payloadcms/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type TimeRange = 'day' | 'week' | 'month';

interface Props { total: number; users: {period: string; count: number }[]; filters: TimeRange[] }

const monthNames: Record<string, string> = {
  '01': 'Янв',
  '02': 'Февр',
  '03': 'Март',
  '04': 'Апр',
  '05': 'Май',
  '06': 'Июнь',
  '07': 'Июль',
  '08': 'Авг',
  '09': 'Сент',
  '10': 'Окт',
  '11': 'Нояб',
  '12': 'Дек'
};

const filterNames = {day: 'День', week:'Неделя', 'month': 'Месяц'}

const Chart: React.FC<Props> = ({ total, users, filters }) => {
  const [value, setValue] = useState<TimeRange>('day')
  const router = useRouter()
  const searchParams = useSearchParams();

  function handleChange(value: TimeRange) {
    setValue(value)
    const params = new URLSearchParams(searchParams);
    params.set('filter', value);
    router.push(`?${params.toString()}`)
  }

  return <>
   <span className="total-users">Всего юзеров: {total}</span>
    <span>Показать юзеров по:</span>
    {filters.map((el) =>
      <Button key={el} onClick={() => handleChange(el)} disabled={value === el} className="filter-btn">
        {filterNames[el]}
      </Button>
    )}
    <ResponsiveContainer width="100%" height="100%" className="recharts">
      <BarChart
        width={500}
        height={300}
        data={users}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" tickFormatter={(value) => value.split('-').slice(1).join('-')} />
        <YAxis />
        <Tooltip contentStyle={{
            borderRadius: '5px',
            color: '#333',
            textAlign: 'center',
          }}
          labelFormatter={(label) => {
            const parts = label.split('-');
            const [year, month, day] = parts;
            return parts.length === 2 ? `${monthNames[month]} ${year}` :
              parts.length === 3 ? `${day} ${monthNames[month]}` : label
          }}
        />
        <Legend />
        <Bar dataKey="count" name="Юзеров" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
      </BarChart>
    </ResponsiveContainer>
  </>
}

export default Chart