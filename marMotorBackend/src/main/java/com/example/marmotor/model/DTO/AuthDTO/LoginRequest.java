package com.example.marmotor.model.DTO.AuthDTO;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}