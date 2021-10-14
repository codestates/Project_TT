import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/Review.css';

axios.defaults.withCredentials = true;

function Review(props) {
  const history = useHistory();
  const { state } = useLocation();

  const [newComment, setNewComment] = useState('1');
  const [commentText, setCommentText] = useState('');
  const [comment, setComment] = useState([]);
  const [recommandCount, setRecommandCount] = useState(0);
  const changeCommentText = (e) => {
    setCommentText(e.target.value);
  };

  useEffect(() => {
    getComments();
    console.log('반복테스트');
  }, [newComment]);
  async function getComments() {
    await axios('http://ec2-3-35-140-107.ap-northeast-2.compute.amazonaws.com:8080/review/' + state.id, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Credentials': 'true',
      },
      withCredentials: true,
    })
      .then((res) => {
        let commentObj = res.data.comments;
        let objectToArray = [];
        let keys = Object.keys(commentObj);
        for (let i = 0; i < keys.length; i++) {
          objectToArray.push({ ...commentObj[keys[i]], id: keys[i] });
        }
        setComment(objectToArray);
      })
      .catch((e) => {});
    setRecommandCount(state.recommend);
  }

  async function deleteReview() {
    if (props.userInfo.nickname !== state.author) {
      alert('작성자 권한이 없습니다');
      return;
    }
    await axios('http://ec2-3-35-140-107.ap-northeast-2.compute.amazonaws.com:8080/review/' + state.id, {
      method: 'DELETE',
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE',
        'Access-Control-Allow-Credentials': 'true',
      },
      withCredentials: true,
    })
      .then((res) => {
        history.push('/destinationReviews');
      })
      .catch((e) => {});
  }
  async function postComment() {
    await axios('http://ec2-3-35-140-107.ap-northeast-2.compute.amazonaws.com:8080/comment', {
      method: 'POST',
      data: {
        userId: props.userInfo.id,
        reviewId: state.id,
        content: commentText,
      },
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Credentials': 'true',
      },
      withCredentials: true,
    })
      .then((res) => {
        setNewComment(newComment + 1);
        setCommentText('');
      })
      .catch((e) => {});
  }

  async function postRecommand () {
    if(!props.loginOn){
      alert('로그인이 필요합니다');
      return
    }
    await axios(
      "http://ec2-3-35-140-107.ap-northeast-2.compute.amazonaws.com:8080/review/recommend",
      {
        method: "POST",
        data: {
          userId: props.userInfo.id,
          reviewId: state.id,
        },
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Credentials": "true",
        },
        withCredentials: true,
      }
    )

      .then((res) => {
        if (res.data.message === '게시글을 추천했습니다.') {
          setRecommandCount(recommandCount + 1);
        } else {
          alert('추천이 취소됐습니다.');
          setRecommandCount(recommandCount - 1);
        }
      })
      .catch((e) => {
        alert('오류가 발생했습니다: ', e.message);
      });
  }
  const deleteComment = (id) => async (e) => {
    await axios('http://ec2-3-35-140-107.ap-northeast-2.compute.amazonaws.com:8080/comment/' + id, {
      method: 'DELETE',
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE',
        'Access-Control-Allow-Credentials': 'true',
      },
      withCredentials: true,
    })
      .then((res) => {
        setCommentText('');
        setNewComment(newComment + 1);
      })
      .catch((e) => {});
  };

  return (
    <div id="review-header">
      <div id="review-title">{state.title}</div>
      <div id="review-content">
        <span id="reviewer">{`글쓴이 : ${state.author}`}</span>
      </div>

      <img id="review-img" src={state.image} alt={state.image}></img>
      <div id="reviewer-description">{state.content}</div>
      <button id="like-btn" onClick={postRecommand}>
        <img src="/images/heart_recommand.png" id="heart-img"></img>
      </button>
      <div id="recommand-count">{recommandCount}</div>
      <div id="review-modify-btn-wrapper">
        {props.loginOn ? (
          <Link
            to={{
              pathname: '/newReview',
              props: props,
              state: state,
              mode: 'modifyPost',
            }}
          >
            <button className="classic-button">글수정</button>
          </Link>
        ) : null}
        <span> </span>
        <button className="classic-button" onClick={deleteReview}>
          글삭제
        </button>
      </div>

      <div>
        {comment.length !== 0
          ? comment.map((ele) => {
              return (
                <div class="comment-content">
                  <span class="comment-user">{ele['comment-writer']}</span>
                  <span class="comment-description">{ele['comment-content']}</span>
                  {ele['comment-writer'] === props.userInfo.nickname ? (
                    <button className="delete-button" onClick={deleteComment(ele['id'])}>
                      댓글 삭제
                    </button>
                  ) : null}
                </div>
              );
            })
          : null}
      </div>
      <div className="comment-wrapper">
        {props.loginOn ? <div className="userNickname">{props.userInfo.nickname}</div> : null}
        {props.loginOn ? (
          <textarea
            maxLength="250"
            rows="5"
            cols="50"
            value={commentText}
            onChange={changeCommentText}
            className="comment-box"
          ></textarea>
        ) : (
          <textarea
            maxLength="250"
            rows="5"
            cols="50"
            defaultValue="댓글을 작성하시려면 로그인이 필요합니다"
            readOnly
            className="comment-box"
          ></textarea>
        )}
        <div id="button-wrapper">
          <button className="classic-button" onClick={postComment}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
export default Review;
