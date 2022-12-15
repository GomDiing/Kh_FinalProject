import Spinner from 'react-bootstrap/Spinner';

// 로딩중 표시 위한 Spinner
function NowLoading() {
  return (
    <>
      <Spinner animation="border" variant="warning" />
    </>
  );
}

export default NowLoading;