package com.hanguseok.server.controller;

import com.hanguseok.server.dto.CommentDto;
import com.hanguseok.server.entity.Comment;
import com.hanguseok.server.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@Slf4j
@RestController
@RequestMapping("/comment")
@CrossOrigin(origins = "http://projecttt-client-bucket.s3-website.ap-northeast-2.amazonaws.com", allowedHeaders = "*", allowCredentials = "true")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<?> writeComment(@RequestBody CommentDto dto) {
        try {
            Comment comment = commentService.writeComment(dto);
            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("author", comment.getUser().getNickname());
                    put("content", comment.getContent());
                    put("message", "댓글 입력 성공");
                }
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "댓글 입력 실패");
                }
            });
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editComment(@PathVariable("id") Long id, @RequestBody CommentDto dto) {
        try {
            Comment comment = commentService.editComment(id, dto.getContent());

            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("content", comment.getContent());
                    put("message", "댓글이 수정되었습니다.");
                }
            });
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "댓글 수정에 실패했습니다.");
                }
            });
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable("id") Long id) {
        try {
            commentService.deleteComment(id);
            return ResponseEntity.ok().body(new HashMap<>() {
                {
                    put("message", "댓글이 성공적으로 삭제되었습니다.");
                }
            });
        } catch (Exception e) {
            log.error("댓글 삭제 실패 : " + e);
            return ResponseEntity.badRequest().body(new HashMap<>() {
                {
                    put("message", "댓글 삭제에 실패했습니다!");
                }
            });
        }
    }

}
