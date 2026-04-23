package com.example.marmotor.service;

import com.example.marmotor.model.DTO.UserDTO;
import com.example.marmotor.model.entity.User;
import com.example.marmotor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserDTO getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return new UserDTO(
                user.getEmail(),
                user.getUsername(),
                user.getCreatedAt(),
                user.getContContact()
        );
    }

    @Transactional
    public void deactivateMyAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setDeletedAt(LocalDateTime.now());
        user.setUsername("Usuario Eliminado");
        user.setContContact(0);
        user.setEmail("deletedEmail_" + UUID.randomUUID().toString());
        user.setPassword("deletedPassword_" + UUID.randomUUID().toString());

        userRepository.save(user);
    }
}
