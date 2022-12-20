import styled from "styled-components";
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from "react";
import DetailApi from "../../../../../../api/DetailApi";



const ReviewBody=()=>{
    const [reviewList, setReviewList] = useState([]);
    let productCode = 17000544;

     /** 공지 목록을 가져오는 useEffect */
  useEffect(() => {
    const reviewData = async()=>{
      try {
        const res = await DetailApi.allReviewComment(productCode);
        if(res.data.statusCode === 200){
          setReviewList([...reviewList, ...res.data.results]);
          console.log(res.data.results);
        }else{
          alert("리스트 조회가 안됩니다.")
      } 
    }catch (e) {
        console.log(e);
      }
    };
    reviewData();
  }, []); 
    return(
        <>
        {reviewList.map(({index,memberId,title,like,rate,content,group,accuseCount,productCode})=>(
        <div>
        <Form.Label >{memberId}</Form.Label>
        <Form.Label>{title}</Form.Label>
        <Form.Label>{title}</Form.Label>
        <Form.Label>{rate}</Form.Label>
        <Form.Label>{like}</Form.Label>
        </div>
        ))}

        <Form.Control type="text"/>
        </>
    )
}
export default ReviewBody;