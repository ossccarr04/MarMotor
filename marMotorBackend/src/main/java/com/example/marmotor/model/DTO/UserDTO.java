package com.example.marmotor.model.DTO;

import com.example.marmotor.model.entity.Car;
import com.example.marmotor.model.entity.User;
import lombok.Data;

import java.util.Set;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String password;
    private String username;
    private User.Role role;
}