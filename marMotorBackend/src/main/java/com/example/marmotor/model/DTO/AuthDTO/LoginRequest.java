package com.example.marmotor.model.DTO.AuthDTO;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}