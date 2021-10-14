import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { useHistory } from "react-router-dom";
import axios from "axios";
import AWS from "aws-sdk";
import "../styles/NewReview.css";

axios.defaults.withCredentials = true;

function NewReview(props) {
  const history = useHistory();
  const { state, mode } = useLocation();
  const [fileInfo, setFileInfo] = useState("");
  const [s3UploadedLink, setS3UploadedLink] = useState("");
  const [reviewData, setReviewData] = useState({
    title: "",
    content: "",
    region: "",
    hashtags: [],
  });
  useEffect(() => {
    if (state !== undefined) {
      setS3UploadedLink(state.image);
      setReviewData({
        title: state.title,
        content: state.content,
        region: state.region,
        hashtags: state.hashtags,
      });
    }
    if (mode === "modifyPost") {
      if (props.userInfo.nickname !== state.author) {
        alert("작성자만 수정할 수 있습니다");
        history.push("/destinationReviews");
      }
    }
  }, []);

  AWS.config.update({
    region: "ap-northeast-2",
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: "ap-northeast-2:c73b0ffb-7106-4208-b363-d97260804331", // cognito 인증 풀에서 받아온 키를 문자열로 입력합니다. (Ex. "ap-northeast-2...")
    }),
  });

  const upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: "projecttt-image-bucket", // 업로드할 대상 버킷명
      Key: fileInfo.name, // 업로드할 파일명 (* 확장자를 추가해야 합니다!)
      Body: fileInfo, // 업로드할 파일 객체
    },
  });

  const fileChangeHandler = (e) => {
    setFileInfo(e.target.files[0]);
  };
  const reviewDataHandler = (key) => (e) => {
    setReviewData({ ...reviewData, [key]: e.target.value });
  };
  function imageUploadHandler() {
    const promise = upload.promise();
    promise.then(
      function (data) {
        alert("이미지 업로드에 성공했습니다.");
        setS3UploadedLink(
          "https://projecttt-image-bucket.s3.ap-northeast-2.amazonaws.com/" +
            fileInfo.name
        );
      },
      function (err) {
        return alert("오류가 발생했습니다: ", err.message);
      }
    );
  }
  const hashtagHandler = (e) => {
    if (e.key === "Enter") {
      let ht = reviewData.hashtags;
      ht.push(e.target.value);
      setReviewData({ ...reviewData, hashtags: ht });
      e.target.value = "";
    }
  };
  async function reviewModifyHandler() {
    await axios(
      "http://ec2-3-35-140-107.ap-northeast-2.compute.amazonaws.com:8080/review/" +
        state.id,
      {
        method: "PUT",
        data: {
          image: s3UploadedLink,
          userId: props.userInfo.id,
          title: reviewData.title,
          content: reviewData.content,
          region: reviewData.region,
          hashtags: reviewData.hashtags,
        },
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "PUT",
          "Access-Control-Allow-Credentials": "true",
        },
        withCredentials: true,
      }
    )
      .then((res) => {
        history.push("/destinationReviews");
      })
      .catch((e) => {
        alert("글 수정에 실패하였습니다" + e);
      });
  }
  async function reviewUploadHandler() {
    await axios(
      "http://ec2-3-35-140-107.ap-northeast-2.compute.amazonaws.com:8080/review",
      {
        method: "POST",
        data: {
          image: s3UploadedLink,
          userId: props.userInfo.id,
          title: reviewData.title,
          content: reviewData.content,
          region: reviewData.region,
          hashtags: reviewData.hashtags,
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
        history.push("/destinationReviews");
      })
      .catch((e) => {
        alert("글 작성에 실패하였습니다" + e);
      });
  }
  function tester(e){
    setS3UploadedLink(e.target.value)
  }
  return (
    <div id="new-review-content">
      <div id="text-title-content">
        <input
          placeholder="제목을 입력해주세요"
          maxLength="40"
          rows="1"
          cols="40"
          defaultValue={reviewData.title}
          onChange={reviewDataHandler("title")}
        ></input>
        <div id="new-review-author">작성자 : {props.userInfo.nickname}</div>
      </div>
      <div id="text-description-content">
        <textarea
          maxLength="1500"
          rows="10"
          cols="50"
          defaultValue={reviewData.content}
          onChange={reviewDataHandler("content")}
        ></textarea>
      </div>
      <div id="image-upload">
        <input
          id="image-file-select"
          type="file"
          onChange={fileChangeHandler}
        />
        <button id="image-upload-btn" onClick={imageUploadHandler}>
          이미지 업로드
        </button>
        {/* <div id="upload-text">업로드된 파일 : {s3UploadedLink}</div> */}
        {/* <input onChange={tester}></input> */}
      </div>
      <div id="hashtag-content">
        <div id="hashtag-list">
          {reviewData.hashtags.map((ele) => {
            return "#" + ele + " ";
          })}
        </div>
        <input
          className="small-textarea"
          placeholder="해쉬태그를 작성해주세요"
          maxLength="15"
          size="40"
          onChange={hashtagHandler}
          onKeyPress={hashtagHandler} //onKeyPress이벤트가 엔터키 입력때문에 필요하나 한글에는 적용되지않는 문제가 있음
        ></input>
      </div>
      <div id="dest-content">
        <input
          className="small-textarea"
          placeholder="여행지를 적어주세요"
          maxLength="15"
          size="15"
          defaultValue={reviewData.region}
          onChange={reviewDataHandler("region")}
        ></input>
      </div>
      {mode === "newPost" ? (
        <button id="post-btn" onClick={reviewUploadHandler}>
          글작성
        </button>
      ) : (
        <button id="modify-btn" onClick={reviewModifyHandler}>
          수정하기
        </button>
      )}
    </div>
  );
}
export default NewReview;
