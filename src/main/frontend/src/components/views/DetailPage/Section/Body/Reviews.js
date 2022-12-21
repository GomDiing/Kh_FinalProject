import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Comment from "./Review/Comment";
import ReviewBody from "./ReviewTest/ReviewBody";
import WriteReview from "./ReviewTest/WriteReview";

const Review = styled.div`
    /* min-height: 100vh; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin:20px;
`

const Reviews = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false);
    }


    const [comments, updateComments] = useState([]);
    const [deleteModalState, setDeleteModalState] = useState(false);

    const getData = async () => {
    const res = await fetch("./data/data.json");
    const data = await res.json();
    updateComments(data.comments);
    };

    useEffect(() => {
    localStorage.getItem("comments") !== null
        ? updateComments(JSON.parse(localStorage.getItem("comments")))
        : getData();
    }, []);

    useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
    deleteModalState
        ? document.body.classList.add("overflow--hidden")
        : document.body.classList.remove("overflow--hidden");
    }, [comments, deleteModalState]);


    // 댓글 추가
    let addComments = (newComment) => {
    let updatedComments = [...comments, newComment];
    updateComments(updatedComments);
    };

    // 대댓글 추가
    let updateReplies = (replies, id) => {
    let updatedComments = [...comments];
    updatedComments.forEach((data) => {
    if (data.id === id) {
        data.replies = [...replies];
    }
    });
    updateComments(updatedComments);
    };

    // 댓글 수정
    let editComment = (content, id, type) => {
    let updatedComments = [...comments];

    if (type === "comment") {
        updatedComments.forEach((data) => {
        if (data.id === id) {
        data.content = content;
        }
    });
    } else if (type === "reply") {
        updatedComments.forEach((comment) => {
        comment.replies.forEach((data) => {
        if (data.id === id) {
            data.content = content;
        }
        });
    });
    }

    updateComments(updatedComments);
    };

    // 댓글 삭제
    let commentDelete = (id, type, parentComment) => {
    let updatedComments = [...comments];
    let updatedReplies = [];

    if (type === "comment") {
        updatedComments = updatedComments.filter((data) => data.id !== id);
    } else if (type === "reply") {
        comments.forEach((comment) => {
        if (comment.id === parentComment) {
            updatedReplies = comment.replies.filter((data) => data.id !== id);
            comment.replies = updatedReplies;
        }
    });
    }

    updateComments(updatedComments);
    };
    return (
    <div>
        <div>
    {/* <button onClick={openModal}>관람후기</button>
            {modalOpen && <WriteReview open={openModal} close={closeModal} buttonValue={"등록"} addComments={addComments} />} */}
    {/* <WriteReview/> */}
    </div>
    <br/>
    <WriteReview/>
   
    </div>

    );
};

export default Reviews;
