package com.example.marmotor.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.*;

@Entity
@Table(name = "brands")
@Data
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String country;

    @OneToMany(mappedBy = "brand")
    private List<Car> cars = new ArrayList<>();
}