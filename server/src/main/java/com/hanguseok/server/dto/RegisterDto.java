package com.hanguseok.server.dto;

import lombok.Data;

@Data
public class RegisterDto {

    private String email;
    private String password;
    private String nickname;

}
