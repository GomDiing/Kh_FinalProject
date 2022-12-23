import TopBar from "../Tool/TopBar";
import styled from "styled-components";
import { useState, useEffect} from "react";
import { Link, useNavigate,useParams} from "react-router-dom";
import AdminApi from "../../../../api/AdminApi";
import { Pagination } from "antd";
import Table from 'react-bootstrap/Table';


const NoticeList=()=>{
  const [loading, setLoading] = useState(false);
  const params = useParams().index;
  const navigate = useNavigate();

  //  리액트 페이지네이션 변수 
  const [noticeList, setNoticeList] = useState([]); //db 에서 정보 받아오기(배열에  담기)
  const [pageSize, setPageSize] = useState(6); // 한페이지에 몇개씩 있을건지
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
      noticeList.forEach((el) => idArray.push(el.index));
      setCheckItems(idArray);
      console.log(idArray);
    }
    else {
      setCheckItems([]);
    }
  }

    /** 공지 목록을 가져오는 useEffect */
  useEffect(() => {
    const noticeData = async()=> {
      setLoading(true);
      try {
        const res = await AdminApi.noticeInfo(currentPage, pageSize);
        if(res.data.statusCode === 200){
          setNoticeList([...noticeList, ...res.data.results.noticeDTOList]);
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
      setLoading(false);
    };
    noticeData();
  }, [currentPage]); // currentpage 값이 바뀌면 렌더링 되도록 

  if (loading) {
    return <div>로딩 중...</div>;
  }

  const onClickDelete=async()=>{
    try {
      if(checkItems.length<1){
        alert("체크박스 한개 이상 체크해주세요")
        navigate(0);
      } else{
        const res = await AdminApi.noticeCheck(checkItems);
        console.log(checkItems);
        alert("공지가 삭제되었습니다.")
      }
      navigate(0);
  } catch (e) {
    console.log("catch 에러 : " + e);
  }
  };

    return(
        <NoticeBlock>
        <TopBar name="공지사항 관리"/>
          <div className="notice-list-container">
          <Table striped bordered hover style={{width : '1350px'}}>
                <thead>
                  <tr>
                  <th width = "50px">
                    <input type='checkbox' name='select-all' onChange={(e) => handleAllCheck(e.target.checked)}
                    // 데이터 개수와 체크된 아이템의 개수가 다를 경우 선택 해제 (하나라도 해제 시 선택 해제)
                    checked={checkItems.length === noticeList.length ? true : false} />
                    </th>
                    <th width = "100px">글번호</th>
                    <th width = "*">제목</th>
                    <th width = "150px">작성자</th>
                    <th width = "150px">작성일</th>
                  </tr>
                </thead>
                <tbody>
                  {noticeList.map(({index,title,createTime}) => (
                  <tr key={index}>
                  <td><input type='checkbox'  name={`select-${index}`} onChange={(e) => handleSingleCheck(e.target.checked,index)}
                   // 체크된 아이템 배열에 해당 아이템이 있을 경우 선택 활성화, 아닐 시 해제
                  checked={checkItems.includes(index) ? true : false} />
                  </td>
                    <td>{index}</td>
                    <td><Link to={`/admin/noticeDetail/${index}`} style={{ textDecoration: 'none' }}>{title}</Link></td>
                    <td>관리자</td>
                    <td>{createTime}</td>
                </tr>
                ))}
                </tbody>
            </Table>
            </div>
            <Pagination className="d-flex justify-content-center"
             total={totalCount}  //총 데이터 갯수
             current={currentPage} 
             pageSize={pageSize}
             onChange={(page) => {setCurrentPage(page); setNoticeList([]);}} //숫자 누르면 해당 페이지로 이동
            />
            <div className="buttonWrap">
                <button className="noticeBtn" onClick={()=>{navigate('/admin/writeNotice')}}>작성하기</button>
                <button className="noticeBtn" onClick={onClickDelete}>삭제하기</button>
            </div>
        </NoticeBlock>
    );
}
export default NoticeList;

const NoticeBlock=styled.div`
    margin:0 auto;
  box-sizing: border-box;
  .notice-list-container {
    width: 70vw;
    margin : 10px;
    display: flex;
    height: 60%;
    flex-direction: column;
    text-align: center;
  }

    .buttonWrap{
        text-align: center;
        justify-content: center;
    }
    .noticeBtn{
      border: none;
      margin: 15px 0;
      margin: 20px 10px;
      background-color: #92A9BD;
      border-radius: 5px;
      width: 150px;
      height: 50px;
    }

`;