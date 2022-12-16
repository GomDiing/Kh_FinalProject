import React from 'react';
import { Button, Form, Input,Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import MemberApi from '../../../../../api/MemberApi';

const Contact = () => {
    const [inputSelect, setInputSelect] = useState("");
    const [inputQnaTitle, setInputQnaTitle] = useState("");
    const [inputQnaContent, setInputQnaContent] = useState("");
    const onChangeSelect=(e)=>{setInputSelect(e.target.value);}
    const onChangeQnaTitle=(e)=>{setInputQnaTitle(e.target.value);}
    const onChangeQnaContent=(e)=>{setInputQnaContent(e.target.value);}
    console.log(inputSelect);
    console.log(inputQnaContent);

    // console.log(inputSelect.options[0]);
    const onClickReply=async(e)=>{
        if(inputQnaContent.length <= 5 || inputQnaContent.length >= 1000) {
        alert('문의 사항을 최소 5 ~ 1000글자 이내로 부탁드립니다.');
        e.preventDefault();
    } else {
        const res = await MemberApi.sendQna(inputSelect,inputQnaTitle,inputQnaContent);
        if(res.data.statusCode === 200) {
            alert('문의가 정상 전송 되었습니다.');
            // close(true);
            // navigate('/admin/inquiry')
            
        } else {
            alert('문의 전송이 실패 하였습니다.');
            e.preventDefault();
        }
    }
}

    return (
        <Form
            labelCol={{span: 4,}}
            wrapperCol={{span: 14,}}>
        <div style={{margin : '20px 0px'}}>
        <Form.Item label="문의 항목">
            <Select defaultValue="항목" style={{ width: 120 }} value={inputSelect} onChange={onChangeSelect}
                // options={[
                    //     {
                    //     value: '단순 변심',
                    //     label: '단순 변심',
                    //     },
                    //     {
                    //     value: '환불 문의',
                    //     label: '환불 문의',
                    //     },
                    //     {
                    //     value: '신고',
                    //     label: '신고',
                    //     },
                    // ]}
                >
                    <option value='변심'>단순 변심</option>
                    <option value="환불" label='환불'>환불 문의</option>

                    </Select> 
        </Form.Item>
                <Form.Item label="문의 제목">
                    <Input type='text' onChange={onChangeQnaTitle} value={inputQnaTitle}/>
                </Form.Item>
                <Form.Item label="문의 내용">
                    <TextArea rows={5} style={{resize:'none'}} onChange={onChangeQnaContent} value={inputQnaContent}/>
                </Form.Item>
            </div>
            <Form.Item label="문의">
                <Button onClick={onClickReply}>제출</Button>
            </Form.Item>
        </Form>
    );
};
export default Contact;