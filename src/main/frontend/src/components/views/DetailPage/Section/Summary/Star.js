import React, { useState } from 'react';
import { Rate } from 'antd';

function Star() {
  const [value, setValue] = useState(3);

  function handleChange(value, number) {
    setValue(value);
  }
  return (
    <div>
      <Rate allowHalf value={value} onChange={handleChange} defaultValue={2.5} style={{ fontSize: '1.8rem'}}/>
    </div>
  )
}

export default Star;

// 별점