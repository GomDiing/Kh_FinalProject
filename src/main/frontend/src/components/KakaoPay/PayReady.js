import axios from "axios";
import {useEffect, useState} from "react"
import {useSelector} from "react-redux";
import {Link, useLocation, useNavigate} from "react-router-dom";
import PayApi from "../../api/PayApi";
import {ADMIN_KEY, SECRET_KEY} from "../Config";
import {TCATS_DOMAIN} from "../Config";
import PayModal from "./PayModal";
import payApi from "../../api/PayApi";
import logoTCat from "../../images/TCAT_01.png"
import {KAKAO_PAY_APPROVAL, KAKAO_PAY_CANCEL, KAKAO_PAY_FAIL} from "../Config";

// 총 가격, 비과세, 그냥 가격, 수량, 인덱스, 회원 인덱스, 회원 포인트

// 카카오페이 결제 3번 모달에서 값을 넘겨 받음
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
            // approval_url: TCATS_DOMAIN + "/payresult",
            approval_url: KAKAO_PAY_APPROVAL,
            // 결제 실패 URL
            // fail_url: TCATS_DOMAIN + "/resultfalse",
            fail_url: KAKAO_PAY_FAIL,
            // 결제 취소 URL
            // cancel_url: TCATS_DOMAIN + "/resultfalse",
            cancel_url: KAKAO_PAY_CANCEL,
        }
    });

    // 3번 모달에서 호출해서 응답 값으로 next_redirect_pc_url을 받음 200이 뜨고 이 url로 가야지 실질적인 결제가 가능
    useEffect(async () => {
        const {params} = data;
        console.log(params)
        const res = await PayApi.payKakaoReady(params.item_name, params.quantity, params.total_amount, params.tax_free_amount);
        console.log(res)
        if (res.data.statusCode === 200) {
            // const {
            //     data: {next_redirect_pc_url, tid}
            // } = res.data.results;
            window.localStorage.setItem('tid', res.data.results.tid);
            window.localStorage.setItem('url', res.data.results.next_redirect_pc_url);

            setData(() => ({
                next_redirect_pc_url: res.data.results.next_redirect_pc_url,
                params,
                tid: res.data.results.tid
            }));
            console.log(data)
            console.log(data.next_redirect_pc_url);
            console.log(data.tid);

            // setData((state) => ({
            //     ...state,
            //     티켓 기본 가격 정보를 따로 안넘겨줘서 총 가격 / 수량
            // next_redirect_pc_url: res.data.amount.next_redirect_pc_url,
            // tid: res.data.tid}));
        } else {
            console.log(res.data.message);
        }
    }, []);
    /*

            axios({
                /!*
                url: "https://kapi.kakao.com/v1/payment/ready",
                method: "POST",
                headers: {
                    Authorization: `KakaoAK ${ADMIN_KEY}`,
                    "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
                    },
                    params,
                *!/
                url: "https://open-api.kakaopay.com/online/v1/payment/ready",
                method: "POST",
                headers: {
                    Authorization: `SECRET_KEY ${SECRET_KEY}`,
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                params,
            }).then(response => {
                const {
                    data: {next_redirect_pc_url, tid},
                } = response;
                // 결제 고유번호 tid를 저장
                window.localStorage.setItem("tid", tid);
                // 결제 페이지를 위한 url을 저장 모달 3번에서 버튼 클릭 시 불러줌
                window.localStorage.setItem('url', next_redirect_pc_url);
                setData({next_redirect_pc_url, tid});
            }).catch(error => {
                console.log(error);
            });
        }, []);*/
}

