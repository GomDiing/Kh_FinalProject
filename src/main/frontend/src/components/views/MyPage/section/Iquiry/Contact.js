import React from 'react';
import { Button, Form, Input,Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const Contact = () => {
    return (
        <Form
            labelCol={{span: 4,}}
            wrapperCol={{span: 14,}}>
        <div style={{margin : '20px 0px'}}>
        <Form.Item label="문의 항목">
            <Select defaultValue="항목" style={{ width: 120 }}
                options={[
                        {
                        value: '단순 변심',
                        label: '단순 변심',
                        },
                        {
                        value: '환불 문의',
                        label: '환불 문의',
                        },
                        {
                        value: '신고',
                        label: '신고',
                        },
                    ]}
                />
        </Form.Item>
                <Form.Item label="문의 제목">
                    <Input />
                </Form.Item>
                <Form.Item label="문의 내용">
                    <TextArea rows={5} style={{resize:'none'}}/>
                </Form.Item>
            </div>
            <Form.Item label="문의">
                <Button>제출</Button>
            </Form.Item>
        </Form>
    );
};
export default Contact;