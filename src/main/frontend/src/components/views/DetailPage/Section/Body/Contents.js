import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {ManOutlined, WomanOutlined } from '@ant-design/icons';

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
    <div className='stat'>
      <h3>예매자 통게</h3>
      <Card
      title="성별"
      bordered={false}
      style={{
        width: 300,
      }}
    >
      <p><ManOutlined />: {props.stat.male}</p>
      <p><WomanOutlined />: {props.stat.female}</p>

    </Card>

        <h3 className="chartTitle">연령</h3>
        <ResponsiveContainer minWidth={250} aspect={4/1}>
        <BarChart
          width={500}
          height={300}
          data={data}
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
          <Bar dataKey="10" fill="skyblue" />
          <Bar dataKey="20" fill="olive" />
          <Bar dataKey="30" fill="orange" />
          <Bar dataKey="40" fill="silver" />
          <Bar dataKey="50" fill="gold" />
        </BarChart>
      </ResponsiveContainer>
      </div>

    </div>
  )
}

export default Contents;