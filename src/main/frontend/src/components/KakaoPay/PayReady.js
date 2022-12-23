import axios from "axios";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate} from "react-router-dom";
import PayApi from "../../api/PayApi";
import { ADMIN_KEY } from "../Config";
import FindModal from "../views/LoginPage/FindModal";

// 총 가격, 비과세, 그냥 가격, 수량, 인덱스, 회원 인덱스, 회원 포인트

const PayReady = (title, total, tax, value) => {
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
      approval_url: "http://localhost:8100/payresult",
      // 결제 실패 URL
      fail_url: "http://localhost:8100/resultfalse",
      // 결제 취소 URL
      cancel_url: "http://localhost:8100/resultfalse"
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
    const [payment, setPayment] = useState({
      price : 0,
      total : 0,
      quantity : 0,
      kakaoTaxFreeAmount : 0,
      tid : window.localStorage.getItem('tid'),
      method : ''
    });
    const [modalOpen, setModalOpen] = useState(true);
    let search = window.location.search;  
    const data = {
      params: {
        cid: "TC0ONETIME",
        tid : payment.tid,
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
            console.log(response);
            setPayment((state) => ({
              ...state,
              price : response.data.amount.total / response.data.quantity,
              total : response.data.amount.total,
              quantity : response.data.quantity,
              tid : response.data.tid,
              kakaoTaxFreeAmount : response.data.amount.tax_free,
              // CARD OR MONEY 둘 중 하나의 방식이면 백에서 받을 때 KAKAOPAY라고 알려주기 위하여 KAKAOPAY로 변환해서 넘겨줌 둘 다 아니면 에러
              method : response.data.payment_method_type === 'CARD' || response.data.payment_method_type === 'MONEY' ? 'KAKAOPAY' : 'ERROR'
            }));
            setIsTrue(true);
            window.localStorage.removeItem('url');
        }).catch(error => {
            window.localStorage.removeItem('tid');
            console.log(error);
        });
    }, []);

      useEffect(() => {
        const PayReadySubmit = async () => {
          console.log(payment);
          try {
            const response = await PayApi.payReady(user.userIndex, seatIndex, payment.quantity, payment.price, user.userPoint, payment.method, payment.tid, payment.total, payment.kakaoTaxFreeAmount);
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
      }, [isTrue, seatIndex, payment, user]);

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
            {modalOpen && <FindModal open={openModal} close={closeModal} body={<Body />} />}
        </div>
    );
  };

  const PayCancel = () => {
    const location = useLocation();
    // 넘어온 티켓 정보.
    const ticket = location.state.ticket;
    const [cancelTry, setCancelTry] = useState(false);
    const [canclelTry2, setCancelTry2] = useState(false);

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => {
      setModalOpen(false);
      navigate('/', {replace:true});
    }
    
    // 공연 날짜 계산해서 수수료 하는 것은 나중에 ...
    const viewTime = ticket.view_time;
    const today = new Date();

    const isSameDate = (date1, date2) => {
      return date1.getFullYear() === date2.getFullYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();
    }

    const [data, setData] = useState({
      // 티켓 가격
      amount : ticket.final_amount / ticket.count,
      // 수량
      count : ticket.count,
      params: {
        cid: "TC0ONETIME",
        // 고유 결제 TID
        tid : ticket.kakaoTID,
        // 취소 요청 금액
        cancel_amount	: 0,
        // 취소 요청 비과세
        cancel_tax_free_amount : ticket.kakaoTaxFreeAmount,
      }
    });

    // 맨처음에 한 번만 실행
    // 공연 날짜랑 현재 날짜랑 당일 취소 x 일단 이번년도는 쉬운데 달 년도 바뀌면 망할 듯.. 임시
    useEffect(() => {
      const onPayCancelDate = (view_time, today) => {
        // 년 월 일이 같으면 안댐
        if(isSameDate(new Date(view_time), today)) {
          setCancelTry(false);
          openModal();
        } else if (new Date(view_time).getDate() - today.getDate() >= 3 && new Date(view_time).getDate() - today.getDate() > 1) {
          setData((prevstate) => ({
            // 데이터 객체를 복사
            ...prevstate,
            params : {
              // 데이터 안에 params 객체를 복사
              ...prevstate.params,
              cancel_amount : ticket.final_amount - Math.floor(ticket.final_amount / 20)
            }
          }));
          console.log('3일 전');
          setCancelTry(true);

          // 하루 전이면 수수료 cancel.final_amount -> 10% 수수료 뺴고 
        } else if (new Date(view_time).getDate() - today.getDate() === 1 && new Date(view_time).getDate() - today.getDate() > 0) {
          setData((prevstate) => ({
            // 데이터 객체를 복사
            ...prevstate,
            params : {
              // 데이터 안에 params 객체를 복사
              ...prevstate.params,
              cancel_amount : ticket.final_amount - Math.floor(ticket.final_amount / 20)
            }
          }));
          setCancelTry(true);
        }
      }
      onPayCancelDate(viewTime, today);
    }, []);

    // payCancel 들어오면 결제 취소 ! ! !
    useEffect(() => {
      const { params } = data;
      // 트루일 때만 요청 ㄱ ㄱ 
        cancelTry && axios({
            url: "https://kapi.kakao.com/v1/payment/cancel",
            method: "POST",
            headers: {
                Authorization: `KakaoAK ${ADMIN_KEY}`,
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
            params,
        }).then(response => {
          console.log(response);
          // 요청이 완료되면 백엔드에도 전송하기 위해 트루
          setCancelTry2(true);
        }).catch(error => {
          setCancelTry(false);
          setCancelTry2(false);
          openModal();
          console.log(error);
      });
    }, [cancelTry, data]);
    
    useEffect(() => {
      console.log(data.params);
      const payCancel = async () => {
        try {
          const response = await PayApi.payCancel(ticket.reserve_ticket, data.params.cancel_amount);
          console.log(response);
          if(response.data.statusCode === 200) {
            setCancelTry2(true);
          } else {
            setCancelTry(false);
            setCancelTry2(false);
            openModal();
          }
        } catch (e) {
          console.log(e);
          console.log('에러!!!');
        }
      }
      cancelTry && canclelTry2 && payCancel();
      openModal();
    }, [cancelTry, canclelTry2, data.params, ticket.reserve_ticket]);

    const Body = () => {
      return(
        <div>
          <h3>환불신청이 정상 처리되었습니다.</h3>
          <h4>환불기간은 3 ~ 7일 이내로 입금됩니다.</h4>
          <h5>창을 닫으시면 자동으로 메인페이지로 돌아갑니다.</h5>
          <Link replace={true} to='/MyPage/CList'>취소 내역 보러가기</Link>
        </div>
      );
    }

    const Body2 = () => {
      return(
        <div>
          <p style={{fontSize: '22px', color : 'silver'}}>환불신청이 처리되지 않았습니다.</p>
          <p style={{fontSize: '22px', color : 'silver'}}>회원님이 예매하신 공연이 당일이라 취소가 불가능합니다..</p>
          <p style={{fontSize: '22px', color : 'silver'}}>문의 사항이 있으시면 아래 링크를 통해 문의 부탁드립니다.</p>
          <p><Link replace={true} to='/MyPage/Contact'>문의하러 가기</Link></p>
          <p><Link replace={true} to='/MyPage/CList'>취소 내역 보러가기</Link></p>
        </div>
      );
    }
      
    return(
      <div>
        {modalOpen && cancelTry && canclelTry2 && <FindModal open={openModal} close={closeModal} body={<Body />} />}
        {modalOpen && !cancelTry && <FindModal open={openModal} close={closeModal} body={<Body2 />} />}
      </div>
    );
  };

export { PayReady, PayResult, PayCancel };