// import styled from "styled-components";
import Form from 'react-bootstrap/Form';
import React, { useEffect, useState } from "react";

const ReviewBody=(props)=>{
    const [Reviews, setReviews] = useState(props.reviewList);

    useEffect(() => {
      setReviews(props.reviewList);
    }, [props.reviewList]);

    return(
        <>
        {Reviews.map(({memberId, title, content, rate, like,group,accuseCount,productCode})=>(
        <div>
        <Form.Label >{memberId}</Form.Label>
        <Form.Label>{title}</Form.Label>
        <Form.Label>{content}</Form.Label>
        <Form.Label>{rate}</Form.Label>
        <Form.Label>{like}</Form.Label>
        <div>들어가져요ㅋㅋ</div>
        </div>
        ))}
        <Form.Control type="text"/>
        </>
    )
}
export default ReviewBody;