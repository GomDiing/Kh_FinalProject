import styled from "styled-components";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";


const ReplyReview=()=>{
    const [inputReply, setInputReply] = useState('');
    const onChangeReply=(e)=>{setInputReply(e.target.value);}

    const onClickSubmit=async()=>{

    }


    return(
        <>
        <Form>
        <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Control type="text" placeholder="Password" value={inputReply} onChange={onChangeReply}/>
      </Form.Group>
      <Button variant="primary" type="submit" onClick={onClickSubmit}>
        댓글 등록하기
      </Button>
        </Form>

        </>
    );
}
export default ReplyReview;