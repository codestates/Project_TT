package com.hanguseok.server.service;

import com.hanguseok.server.dto.CommentDto;
import com.hanguseok.server.entity.Comment;
import com.hanguseok.server.entity.ReviewBoard;
import com.hanguseok.server.entity.User;
import com.hanguseok.server.repository.CommentRepository;
import com.hanguseok.server.repository.ReviewBoardRepository;
import com.hanguseok.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ReviewBoardRepository reviewBoardRepository;

    public Comment writeComment(CommentDto dto) {
        User user = userRepository.findById(dto.getUserId()).get();
        ReviewBoard review = reviewBoardRepository.findById(dto.getReviewId()).get();
        Comment comment = Comment.builder()
                .user(user)
                .review(review)
                .content(dto.getContent())
                .build();

        commentRepository.save(comment);
        return comment;
    }

    public Comment editComment(Long id, String content) {
        Comment comment = commentRepository.findById(id).get();
        Comment updatedComment = Comment.builder()
                .id(comment.getId())
                .user(comment.getUser())
                .review(comment.getReview())
                .content(content)
                .build();
        commentRepository.save(updatedComment);
        return updatedComment;
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}
