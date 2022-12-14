import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

const ChartBlock=styled.div`
    .chart{
    /* margin: 20px; */
    padding: 20px;
    /* margin-left: 20px; */

    /* -webkit-box-shadow: 0px 0px 12px -1px #000000; 
    box-shadow: 0px 0px 12px -1px #000000; */
}
.chartTitle{
    margin-bottom: 30px;
}

`;
const Chart=()=>{

const data = [
  {
    name: '9월',
    수익: 1000,
    회원: 1500,
    예매: 2000,
    amt: 2300,
  },
    {
        name: '10월',
        수익: 4000,
        회원: 2400,
        예매: 3000,
        amt: 2400,
      },
      {
        name: '11월',
        수익: 3000,
        회원: 1398,
        예매: 2210,
        amt: 2300,
      },
      {
        name: '12월',
        수익: 1000,
        회원: 1500,
        예매: 2000,
        amt: 2300,
      },
];


    return (
        <ChartBlock>
        <div className='chart'>
        <h3 className="chartTitle">누적 차트</h3>
      <ResponsiveContainer width="100%" aspect={4/1}>
      <BarChart
        //   width={500}
        //   height={300}
          data={data}
          margin={{
            top: 10,
            // right: 30,
            // left: 20,
            // bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="수익" fill="skyblue" />
          <Bar dataKey="회원" fill="olive" />
          <Bar dataKey="예매" fill="orange" />
        </BarChart>
      </ResponsiveContainer>
      </div>
      </ChartBlock>

    );
  }
export default Chart;
