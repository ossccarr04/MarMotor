package com.example.marmotor.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens")
@Data
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    // A qué usuario pertenece este token
    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    // Cuándo caduca (para que el link no dure para siempre por seguridad)
    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Column(nullable = false)
    private int attempts = 0;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }
}