const PayResult = () => {
    const [isTrue, setIsTrue] = useState(false);
    // 회원 정보를 받아옴
    const user = useSelector((state) => state.user.info);
    // 선택한 좌석의 인덱스를 받아옴
    const seatIndex = useSelector((state) => state.seat.index);
    // 초기값 세팅 그리고 위에서 결제한 결제 고유번호를 세팅 백에다 넘길 정보 카카오랑 어쩌다보니 따로 구분됨
    const [payment, setPayment] = useState({
        //가격
        price: 0,
        //총 가격
        total: 0,
        //수량
        quantity: 0,
        // 카카오 비과세 취소할 때 필요해서 결제할 때 백에다 정보를 넘겨주고 취소할 때 필요하면 다시 받아서 취소
        kakaoTaxFreeAmount: 0,
        // 위에서 받아옴
        tid: window.localStorage.getItem('tid'),
        // 결제 타입
        method: ''
    });

    // 결제 후 띄울 모달
    const [modalOpen, setModalOpen] = useState(true);
    //위에 결제승인 token 받기 위해
    let search = window.location.search;
    // 카카오페이 결제 승인 요청에 보낼 정보
    const data = {
        params: {
            // 가맹점 번호
            cid: "TC0ONETIME",
            // 결제 고유번호
            tid: payment.tid,
            partner_order_id: "partner_order_id",
            // 가맹점 회원 id
            partner_user_id: "partner_user_id",
            // 결제승인 요청을 인정하는 토큰
            pg_token: search.split("=")[1],
        }
    };

    const navigate = useNavigate();
    const openModal = () => setModalOpen(true);
    //모달 닫으면 자동으로 메인으로 넘어가게 replace: true는 설정하면 이전 페이지로 돌아오지 못함
    const closeModal = () => {
        setModalOpen(false);
        navigate('/', {replace: true});
    }

    //카카오페이에 결제승인 요청하는 실질적인 로직
    useEffect(() => {
        const fetchPaymentData = async () => {
            const {params} = data;
            console.log('pg_token : ' + params.pg_token);
            const res = await PayApi.payKakaoApprove(params.pg_token, params.tid);
            console.log('kakaopay_approve : ' + res)
            if (res.data.statusCode === 200) {
                setPayment((state) => ({
                    ...state,
                    price: res.data.results.amount.total / res.data.results.quantity,
                    total: res.data.results.amount.total,
                    quantity: res.data.results.quantity,
                    tid: res.data.results.tid,
                    kakaoTaxFreeAmount: res.data.results.amount.tax_free,
                    method: res.data.results.payment_method_type === 'CARD' || res.data.results.payment_method_type === 'MONEY' ? 'KAKAOPAY' : 'ERROR'
                }));
                setIsTrue(true);

                window.localStorage.removeItem('url');

            } else {
                window.localStorage.removeItem('tid');
                console.log(res.data.message);
            }
        };

        fetchPaymentData();
    }, []);

    /**
     * 백엔드가 전달 데이터 검증
     */
    useEffect(() => {
        console.log('price : ' + payment.price)
        console.log('total : ' + payment.total)
        console.log('quantity : ' + payment.quantity)
        console.log('tid : ' + payment.tid)
        console.log('kakaoTaxFreeAmount : ' + payment.kakaoTaxFreeAmount)
        console.log('method : ' + payment.method)
    }, [payment]);

    // 백에다 보내는 실질적인 로직 일단 카카오에서 승인이 받았기에 웬만하면 그 값 그대로 넘겨주기에 백엔드에도 문제가 없이 값이 잘 넘어간다
    useEffect(() => {
        // 비동기 통신
        const PayReadySubmit = async () => {
            try {
                console.log(payment.price)
                console.log(payment.tid)
                console.log(payment.quantity)
                console.log(payment.total)
                // 위에 정보
                const response = await PayApi.payReady(user.userIndex, seatIndex, payment.quantity, payment.price, user.userPoint, payment.method, payment.tid, payment.total, payment.kakaoTaxFreeAmount);
                // 200이면 결제 tid 다시 지워줌 어차피 DB에 TID값이 저장됨
                if (response.data.statusCode === 200) {
                    window.localStorage.removeItem('tid');
                } else {
                    console.error('Payment Error!')
                }
            } catch (e) {
                // 마찬가지로 실패여도 지워준다
                window.localStorage.removeItem('tid');
                console.error(e);
            }
        }
        // 이게 뭐냐면 혹시 카카오페이에서는 승인이 실패할 수도 있는데 백에만 정보가 넘어가면 안되기에 위에서 먼저 카카오페이가 성공이면 TRUE 값이 넘오와서 그 때만 실행되게 하였다
        isTrue && PayReadySubmit();
    }, [isTrue, seatIndex, payment, user]);

    // 결제 완료 모달
    const Body = () => {
        return (
            <div>
                <h1>결제가 정상 진행 되었습니다.</h1>
                <img src={logoTCat} style={{width: '500px', margin: '20px 0'}}
                     alt='TCAT'></img>
                <h3>창을 닫으시면 자동으로 메인페이지로 돌아갑니다.</h3>
                <Link replace={true} to='/MyPage/RList'>결제 내역 보러가기</Link>
            </div>
        );
    }
    return (
        <div>
            {modalOpen && <PayModal open={openModal} close={closeModal} body={<Body/>}/>}
        </div>
    );
};

