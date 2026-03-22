package com.example.marmotor.service;

import com.example.marmotor.model.entity.User;
import com.example.marmotor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRole() == null) {
            user.setRole(User.Role.USER);
        }

        return userRepository.save(user);
    }

    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }
}