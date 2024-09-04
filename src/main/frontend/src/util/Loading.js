import Spinner from 'react-bootstrap/Spinner';

// 로딩중 표시 위한 Spinner
function Loading() {
  return (
    <>
      <Spinner animation="border" variant="secondary" />
    </>
  );
}

export default Loading;