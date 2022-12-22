import axios from "axios";
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate} from "react-router-dom";
import PayApi from "../../api/PayApi";
import { seatIndexAction } from "../../util/Redux/Slice/seatIndexSlice";
import { ADMIN_KEY } from "../Config";
import PayPopup from "../views/DetailPage/Section/Popup/PayPopup";

// 총 가격, 비과세, 그냥 가격, 수량, 인덱스, 회원 인덱스, 회원 포인트

const PayReady = (title, total, tax, value, seatNumber, userInfo, price) => {
  let [data, setData] = useState({
  next_redirect_pc_url: "",
  tid: "",
  params: {
      // 가맹점 코드
      cid: "TC0ONETIME",
      // 가맹점 주문번호
      partner_order_id: "partner_order_id",
      // 가맹점 회원 id
      partner_user_id: "partner_user_id",
      // 상품 이름
      item_name: title,
      // 상품 수량
      quantity: value,
      // 총 가격
      total_amount: total,
      // 상품 비과세
      tax_free_amount: tax,
      // 결제 성공 URL
      approval_url: "http://localhost:3000/payresult",
      // 결제 실패 URL
      fail_url: "http://localhost:3000/resultfalse",
      // 결제 취소 URL
      cancel_url: "http://localhost:3000/resultfalse"
  }
  });

  useEffect(() => {
      const { params } = data;
      axios({
          url: "https://kapi.kakao.com/v1/payment/ready",
          method: "POST",
          headers: {
              Authorization: `KakaoAK ${ADMIN_KEY}`,
              "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
              },
              params,
      }).then(response => {
        const {
            data: { next_redirect_pc_url, tid },
        } = response;
        window.localStorage.setItem("tid", tid);
        window.localStorage.setItem('url', next_redirect_pc_url);
        setData({ next_redirect_pc_url, tid });
      }).catch(error => {
        console.log(error);
      });
  }, []);
}

  const PayResult = () => {
    const [isTrue, setIsTrue] = useState(false);
    const user = useSelector((state) => state.user.info);
    const seatIndex = useSelector((state) => state.seat.index);
    const [test, setTest] = useState({
      price : 0,
      total : 0,
      quantity : 0,
      tid : window.localStorage.getItem('tid'),
      method : ''
    });
    const [modalOpen, setModalOpen] = useState(true);
    let search = window.location.search;
    const data = {
      params: {
        cid: "TC0ONETIME",
        tid : test.tid,
        partner_order_id: "partner_order_id",
        // 가맹점 회원 id
        partner_user_id: "partner_user_id",
        // 결제승인 요청을 인정하는 토큰
        pg_token: search.split("=")[1],
      }
    };
    const navigate = useNavigate();
    const openModal = () => setModalOpen(true);
    const closeModal = () => {
    setModalOpen(false);
    navigate('/', {replace:true});
    }
    
    useEffect(() => {
        const { params } = data;
        axios({
            url: "https://kapi.kakao.com/v1/payment/approve",
            method: "POST",
            headers: {
                Authorization: `KakaoAK ${ADMIN_KEY}`,
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
            params,
        }).then(response => {
            setTest((state) => ({
              ...state,
              price : response.data.amount.total / response.data.quantity,
              total : response.data.amount.total,
              quantity : response.data.quantity,
              tid : response.data.tid,
              // CARD OR MONEY 둘 중 하나의 방식이면 백에서 받을 때 KAKAOPAY라고 알려주기 위하여 KAKAOPAY로 변환해서 넘겨줌 둘 다 아니면 에러
              method : response.data.payment_method_type === 'CARD' || response.data.payment_method_type === 'MONEY' ? 'KAKAOPAY' : 'ERROR'
            }));
            setIsTrue(true);
            window.localStorage.removeItem('url');
        }).catch(error => {
            console.log(error);
        });
    }, []);

      useEffect(() => {
        const PayReadySubmit = async () => {
          console.log(seatIndex);
          try {
            const response = await PayApi.payReady(user.userIndex, seatIndex, test.quantity, test.price, user.userPoint, test.method, test.tid, test.total);
            console.log(response);
            if(response.data.statusCode === 200) {
              window.localStorage.removeItem('tid');
            }
          } catch (e) {
            window.localStorage.removeItem('tid');
            console.log(e);
            console.log('에러!!!');
          }
        }
        isTrue && PayReadySubmit();
      }, [isTrue, seatIndex, test, user]);

    const Body = () => {
        return(
            <div>
                <h1>결제가 정상 진행 되었습니다.</h1>
                <h3>창을 닫으시면 자동으로 메인페이지로 돌아갑니다.</h3>
                <Link replace={true} to='/MyPage/RList'>결제 내역 보러가기</Link>
            </div>
        );
    }
    
    return(
        <div>
            {modalOpen && <PayPopup open={openModal} close={closeModal} body={<Body />} />}
        </div>
    );
  };

const PayCancel = () => {
  // amount : amount,
  // discount : discount,
  // finalAmount : finalAmount,
  // method : method,
  // kakaoTID : TID
  const location = useLocation();
  // 넘어온 티켓 정보.
  const ticket = location.state.ticket;
  console.log(ticket);
  
  // 공연 날짜
  const reserveTime = ticket.reserve_time;
  const today = new Date();
  const isSameDate = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear()
       && date1.getMonth() === date2.getMonth()
       && date1.getDate() === date2.getDate();
  }
  // 공연 날짜랑 현재 날짜랑 당일 취소 x 일단 이번년도는 쉬운데 달 년도 바뀌면 망할 듯.. 임시
  if(isSameDate(new Date(reserveTime), today)) {
    alert('당일 취소 x');
  } else if (new Date(2022, 12 - 1, 29).getDate() - today.getDate() >= 7) {
    alert('공연 시작 7일 넘게 남으면 무료 취소')
  } else if (new Date(reserveTime).getDate() - today.getDate() >= 3 && new Date(reserveTime).getDate() - today.getDate() > 1) {
    alert('공연 시작 하루는 아니고 3일 남았거나 3일보다 적을 경우 수수료 5%')
  } else if (new Date(reserveTime).getDate() - today.getDate() === 1 && new Date(reserveTime).getDate() - today.getDate() > 0) {
    alert('공연 시작 하루 남았으면 수수료 10%');
  }

  const cancel = {
    // 상품 금액
    amount : ticket.final_amount / ticket.count,
    // 총 금액
    final_amount : ticket.final_amount,
    // 상품 수량
    count : ticket.count,
    // 비과세 총 금액의 5%
  };
    
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => {
  setModalOpen(false);
  navigate('/', {replace:true});
  }
  const[data, setData] = useState({
      next_redirect_pc_url : "",
      tid: "",
      params: {
        cid: "TC0ONETIME",
        tid: window.localStorage.getItem("tid"),
        // 결제 총 금액을 넘겨줌
        cancel_amount: ticket,
        cancel_tax_free_amount:10000,
      }
    });

    useEffect(() => {
        const { params } = data;

        axios({
            url: "https://kapi.kakao.com/v1/payment/cancel",
            method: "POST",
            headers: {
                Authorization: `KakaoAK ${ADMIN_KEY}`,
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
            params
        }).then(response => {
            const {
                data: { tid }
            } = response;
            setData({ tid });
            console.log(tid);
        });
    });

    const Body = () => {
      return(
        <div>
          <h1>환불신청이 정상 처리되었습니다.</h1>
          <h2>환불기간은 3 ~ 7일 이내로 입금됩니다.</h2>
          <h3>창을 닫으시면 자동으로 메인페이지로 돌아갑니다.</h3>
          <Link replace={true} to='/MyPage/RList'>취소 내역 보러가기</Link>
        </div>
      );
    }
    
    return(
      <div>
        {modalOpen && <PayPopup open={openModal} close={closeModal} body={<Body />} />}
      </div>
    );

    // return(
    //     <div>
    //         <h1>결제 취소가 완료 되었습니다.</h1>
    //         <Link to='/MyPage/CList'>취소 내역 확인하러 가기</Link>
    //         <Link to='/'>메인으로 돌아가기</Link>
    //     </div>
    // );
  };

export { PayReady, PayResult, PayCancel };