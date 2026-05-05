package com.example.marmotor.controller;

import com.example.marmotor.exception.ThrottledException;
import com.example.marmotor.model.DTO.AuthDTO.AuthResponse;
import com.example.marmotor.model.DTO.AuthDTO.LoginRequest;
import com.example.marmotor.model.entity.User;
import com.example.marmotor.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
// Añadimos localhost para las pruebas locales, además de tu URL de producción
@CrossOrigin(origins = {"https://marmotor.vercel.app", "http://localhost:4200"})
public class AuthController {

    @Autowired
    private AuthService authService;

    @GetMapping("/public/health")
    public ResponseEntity<String> checkHealth() {
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user));
    }

    @PostMapping("/login")
    // 1. Añadimos HttpServletRequest para obtener los detalles de la petición
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        // 2. Pasamos el objeto de la petición al servicio
        return ResponseEntity.ok(authService.login(request, httpRequest));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            authService.processForgotPassword(request.get("email"));
            return ResponseEntity.ok(Map.of("message", "Si el correo existe, te hemos enviado un enlace."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");
            authService.processResetPassword(token, newPassword);
            return ResponseEntity.ok(Map.of("message", "Contraseña actualizada con éxito."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 3. Añadimos un manejador para nuestra excepción personalizada
    @ExceptionHandler({ ThrottledException.class })
    public ResponseEntity<Object> handleThrottledException(ThrottledException ex) {
        // Esto captura la excepción y devuelve el código 429 que el frontend espera
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(Map.of("error", ex.getMessage()));
    }
}
