import styled from "styled-components";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";
import DetailApi from "../../../../../../api/DetailApi";
import { Rate } from "antd";
import { AlertOutlined } from "@ant-design/icons";


const ReviewBody=()=>{
    const [reviewList, setReviewList] = useState('');
  
    let productCode = 17000544; //테스트용
    let memberIndex = 1; //테스트용

     /** 공지 목록을 가져오는 useEffect */
  useEffect(() => {
    const reviewData = async()=>{
      console.log("콘솔 왜 안찍히냐");
      try {
        const res = await DetailApi.allReviewComment(productCode);
        if(res.data.statusCode === 200){
          // setReviewList([...reviewList, ...res.data.results]);
          console.log(res.data.message);
          setReviewList(res.data.results);
          
          console.log("후기 값 : " + res.data.results);
        }else{
          alert("리스트 조회가 안됩니다.")
      } 
    }catch (e) {
        console.log(e);
      }
    };
    reviewData();
  }, []); 

  const onClickAccuse=async()=>{

  }
  
    return(
        <>
        {reviewList&&reviewList.map(({index,memberId,title,like,rate,content,group,accuseCount,productCode})=>(
        <div key={memberId}>
          <AlertOutlined style={{alignItem: 'baseline', color: 'red', fontSize: '1rem'}}
        onClick={onClickAccuse}/>
        <Form.Label >{memberId}</Form.Label>
        <Form.Label>{title}</Form.Label>
        <Form.Label>{title}</Form.Label>
        <Form.Label>{rate}</Form.Label>
        <Form.Label>{like}</Form.Label>
        <div>왜 안들와</div>
        </div>
        ))}
        <Form.Control type="text"/>
        </>
    )
}
export default ReviewBody;