import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Cast from './Cast';
import Contents from './Contents';
import Reviews from './Reviews';


function DBody() {
  const [key, setKey] = useState('home');

  return (
    <div style={{width: '70%', height: '100rem'}}>
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"

    >
      <Tab eventKey="home" title="공연정보">
      <Contents/>
      </Tab>
      <Tab eventKey="cast" title="캐스팅 정보">
      <Cast/>
      </Tab>
      <Tab eventKey="profile" title="관람후기">
      <Reviews/>
      </Tab>
    </Tabs>
    </div>
  );
}

export default DBody;