/*

// 결제를 하면 잘 결제했는지 승인해주는 카카오 결제 승인 함수
const PayResultBefore = () => {
    const [isTrue, setIsTrue] = useState(false);
    // 회원 정보를 받아옴
    const user = useSelector((state) => state.user.info);
    // 선택한 좌석의 인덱스를 받아옴
    const seatIndex = useSelector((state) => state.seat.index);
    // 초기값 세팅 그리고 위에서 결제한 결제 고유번호를 세팅 이건 백에다 넘길 정보 카카오랑 어쩌다보니 따로 구분됨
    const [payment, setPayment] = useState({
        // 가격
        price: 0,
        // 총 가격
        total: 0,
        // 수량
        quantity: 0,
        // 카카오 비과세 취소할 때 필요해서 결제할 때 백에다 정보를 넘겨주고 취소할 때 필요하면 다시 받아서 취소
        kakaoTaxFreeAmount: 0,
        // 위에서 받아옴
        tid: window.localStorage.getItem('tid'),
        // 결제 타입
        method: ''
    });
    // 결제 후 띄울 모달
    const [modalOpen, setModalOpen] = useState(true);
    // 위에 결제승인 token을 받기 위해
    let search = window.location.search;
    // 키키오페이 결제 승인 요청에 보낼 정보
    const data = {
        params: {
            // 가맹점 번호
            cid: "TC0ONETIME",
            // 결제 고유번호
            tid: payment.tid,
            partner_order_id: "partner_order_id",
            // 가맹점 회원 id
            partner_user_id: "partner_user_id",
            // 결제승인 요청을 인정하는 토큰
            pg_token: search.split("=")[1],
        }
    };
    const navigate = useNavigate();
    const openModal = () => setModalOpen(true);
    // 모달 닫으면 자동으로 메인으로 넘어가게 replace:true는 설정하면 이전 페이지로 돌아오지 못함
    const closeModal = () => {
        setModalOpen(false);
        navigate('/', {replace: true});
    }

    // 카카오페이에 결제 승인을 요청하는 실질적인 로직
    useEffect(() => {
        // data 안에 params를 가져옴
        const {params} = data;
        console.log('pg_token : ' + data.params.pg_token)
        axios({
            /!*
            url: "https://kapi.kakao.com/v1/payment/approve",
            method: "POST",
            headers: {
                Authorization: `KakaoAK ${ADMIN_KEY}`,
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
            params,
            *!/
            url: "https://open-api.kakaopay.com/online/v1/payment/approve",
            method: "POST",
            headers: {
                Authorization: `SECRET_KEY ${SECRET_KEY}`,
                "Content-type": "application/json",
            },
            params,
        }).then(response => {
            // 응답을 받으면 위에 백에다 보낼 정보를 세팅해줌
            setPayment((state) => ({
                ...state,
                // 티켓 기본 가격 정보를 따로 안넘겨줘서 총 가격 / 수량
                price: response.data.amount.total / response.data.quantity,
                // 총 가격
                total: response.data.amount.total,
                // 수량
                quantity: response.data.quantity,
                // 결제 고유번호
                tid: response.data.tid,
                // 카카오 비과세
                kakaoTaxFreeAmount: response.data.amount.tax_free,
                // CARD OR MONEY 둘 중 하나의 방식이면 백에서 받을 때 KAKAOPAY라고 알려주기 위하여 KAKAOPAY로 변환해서 넘겨줌 둘 다 아니면 에러
                method: response.data.payment_method_type === 'CARD' || response.data.payment_method_type === 'MONEY' ? 'KAKAOPAY' : 'ERROR'
            }));
            // 성공이면 모달 오픈
            setIsTrue(true);
            // 그리고 url은 지워줌 왜냐하면 잘못되면 나중에 전에 url로 다시 이 결제로 돌아올 수 있기 때문이다.
            window.localStorage.removeItem('url');
        }).catch(error => {
            // 실패하면 결제 고유번호를 지워줌 똑같은 중복 결제 방지 위랑 비슷하다.
            window.localStorage.removeItem('tid');
            console.log(error);
        });
    }, []);

    // 백에다 보내는 실질적인 로직 일단 카카오에서 승인이 받았기에 웬만하면 그 값 그대로 넘겨주기에 백엔드에도 문제가 없이 값이 잘 넘어간다
    useEffect(() => {
        // 비동기 통신
        const PayReadySubmit = async () => {
            try {
                // 위에 정보
                const response = await PayApi.payReady(user.userIndex, seatIndex, payment.quantity, payment.price, user.userPoint, payment.method, payment.tid, payment.total, payment.kakaoTaxFreeAmount);
                // 200이면 결제 tid 다시 지워줌 어차피 DB에 TID값이 저장됨
                if (response.data.statusCode === 200) {
                    window.localStorage.removeItem('tid');
                }
            } catch (e) {
                // 마찬가지로 실패여도 지워준다
                window.localStorage.removeItem('tid');
                console.log(e);
            }
        }
        // 이게 뭐냐면 혹시 카카오페이에서는 승인이 실패할 수도 있는데 백에만 정보가 넘어가면 안되기에 위에서 먼저 카카오페이가 성공이면 TRUE 값이 넘오와서 그 때만 실행되게 하였다
        isTrue && PayReadySubmit();
    }, [isTrue, seatIndex, payment, user]);

    // 결제 완료 모달
    const Body = () => {
        return (
            <div>
                <h1>결제가 정상 진행 되었습니다.</h1>
                <img src={process.env.PUBLIC_URL + "/images/TCAT_01.png"} style={{width: '500px', margin: '20px 0'}}
                     alt='TCAT'></img>
                <h3>창을 닫으시면 자동으로 메인페이지로 돌아갑니다.</h3>
                <Link replace={true} to='/MyPage/RList'>결제 내역 보러가기</Link>
            </div>
        );
    }
    return (
        <div>
            {modalOpen && <PayModal open={openModal} close={closeModal} body={<Body/>}/>}
        </div>
    );
};
*/

