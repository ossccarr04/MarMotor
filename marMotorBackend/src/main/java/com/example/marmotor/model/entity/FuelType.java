package com.example.marmotor.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "fuel_types")
@Data
public class FuelType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;
}