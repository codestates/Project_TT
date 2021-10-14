package com.hanguseok.server.dto;

import lombok.Data;

@Data
public class CommentDto {

    private Long userId;
    private Long reviewId;
    private String content;

}
