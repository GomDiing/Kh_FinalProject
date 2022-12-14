import TopBar from "./Tool/TopBar";
import styled from "styled-components";
import { useState } from "react";



const PostManagement=()=>{
  const data = [
    {id: 0, num: '1', title: '태양의서커스', date:'2022-12-02-2023-01-15'},
    {id: 1, num: '2', title: '지구의서커스', date:'2022-12-02-2023-01-15'},
    {id: 2, num: '3', title: '달의서커스', date:'2022-12-02-2023-01-15'},
  ];

  const [lists, setLists] = useState('');

  // 체크된 아이템을 담을 배열
  const [checkItems, setCheckItems] = useState([]);
  // 체크박스 단일 선택
  const handleSingleCheck = (checked, id) => {
    if (checked) {
      console.log("개별체크 : "+ id);
      setCheckItems(prev => [...prev, id]); // 단일 선택 시 체크된 아이템을 배열에 추가
    } else {
      // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
      setCheckItems(checkItems.filter((el) => el !== id));
    }
  };

  // 체크박스 전체 선택
  const handleAllCheck = (checked) => {
    if(checked) {
      // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
      const idArray = [];
      data.forEach((el) => idArray.push(el.id));
      setCheckItems(idArray);
    }
    else {
      // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
      setCheckItems([]);
    }
  }
  const onClickDelete=(checked)=>{
    if(checked){
      alert("전시글을 삭제하시겠습니까?")
    }
  }
  
  
    return(
        <PostBlock>
        <TopBar name="전시회 게시물 관리"/>
          <div className="container">
          <table>
                <thead>
                  <tr>
                  <th>
                    <input type='checkbox' name='select-all' onChange={(e) => handleAllCheck(e.target.checked)}
                    // 데이터 개수와 체크된 아이템의 개수가 다를 경우 선택 해제 (하나라도 해제 시 선택 해제)
                    checked={checkItems.length === data.length ? true : false} />
                    </th>
                    <th width = "80px">글번호</th>
                    <th>전시명</th>
                    <th>전시기간</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.map((data,key) => (<tr key={key}>
                  <td><input type='checkbox' name={`select-${data.id}`} onChange={(e) => handleSingleCheck(e.target.checked, data.id)}
                   // 체크된 아이템 배열에 해당 아이템이 있을 경우 선택 활성화, 아닐 시 해제
                  checked={checkItems.includes(data.id) ? true : false} />
                  </td>
                    <td>{data.num}</td>
                    <td>{data.title}</td>
                    <td>{data.date}</td>
                </tr>
                ))}
                </tbody>
              </table>
            </div>
            <div className="delete"><button onClick={onClickDelete}>삭제하기</button></div>
        </PostBlock>
    );
}
export default PostManagement;

const PostBlock=styled.div`
  margin:0 auto;
  box-sizing: border-box;
  .container {
    width: 70vw;
    margin : 10px;
    display: flex;
    border: 1px solid black;
    height: 60%;
    flex-direction: column;
    text-align: center;
    padding: 3rem;
  }
table,th,td {
  border: 1px solid black;
}
.delete{
  float: right;
  button{
    border: none;
    margin: 20px 10px;
        background-color: #92A9BD;
        border-radius: 5px;
        width: 340px;
        height: 50px;
}  
}
`;