package com.hanguseok.server.controller;

import com.hanguseok.server.dto.ReviewDto;
import com.hanguseok.server.entity.BoardHash;
import com.hanguseok.server.entity.Hashtag;
import com.hanguseok.server.entity.ReviewBoard;
import com.hanguseok.server.entity.User;
import com.hanguseok.server.service.HashtagService;
import com.hanguseok.server.service.ReviewBoardService;
import com.hanguseok.server.service.S3Uploader;
import com.hanguseok.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/review")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://projecttt-client-bucket.s3-website.ap-northeast-2.amazonaws.com", allowedHeaders = "*", allowCredentials = "true")
public class ReviewBoardController {

    private final ReviewBoardService reviewBoardService;
    private final S3Uploader s3Uploader;
    private final HashtagService hashtagService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> allReview() {
        try {
            List<ReviewBoard> reviews = reviewBoardService.findAllReviews();
            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    for (ReviewBoard review : reviews) {
                        put(review.getId(), new HashMap<>() {
                            {
                                put("title", review.getTitle());
                                put("view", review.getView());
                                put("recommend", review.getRecommended());
                                put("image", review.getImage());
                                put("content", review.getContent());
                                put("region", review.getRegion());
                                put("author", review.getUser().getNickname());
                                put("comments", review.getComments());
                                List<String> hashtags = new ArrayList<>();
                                for (BoardHash boardHash : review.getHashtags()) {
                                    hashtags.add(boardHash.getHashtag().getName());
                                }
                                put("hashtags", hashtags);
                            }
                        });
                    }
                }
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "리뷰 게시글 데이터를 받아올 수 없습니다!");
                }
            });
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findReviewById(@PathVariable("id") Long id) {
        try {
            ReviewBoard review = reviewBoardService.findReviewById(id);
            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("id", review.getId());
                    put("title", review.getTitle());
                    put("image", review.getImage());
                    put("content", review.getContent());
                    put("comments", review.getComments());
                    List<String> hashtags = new ArrayList<>();
                    for (BoardHash boardHash : review.getHashtags()) {
                        hashtags.add(boardHash.getHashtag().getName());
                    }
                    put("hashtags", hashtags);
                    put("author", review.getUser().getNickname());
                    put("view", review.getView());
                    put("recommend", review.getRecommended());
                    put("region", review.getRegion());
                    put("message", "리뷰 게시글 조회에 성공했습니다.");
                }
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "잘못된 조회 요청입니다!");
                }
            });
        }
    }

    @PostMapping
    public ResponseEntity<?> reviewUpload(@RequestBody ReviewDto dto) throws IOException {
        try {
            List<Hashtag> hashtags = new ArrayList<>();

            for (String el : dto.getHashtags()) {
                if (!hashtagService.alreadyExist(el)) {
                    hashtags.add(hashtagService.saveHashtag(el));
                };
            }

            System.out.println("--- 해시태그 저장 확인 ---");

            User user = userService.findUserById(dto.getUserId());

            System.out.println("--- 유저 조회 확인 ---");

//            String uploadUrl = s3Uploader.upload(review.getId(), multipartFile, "static");
//            review.builder()
//                    .image(uploadUrl)
//                    .build();

            ReviewBoard review = reviewBoardService.saveReview(user, hashtags, dto);

            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("id", review.getId());
                    put("title", review.getTitle());
                    put("image", review.getImage());
                    put("content", review.getContent());
                    put("region", review.getRegion());
                    put("author", review.getUser().getNickname());
                }
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "잘못된 등록 요청입니다!");
                }
            });
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable("id") Long id) {
        try {
            reviewBoardService.deletePost(id);
            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("message", "리뷰가 성공적으로 삭제되었습니다.");
                }
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "리뷰가 삭제되지 않았습니다.");
                }
            });
        }
    }

    /*
    @PutMapping("/{id}")
    public ResponseEntity<?> editReview(@PathVariable("id") Long id, ReviewDto dto) {
        try {
            ReviewBoard review = reviewBoardService.postReview(dto);
            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("id", review.getId());
                    put("message", "성공적으로 수정되었습니다.");
                }
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "수정 작업에 실패했습니다");
                }
            });
        }
    }
     */

}
