import styled from "styled-components";
import TopBar from "./Tool/TopBar";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminApi from "../../../api/AdminApi";
import { useNavigate} from "react-router-dom";
import { Pagination } from "antd";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

const BlackList=()=>{
  const navigate = useNavigate();
  // 페이지네이션 변수
  const [memberList, setMemberList] = useState([]);
  const [pageSize, setPageSize] = useState(12); // 한페이지에 몇개씩 있을건지
  const [totalCount, setTotalCount] = useState(0); // 총 데이터 숫자
  const [currentPage, setCurrentPage] = useState(1); // 현재 몇번째 페이지인지


  // 체크박스 변수
  const [checkItems, setCheckItems] = useState([]); 
  // 체크박스 단일 선택
  const handleSingleCheck = (checked, obj) => {
    if (checked) {
      setCheckItems(prev => [...prev, obj]);
      console.log(obj); // 선택한 db 값 
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
      memberList.forEach((el) => idArray.push(el.index));
      setCheckItems(idArray);
    }
    else {
      // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
      setCheckItems([]);
    }
  }
//  블랙리스트 목록 가져오는 useEffect
  useEffect(() => {
    const memberData = async()=> {
      try {
        const res = await AdminApi.totalBlackMember(currentPage, pageSize);
        if(res.data.statusCode === 200){
          setMemberList([...memberList, ...res.data.results.memberDTOList]);
          console.log(setMemberList);
          // 페이징 시작
          setTotalCount(res.data.results.totalResults); 
          // db에서 잘라준 size 별로 잘랐을때 나온 페이지 수
          setCurrentPage(res.data.results.page);
        } else{
          alert("리스트 조회가 안됩니다.")
        }
      } catch (e) {
        console.log(e);
      }
    };
    memberData();
  }, [currentPage]);

  const onClickDelete=async()=>{
    if(checkItems.length<1){
      alert("체크박스 한개 이상 체크해주세요")
      navigate(0);
    } else{
      console.log(checkItems);
      const res = await AdminApi.deleteMemberAdmin(checkItems);
      alert("선택하신 회원이 탈퇴되었습니다.");
      try{
        console.log("통신넘어가나? :" + res.results);
        navigate(0);
      }catch(e){
        console.log(e);
      }
    } 
    setCheckItems({}); // 삭제버튼 누르고 데이터 넘기면 초기화
  };
  
    return(
        <MemberBlock>
        <TopBar name="블랙리스트 관리"/>
        <div className="blackList-container">
            <Table striped bordered hover>
                <thead>
                  <tr>
                  <th width = "30px">
                    <input type='checkbox' name='select-all' onChange={(e) => handleAllCheck(e.target.checked)}
                    // 데이터 개수와 체크된 아이템의 개수가 다를 경우 선택 해제 (하나라도 해제 시 선택 해제)
                    checked={checkItems.length === memberList.length ? true : false} />
                    </th>
                    <th width = "100px">아이디</th>
                    <th width = "100px">이름</th>
                    <th width = "150px">이메일</th>
                    <th width = "150px">가입일</th>
                    <th width = "100px">신고횟수</th>
                  </tr>
                </thead>
                <tbody>
                {memberList.map(({index,id,name,email,createTime,memberAccuseCount}) => (
                <tr key={index}>
                  <td><input type='checkbox' name={`select-${index}`} onChange={(e) => handleSingleCheck(e.target.checked, index)}
                   // 체크된 아이템 배열에 해당 아이템이 있을 경우 선택 활성화, 아닐 시 해제
                  checked={checkItems.includes(index) ? true : false} />
                  </td>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>{createTime}</td>
                    <td>{memberAccuseCount} 회</td>
                </tr>
                ))}
                </tbody>
            </Table>
            </div>
            <Pagination className="d-flex justify-content-center"
            total={totalCount}  //총 데이터 갯수
            current={currentPage} 
            pageSize={pageSize}
            onChange={(page) => {setCurrentPage(page); setMemberList([]);}}
            />
            <div className="black-btn-container"><button className="blackBtn" onClick={onClickDelete}>회원탈퇴</button></div>
        </MemberBlock>
    );

}
export default BlackList;

const MemberBlock=styled.div`
  margin:0 auto;
  box-sizing: border-box;
  .blackList-container {
    width: 70vw;
    margin : 10px;
    display: flex;
    height: 60%;
    flex-direction: column;
    text-align: center;
  }
  .black-btn-container{
    float: right;
  }
  .blackBtn{
    border: none;
    margin: 15px 0;
    margin: 20px 10px;
    background-color: #92A9BD;
    border-radius: 5px;
    width: 150px;
    height: 50px;
  }
`;