package com.hanguseok.server.service;

import com.hanguseok.server.dto.ReviewDto;
import com.hanguseok.server.entity.*;
import com.hanguseok.server.repository.BoardHashRepository;
import com.hanguseok.server.repository.HashtagRepository;
import com.hanguseok.server.repository.ReviewBoardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ReviewBoardService {

    private final ReviewBoardRepository reviewBoardRepository;
    private final HashtagService hashtagService;
    private final BoardHashService boardHashService;
    private final HashtagRepository hashtagRepository;
    private final BoardHashRepository boardHashRepository;
    private final UserService userService;

    public List<ReviewBoard> findAllReviews() {
        return reviewBoardRepository.findAll();
    }

    public void deletePost(Long id) {
        reviewBoardRepository.deleteById(id);
        hashtagService.deleteNonExistReview();
    }

    public ReviewBoard findReviewById(Long id) {
        return reviewBoardRepository.findById(id).get();
    }

    public ReviewBoard initReview(User user, ReviewDto dto) {
        try {
            ReviewBoard review = ReviewBoard.builder()
                    .user(user)
                    .title(dto.getTitle())
                    .content(dto.getContent())
                    .region(dto.getRegion())
                    .view(0)
                    .image(dto.getImage())
                    .build();
            reviewBoardRepository.save(review);
            return review;
        } catch (Exception e) {
            log.error("Review post error : " + e);
            return null;
        }
    }

    public ReviewBoard editReview(Long id, ReviewDto dto) {
        List<Hashtag> hashtags = new ArrayList<>();
        for (String el : dto.getHashtags()) {
            Hashtag hashtag;
            if (!hashtagService.alreadyExist(el)) {
                hashtag = hashtagService.saveHashtag(el);
            } else {
                hashtag = hashtagService.findHashtagByName(el);
            }
            hashtags.add(hashtag);
        }

        ReviewBoard review = reviewBoardRepository.findById(id).get();
        List<BoardHash> boardHashes = review.getHashtags();
        List<String> hashes = dto.getHashtags();
        boolean isExist;
        for (BoardHash boardHash : boardHashes) {
            isExist = false;
            for (String hash : hashes) {
                if (hash.equals(boardHash.getHashtag().getName())) {
                    isExist = true;
                }
            }
            if (!isExist) boardHashRepository.delete(boardHash);
        }

        ReviewBoard updatedReview = ReviewBoard.builder()
                .id(review.getId())
                .user(review.getUser())
                .comments(review.getComments())
                .title(dto.getTitle())
                .content(dto.getContent())
                .image(dto.getImage())
                .region(dto.getRegion())
                .view(review.getView())
                .recommends(review.getRecommends())
                .build();

        reviewBoardRepository.save(updatedReview);

        isExist = false;
        for (Hashtag hashtag : hashtags) {
            isExist = false;
            for (BoardHash boardHash : boardHashes) {
                if (boardHash.getHashtag().equals(hashtag)) {
                    isExist = true;
                }
            }
            if (!isExist) {
                BoardHash boardHash = BoardHash.builder()
                        .hashtag(hashtag)
                        .review(updatedReview)
                        .build();
                boardHashService.connectTag(boardHash);
            }
        }

        hashtagService.deleteNonExistReview();

        return updatedReview;
    }

    public void saveReview(ReviewBoard review) {
        reviewBoardRepository.save(review);
    }

}
