package com.example.marmotor.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "fuel_types")
@Data
@NoArgsConstructor  // Constructor vacío necesario para JPA
@AllArgsConstructor
public class FuelType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @OneToMany(mappedBy = "fuelType")
    private List<Car> cars = new ArrayList<>();
}