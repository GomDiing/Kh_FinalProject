import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FcBusinessman,FcBusinesswoman } from "react-icons/fc";

// 공연 정보
function Contents(props) {

  // console.log(props.stat);
  const data = [
    {
      // index: props.stat.product_code,
      10: props.stat.teen,
      20: props.stat.twenties,
      30: props.stat.thirties,
      40: props.stat.forties,
      50: props.stat.fifties
    },
  ]
  return (
    <div className='contentsWrap' style={{marginLeft: '2rem', marginTop: '1.5rem'}}>
    <div className='main'>
      <img src={props.image} alt=''></img>
    </div>
    <br/>
      <h3>예매자 통계</h3>
    <div className='stat' style={{zIndex: '100'}}>
      <Card title="성별" bordered={false} style={{width: '600px'}}>
      <span><FcBusinessman style={{fontSize : '150px'}}/><b style={{fontSize : '30px'}}> :  {props.stat.male}%</b></span>
      <span><FcBusinesswoman style={{fontSize : '150px'}}/><b style={{fontSize : '30px'}}> :  {props.stat.female}%</b></span>
    </Card>
    <br/>

        <h3 className="chartTitle">연령</h3>
        <br/>
        <ResponsiveContainer aspect={4/1}>
        <BarChart
          data={data}
          margin={{
            // top: 10,
            // right: 30,
            // left: 20,
            // bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index"/>
          <YAxis yAxisId="left"/>
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="10" fill="skyblue" />
          <Bar yAxisId="left" dataKey="20" fill="olive" />
          <Bar yAxisId="left" dataKey="30" fill="orange" />
          <Bar yAxisId="left" dataKey="40" fill="silver" />
          <Bar yAxisId="left" dataKey="50" fill="gold" />
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Contents;