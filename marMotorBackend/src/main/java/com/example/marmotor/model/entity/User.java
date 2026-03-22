package com.example.marmotor.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.*;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false, length = 50)
    private String username;
    @Column(nullable = false)
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;
    @ManyToMany
    @JoinTable(
            name = "favorites",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "car_id")
    )
    private Set<Car> favoriteCars = new HashSet<>();

    public enum Role {
        USER, ADMIN
    }
}