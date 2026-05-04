package com.example.marmotor.model.DTO;

import com.example.marmotor.model.entity.Car;
import com.example.marmotor.model.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private String email;
    private String username;
    private LocalDateTime createdAt;
}