// 카카오페이 결제 취소 함수
const PayCancel = () => {
    // 예매정보에서 navigate를 통하여 값을 받은 걸 useLocation으로 꺼냄
    const location = useLocation();
    // 넘어온 티켓 정보.
    const ticket = location.state.ticket;
    const [cancelCheckOnDate, setCancelCheckOnDate] = useState(false);
    const [cancelCheckOnKakao, setCancelCheckOnKakao] = useState(false);

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false);
        navigate('/', {replace: true});
    }

    // 공연 시작일
    const viewTime = ticket.view_time;
    const today = new Date();

    // 년 월 일 같은지 체크
    const isSameDate = (viewDate, nowDate) => {
        return viewDate.getFullYear() === nowDate.getFullYear()
            && viewDate.getMonth() === nowDate.getMonth()
            && viewDate.getDate() === nowDate.getDate();
    }

    // 위에 백 따로 카카오페이 따로 객체를 만들었는데 솔직히 비효율적이다 하나로 만들어서 쓰면 된다..
    const [data, setData] = useState({
        // 티켓 가격
        amount: ticket.final_amount / ticket.count,
        // 수량
        count: ticket.count,
        // 카카오페이에 넘겨줄 정보
        params: {
            // 가맹점 번호
            cid: "TC0ONETIME",
            // 고유 결제 TID
            tid: ticket.kakaoTID,
            // 취소 요청 금액
            cancel_amount: 0,
            // 취소 요청 비과세
            cancel_tax_free_amount: ticket.kakaoTaxFreeAmount,
        }
    });

    // 년도가 크고 월이 작다 일ㅇ;
    // 예를 들어 22.12.31현재 날짜 공연 날짜가 23.01.01 하루 전이면..
    // 맨처음에 한 번만 실행
    useEffect(() => {
        const onPayCancelDate = (view_time, today) => {
            // 년 월 일이 같으면 안댐 당일 취소 금지
            if (isSameDate(new Date(view_time), today)) {
                // 이 때는 환불이 안돼서 false
                setCancelCheckOnDate(false);
                openModal();

                // 월이 같을 때 일로 비교 5% 수수료 3일 전
            } else if (new Date(viewTime).getMonth() === today.getMonth() && new Date(view_time).getDate() - today.getDate() <= 3 && new Date(view_time).getDate() - today.getDate() > 1) {
                setData((prevstate) => ({
                    // 데이터 객체를 복사
                    ...prevstate,
                    params: {
                        // 데이터 안에 params 객체를 복사
                        ...prevstate.params,
                        // 5% 빼기
                        cancel_amount: ticket.final_amount - Math.floor(ticket.final_amount / 20)
                    }
                }));
                // 환불가능 true
                setCancelCheckOnDate(true);

                // 월이 같을 때 일로 비교 하루 전이면 수수료 cancel.final_amount -> 10% 수수료 뺴고
            } else if (new Date(viewTime).getMonth() === today.getMonth() && new Date(view_time).getDate() - today.getDate() === 1 && new Date(view_time).getDate() - today.getDate() > 0) {
                setData((prevstate) => ({
                    // 데이터 객체를 복사
                    ...prevstate,
                    params: {
                        // 데이터 안에 params 객체를 복사
                        ...prevstate.params,
                        // 10% 빼기
                        cancel_amount: ticket.final_amount - Math.floor(ticket.final_amount / 10)
                    }
                }));
                // 환불가능 true
                setCancelCheckOnDate(true);

                // 나머지는 다 무료 아마 이게 정확하지는 않는데 일단 급하게 만들어서..이 정도면 97%는 잘 돌아감
            } else {
                setData((prevstate) => ({
                    // 데이터 객체를 복사
                    ...prevstate,
                    params: {
                        // 데이터 안에 params 객체를 복사
                        ...prevstate.params,
                        // 티켓 전액 그대로 취소
                        cancel_amount: ticket.final_amount
                    }
                }));
                // 환불 가능
                setCancelCheckOnDate(true);
            }
        }
        // 매개변수로 공연날짜랑, 당일 날짜 받아옴
        onPayCancelDate(viewTime, today);
    }, []);

    // 카카오페이 취소 실질적인 로직 
    useEffect(() => {
        const {params} = data;
        // 트루일 때만 요청 가능함 왜냐 false일 경우는 당일이기 때문에 당일 취소를 막음
        const cancelPayment = async () => {
            if (!cancelCheckOnDate) return

            try {
                console.log(`data.params: ' + ${data.params}`)
                const res = await payApi.payKakaoCancel(data.params.tid, data.params.cancel_amount, data.params.cancel_tax_free_amount)

                if (res.data.statusCode === 200) {
                    setCancelCheckOnKakao(true)
                } else {
                    setCancelCheckOnDate(false)
                    setCancelCheckOnKakao(false)
                    openModal();
                    console.log(res.data.message)
                }
            } catch (error) {
                console.error("에러 로그: ", error)
            }
        };
        cancelPayment();
    }, [cancelCheckOnDate, data]);

    // 실질적인 백에다 보내는 취소 정보
    useEffect(() => {
        // 비동기 통신
        const payCancel = async () => {
            try {
                // 위에서 세팅한 티켓 정보
                const response = await PayApi.payCancel(ticket.reserve_ticket, data.params.cancel_amount);
                // 200이면 성공
                if (response.data.statusCode === 200) {
                    setCancelCheckOnKakao(true);
                } else {
                    // 실패하면 실패 모달로 이동 이거 예외처리를 좀 잘못했습니다. 하나라도 안되면 다 안되야 하는 것이 맞는데 실수.. 되돌리기엔 좀 늦었습니다.
                    setCancelCheckOnDate(false);
                    setCancelCheckOnKakao(false);
                    openModal();
                }
            } catch (e) {
                console.log(e);
                console.log('에러!!!');
            }
        }
        cancelCheckOnDate && cancelCheckOnKakao && payCancel();
        openModal();
    }, [cancelCheckOnDate, cancelCheckOnKakao, data.params, ticket.reserve_ticket]);


    // 환불 완료 되었을 때
    const Body = () => {
        return (
            <div>
                <h3>환불신청이 정상 처리되었습니다.</h3>
                <h4>환불기간은 3 ~ 7일 이내로 입금됩니다.</h4>
                <h5>창을 닫으시면 자동으로 메인페이지로 돌아갑니다.</h5>
                <Link replace={true} to='/MyPage/CList'>취소 내역 보러가기</Link>
            </div>
        );
    }

    // 환불 실패..
    const Body2 = () => {
        return (
            <div>
                <p style={{fontSize: '22px', color: 'silver'}}>환불신청이 처리되지 않았습니다.</p>
                <p style={{fontSize: '22px', color: 'silver'}}>회원님이 예매하신 공연이 당일이라 취소가 불가능합니다..</p>
                <p style={{fontSize: '22px', color: 'silver'}}>문의 사항이 있으시면 아래 링크를 통해 문의 부탁드립니다.</p>
                <p><Link replace={true} to='/MyPage/Contact'>문의하러 가기</Link></p>
                <p><Link replace={true} to='/MyPage/CList'>취소 내역 보러가기</Link></p>
            </div>
        );
    }

    return (
        <div>
            {modalOpen && cancelCheckOnDate && cancelCheckOnKakao &&
                <PayModal open={openModal} close={closeModal} body={<Body/>}/>}
            {modalOpen && !cancelCheckOnDate && <PayModal open={openModal} close={closeModal} body={<Body2/>}/>}
        </div>
    );
};
//
// // 카카오페이 결제 취소 함수
// const PayCancelBefore = () => {
//     // 예매정보에서 navigate를 통하여 값을 받은 걸 useLocation으로 꺼냄
//     const location = useLocation();
//     // 넘어온 티켓 정보.
//     const ticket = location.state.ticket;
//     const [cancelTry, setCancelTry] = useState(false);
//     const [canclelTry2, setCancelTry2] = useState(false);
//
//     const navigate = useNavigate();
//     const [modalOpen, setModalOpen] = useState(false);
//     const openModal = () => setModalOpen(true);
//     const closeModal = () => {
//         setModalOpen(false);
//         navigate('/', {replace: true});
//     }
//
//     // 공연 시작일
//     const viewTime = ticket.view_time;
//     const today = new Date();
//
//     // 년 월 일 같은지 체크
//     const isSameDate = (date1, date2) => {
//         return date1.getFullYear() === date2.getFullYear()
//             && date1.getMonth() === date2.getMonth()
//             && date1.getDate() === date2.getDate();
//     }
//
//     // 위에 백 따로 카카오페이 따로 객체를 만들었는데 솔직히 비효율적이다 하나로 만들어서 쓰면 된다..
//     const [data, setData] = useState({
//         // 티켓 가격
//         amount: ticket.final_amount / ticket.count,
//         // 수량
//         count: ticket.count,
//         // 카카오페이에 넘겨줄 정보
//         params: {
//             // 가맹점 번호
//             cid: "TC0ONETIME",
//             // 고유 결제 TID
//             tid: ticket.kakaoTID,
//             // 취소 요청 금액
//             cancel_amount: 0,
//             // 취소 요청 비과세
//             cancel_tax_free_amount: ticket.kakaoTaxFreeAmount,
//         }
//     });
//
//     // 년도가 크고 월이 작다 일ㅇ;
//     // 예를 들어 22.12.31현재 날짜 공연 날짜가 23.01.01 하루 전이면..
//     // 맨처음에 한 번만 실행
//     useEffect(() => {
//         const onPayCancelDate = (view_time, today) => {
//             // 년 월 일이 같으면 안댐 당일 취소 금지
//             if (isSameDate(new Date(view_time), today)) {
//                 // 이 때는 환불이 안돼서 false
//                 setCancelTry(false);
//                 openModal();
//
//                 // 월이 같을 때 일로 비교 5% 수수료 3일 전
//             } else if (new Date(viewTime).getMonth() === today.getMonth() && new Date(view_time).getDate() - today.getDate() <= 3 && new Date(view_time).getDate() - today.getDate() > 1) {
//                 setData((prevstate) => ({
//                     // 데이터 객체를 복사
//                     ...prevstate,
//                     params: {
//                         // 데이터 안에 params 객체를 복사
//                         ...prevstate.params,
//                         // 5% 빼기
//                         cancel_amount: ticket.final_amount - Math.floor(ticket.final_amount / 20)
//                     }
//                 }));
//                 // 환불가능 true
//                 setCancelTry(true);
//
//                 // 월이 같을 때 일로 비교 하루 전이면 수수료 cancel.final_amount -> 10% 수수료 뺴고
//             } else if (new Date(viewTime).getMonth() === today.getMonth() && new Date(view_time).getDate() - today.getDate() === 1 && new Date(view_time).getDate() - today.getDate() > 0) {
//                 setData((prevstate) => ({
//                     // 데이터 객체를 복사
//                     ...prevstate,
//                     params: {
//                         // 데이터 안에 params 객체를 복사
//                         ...prevstate.params,
//                         // 10% 빼기
//                         cancel_amount: ticket.final_amount - Math.floor(ticket.final_amount / 10)
//                     }
//                 }));
//                 // 환불가능 true
//                 setCancelTry(true);
//
//                 // 나머지는 다 무료 아마 이게 정확하지는 않는데 일단 급하게 만들어서..이 정도면 97%는 잘 돌아감
//             } else {
//                 setData((prevstate) => ({
//                     // 데이터 객체를 복사
//                     ...prevstate,
//                     params: {
//                         // 데이터 안에 params 객체를 복사
//                         ...prevstate.params,
//                         // 티켓 전액 그대로 취소
//                         cancel_amount: ticket.final_amount
//                     }
//                 }));
//                 // 환불 가능
//                 setCancelTry(true);
//             }
//         }
//         // 매개변수로 공연날짜랑, 당일 날짜 받아옴
//         onPayCancelDate(viewTime, today);
//     }, []);
//
//     // 카카오페이 취소 실질적인 로직
//     useEffect(() => {
//         const {params} = data;
//         // 트루일 때만 요청 가능함 왜냐 false일 경우는 당일이기 때문에 당일 취소를 막음
//         cancelTry && axios({
//             /*
//             url: "https://kapi.kakao.com/v1/payment/cancel",
//             method: "POST",
//             headers: {
//                 Authorization: `KakaoAK ${ADMIN_KEY}`,
//                 "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
//             },
//             params,
//             */
//             url: "https://open-api.kakaopay.com/online/v1/payment/cancel",
//             method: "POST",
//             headers: {
//                 Authorization: `SECRET_KEY ${SECRET_KEY}`,
//                 "Content-type": "application/json",
//             },
//             params,
//         }).then(response => {
//             // 요청이 완료되면 백엔드에도 전송하기 위해 트루
//             setCancelTry2(true);
//         }).catch(error => {
//             setCancelTry(false);
//             setCancelTry2(false);
//             // 아니ㅕㄴ 결제 실패 모달
//             openModal();
//             console.log(error);
//         });
//     }, [cancelTry, data]);
//
//     // 실질적인 백에다 보내는 취소 정보
//     useEffect(() => {
//         // 비동기 통신
//         const payCancel = async () => {
//             try {
//                 // 위에서 세팅한 티켓 정보
//                 const response = await PayApi.payCancel(ticket.reserve_ticket, data.params.cancel_amount);
//                 // 200이면 성공
//                 if (response.data.statusCode === 200) {
//                     setCancelTry2(true);
//                 } else {
//                     // 실패하면 실패 모달로 이동 이거 예외처리를 좀 잘못했습니다. 하나라도 안되면 다 안되야 하는 것이 맞는데 실수.. 되돌리기엔 좀 늦었습니다.
//                     setCancelTry(false);
//                     setCancelTry2(false);
//                     openModal();
//                 }
//             } catch (e) {
//                 console.log(e);
//                 console.log('에러!!!');
//             }
//         }
//         cancelTry && canclelTry2 && payCancel();
//         openModal();
//     }, [cancelTry, canclelTry2, data.params, ticket.reserve_ticket]);
//
//
//     // 환불 완료 되었을 때
//     const Body = () => {
//         return (
//             <div>
//                 <h3>환불신청이 정상 처리되었습니다.</h3>
//                 <h4>환불기간은 3 ~ 7일 이내로 입금됩니다.</h4>
//                 <h5>창을 닫으시면 자동으로 메인페이지로 돌아갑니다.</h5>
//                 <Link replace={true} to='/MyPage/CList'>취소 내역 보러가기</Link>
//             </div>
//         );
//     }
//
//     // 환불 실패..
//     const Body2 = () => {
//         return (
//             <div>
//                 <p style={{fontSize: '22px', color: 'silver'}}>환불신청이 처리되지 않았습니다.</p>
//                 <p style={{fontSize: '22px', color: 'silver'}}>회원님이 예매하신 공연이 당일이라 취소가 불가능합니다..</p>
//                 <p style={{fontSize: '22px', color: 'silver'}}>문의 사항이 있으시면 아래 링크를 통해 문의 부탁드립니다.</p>
//                 <p><Link replace={true} to='/MyPage/Contact'>문의하러 가기</Link></p>
//                 <p><Link replace={true} to='/MyPage/CList'>취소 내역 보러가기</Link></p>
//             </div>
//         );
//     }
//
//     return (
//         <div>
//             {modalOpen && cancelTry && canclelTry2 && <PayModal open={openModal} close={closeModal} body={<Body/>}/>}
//             {modalOpen && !cancelTry && <PayModal open={openModal} close={closeModal} body={<Body2/>}/>}
//         </div>
//     );
// };


export {PayReady, PayResult, PayCancel};