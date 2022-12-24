import TopBar from "./Tool/TopBar";
import styled from "styled-components";
import { Pagination } from "antd";
import Table from 'react-bootstrap/Table';
import {useNavigate} from "react-router-dom";
import { useState, useEffect} from "react";
import AdminApi from "../../../api/AdminApi";

const PostManagement=()=>{
  const navigate = useNavigate();

    //  리액트 페이지네이션 변수 
    const [list, setList] = useState([]); //db 에서 정보 받아오기(배열에  담기)
    const [pageSize, setPageSize] = useState(12); // 한페이지에 몇개씩 있을건지
    const [totalCount, setTotalCount] = useState(0); // 총 데이터 숫자
    const [currentPage, setCurrentPage] = useState(1); // 현재 몇번째 페이지인지
  
      // 체크박스 변수
  const [checkItems, setCheckItems] = useState([]); 
  // 체크박스 단일 선택
  const handleSingleCheck = (checked, obj) => {
    if (checked) {
      // 단일 선택 시 체크된 아이템을 배열에 추가
      setCheckItems(prev => [...prev, obj]);
      console.log(obj); // 아래에서 index 값을 받은거라 index 값 찍힘
    } else {
      // 단일 선택 해제 시 체크된 아이템을 제외한 배열 (필터)
      setCheckItems(checkItems.filter((el) => el !== obj));
    }
  };

  // 체크박스 전체 선택
  const handleAllCheck = (checked) => {
    if(checked) {
      // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
      const idArray = [];
      list.forEach((el) => idArray.push(el.code));
      setCheckItems(idArray);
      console.log(idArray);
    }
    else {
      setCheckItems([]);
    }
  }
    /** 전시회 목록을 가져오는 useEffect */
    useEffect(() => {
      const data = async()=> {
        try {
          const res = await AdminApi.exhibitionList(currentPage, pageSize);
          if(res.data.statusCode === 200){
            setList([...list, ...res.data.results.productDTOList]);
            console.log(res.data.results);
            // 페이징 시작
            setTotalCount(res.data.results.totalResults); 
            // db에서 잘라준 size 별로 잘랐을때 나온 페이지 수
            setCurrentPage(res.data.results.page);
  
          }else{
            alert("리스트 조회가 안됩니다.")
        } 
      }catch (e) {
          console.log(e);
        }
      };
      data();
    }, [currentPage]); // currentpage 값이 바뀌면 렌더링 되도록 
  

    const onClickDelete=async()=>{
      if(checkItems.length<1){
        alert("체크박스 한개 이상 체크해주세요");
        navigate(0);
      } else{
        console.log(checkItems);
        const res = await AdminApi.noticeCheck(checkItems);
        console.log(res.data);
        alert("선택하신 공지사항이 삭제되었습니다.");
        try{
          console.log("통신넘어가나? :" + res.data);
          navigate(0);
        }catch(e){
          console.log(e);
        }
      } 
      setCheckItems({}); // 삭제버튼 누르고 데이터 넘기면 초기화
    };
  
    return(
        <PostBlock>
        <TopBar name="전시회 게시물 관리"/>
          <div className="exhibition-container">
          <Table bordered hover >
                <thead style={{backgroundColor : '#f5f5f5'}}>
                  <tr>
                  <th width = "40px">
                    <input type='checkbox' name='select-all' onChange={(e) => handleAllCheck(e.target.checked)}
                    // 데이터 개수와 체크된 아이템의 개수가 다를 경우 선택 해제 (하나라도 해제 시 선택 해제)
                    checked={checkItems.length === list.length ? true : false} />
                    </th>
                    <th width = "150px">카테고리</th>
                    <th>전시명</th>
                    <th>전시기간</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(({code,title,productCategory,periodStart,periodEnd}) => (
                  <tr key={code}>
                  <td><input type='checkbox' name={`select-${code}`} onChange={(e) => handleSingleCheck(e.target.checked, code)}
                   // 체크된 아이템 배열에 해당 아이템이 있을 경우 선택 활성화, 아닐 시 해제
                  checked={checkItems.includes(code) ? true : false} />
                  </td>
                    <td>{productCategory}</td>
                    <td>{title}</td>
                    <td>{periodStart+"~"+periodEnd}</td>
                </tr>
                ))}
                </tbody>
            </Table>
            <Pagination className="d-flex justify-content-center"
             total={totalCount}  //총 데이터 갯수
             current={currentPage} 
             pageSize={pageSize}
             onChange={(page) => {setCurrentPage(page); setList([]);}} //숫자 누르면 해당 페이지로 이동
             />
            <div className="post-btn-container"><button className="postBtn" onClick={onClickDelete}>삭제하기</button></div>
             </div>
        </PostBlock>
    );
}
export default PostManagement;

const PostBlock=styled.div`
  margin:0 auto;
  box-sizing: border-box;
  .exhibition-container {
    align-items: center;
    width: 70vw;
    margin : 10px;
    display: flex;
    height: 60%;
    flex-direction: column;
    text-align: center;
    text-overflow: ellipsis;
    td{
	overflow:hidden;
	white-space:nowrap;
	text-overflow:ellipsis;
	/* max-width:100px;?} */
  }
}
  .post-btn-container{
    float: right;
  }
  .postBtn{
    border: none;
    margin: 15px 0;
    margin: 20px 10px;
    background-color: #92A9BD;
    border-radius: 5px;
    width: 100px;
    height: 35px;
    font-size: 0.9rem;
  }
`;