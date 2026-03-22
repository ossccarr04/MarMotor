package com.example.marmotor.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.*;

@Entity
@Table(name = "cars", indexes = {
        @Index(name = "idx_brand_id", columnList = "brand_id")
})
@Data
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "car", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private CarDetail detail;

    @ManyToOne
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @Column(nullable = false, length = 100)
    private String model;

    private Integer year;
    private BigDecimal price;
    private Integer power;
    private Integer mileage;
    private String consumption;

    private String badge;
    private String badgeType;

    @Transient
    private boolean isSaved;

    @Enumerated(EnumType.STRING)
    private Transmission transmission = Transmission.MANUAL;

    @Enumerated(EnumType.STRING)
    private FuelType fuelType = FuelType.GASOLINE;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private BodyType bodyType = BodyType.SEDAN;

    @Enumerated(EnumType.STRING)
    private Status status = Status.AVAILABLE;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CarImage> images = new ArrayList<>();

    public enum BodyType {
        SEDAN, SUV, COUPE, HATCHBACK, CONVERTIBLE, VAN
    }

    public enum Status { AVAILABLE, SOLD, RESERVED }
    public enum Transmission { MANUAL, AUTOMATIC }
    public enum FuelType { GASOLINE, DIESEL, ELECTRIC, HYBRID }
}