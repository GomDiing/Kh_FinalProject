import './Paging.css'

// 1조에서 제공 ㅎㅎ

const Pagination = ({total, limit, page,pageStart, setPage, setPageStart, setCheckItems,totalPages}) => {
  const numPages = Math.ceil(total / limit);
  // const viewPages = (numPages > 5 ? 5 : numPages); //페이지 수 
  const viewPages = {totalPages};

  return (
    <div className="pagination">
      <button 
        onClick={() => {
          setPage(page - 1); 
          setPageStart(Math.floor((page - 2) / 10));
          setCheckItems([]);
          }} 
        disabled={page === 1}>
        &lt;
      </button>
      {Array(viewPages)
        .fill()
        .map((_, i) => {
          if(pageStart * 10 + i + 1 <= numPages) {
            return(
              <button
                key={pageStart * 10 + i + 1}
                onClick={() => {
                  setPage(pageStart * 10 + i + 1);
                  setCheckItems([]);
                }}
                aria-current={page === pageStart * 10 + i + 1 ? "page" : null}
              >
                {pageStart * 10 + i + 1}
              </button>
            )
        }})}
      <button 
        onClick={() =>{
          setPage(page + 1); 
          setPageStart(Math.floor(page / 10));
          setCheckItems([]);}}
        disabled={page === numPages}
      >
        &gt;
      </button>
    </div>
  );
}

export default Pagination;
