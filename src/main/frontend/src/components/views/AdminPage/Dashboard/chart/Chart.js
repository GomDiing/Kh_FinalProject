import React, { useEffect, useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import AdminApi from '../../../../../api/AdminApi';

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
const Chart = (props) => {
  const [chartData, setChartData] = useState([]);
  const [chart, setChart] = useState([]);
  
  useEffect(() => {
    const getChartData = async()=> {
      try {
          const res = await AdminApi.getChart();
          if(res.data.statusCode === 200){
            setChartData([...chartData, ...res.data.results]);
            console.log(res.data.results);
            if(chart.length === 0) {
              const mapChart = chartData.map((data) => {
                return {
                  index: data.id,
                  income: data.cumuAmount,
                  discount: data.cumuDiscount,
                  all: data.finalAmount
                }
              }); 
              setChart(mapChart); 
            }} 
          } catch (e) {
            console.log(e);
          }
      }
      getChartData();
  }, [chart]);

    return (
        <ChartBlock>
        <div className='chart'>
        <h3 className="chartTitle">누적 차트</h3>
        <ResponsiveContainer width="100%" aspect={4/1}>
        <BarChart
          // width={500}
          // height={300}
          data={chart}
          margin={{
            top: 10,
            // right: 30,
            // left: 20,
            // bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index"/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="skyblue" />
          <Bar dataKey="discount" fill="olive" />
          <Bar dataKey="all" fill="orange" />
        </BarChart>
      </ResponsiveContainer>
      </div>
      </ChartBlock>

    );
  }
export default Chart;
