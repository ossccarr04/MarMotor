package com.example.marmotor.controller;

import com.example.marmotor.model.entity.User;
import com.example.marmotor.service.AuthService; // Importar AuthService
import com.example.marmotor.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private AuthService authService; // Usar AuthService para el registro
    // private UserService userService; // Si UserService tiene otras responsabilidades, mantenlo

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        try {
            return ResponseEntity.ok(authService.register(user));
        } catch (RuntimeException e) {
            // El servicio ya lanza una excepción si el usuario existe
            return ResponseEntity.badRequest().build();
        }
    }
}