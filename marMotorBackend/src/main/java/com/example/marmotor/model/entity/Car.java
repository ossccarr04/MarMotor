package com.example.marmotor.model.entity;

import com.example.marmotor.model.enums.Label;
import com.example.marmotor.model.enums.Status;
import com.example.marmotor.model.enums.Transmission;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @Enumerated(EnumType.STRING)
    @Column(name = "label")
    private Label label;

    @Transient
    private boolean isSaved;

    @Enumerated(EnumType.STRING)
    private Transmission transmission;

    @ManyToOne
    @JoinColumn(name = "fuel_type_id")
    private FuelType fuelType;

    @ManyToOne
    @JoinColumn(name = "body_type_id")
    private BodyType bodyType;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "fecha_creacion")
    private LocalDateTime  createdAt;

    @Column(name = "fecha_venta")
    private LocalDateTime soldAt;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CarImage> images = new ArrayList<>();

}