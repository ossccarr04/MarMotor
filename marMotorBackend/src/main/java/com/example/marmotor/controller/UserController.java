package com.example.marmotor.controller;

import com.example.marmotor.model.DTO.ChangePasswordRequest;
import com.example.marmotor.model.DTO.UserDTO;
import com.example.marmotor.model.entity.User;
import com.example.marmotor.service.AuthService; // Importar AuthService
import com.example.marmotor.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;


    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMyProfile(Authentication authentication) {
        UserDTO profile = this.userService.getMyProfile(authentication.getName());
        return ResponseEntity.ok(profile);
    }

    @PatchMapping("/me/password")
    public ResponseEntity<UserDTO> updatePassword(Authentication authentication, @RequestBody ChangePasswordRequest passwords) {
    return ResponseEntity.ok(this.userService.updatePassword(authentication.getName(),passwords.getCurrentPassword(),
            passwords.getNewPassword()));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Map<String, String>> deleteMyAccount(Authentication authentication) {
        userService.desactivateMyAccount(authentication.getName());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Cuenta eliminada correctamente");

        return ResponseEntity.ok(response);
    }

}