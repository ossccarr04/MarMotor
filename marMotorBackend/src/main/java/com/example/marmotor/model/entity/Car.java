package com.example.marmotor.model.entity;

import com.example.marmotor.model.enums.Label;
import com.example.marmotor.model.enums.Status;
import com.example.marmotor.model.enums.Transmission;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

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

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne(mappedBy = "car", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private CarDetail detail;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
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

    // ETIQUETA DGT (0, ECO, C...)
    @Enumerated(EnumType.STRING)
    @Column(name = "label")
    private Label label;

    // ETIQUETA COMERCIAL (New, Featured, Offer...)
    @Column(name = "badge")
    private String badge;

    // ESTILO VISUAL (success, warning, danger...)
    @Column(name = "badge_type")
    private String badgeType;

    @Transient
    private boolean isSaved;

    @Enumerated(EnumType.STRING)
    private Transmission transmission;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne
    @JoinColumn(name = "fuel_type_id")
    private FuelType fuelType;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne
    @JoinColumn(name = "body_type_id")
    private BodyType bodyType;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "fecha_creacion")
    private LocalDateTime createdAt;

    @Column(name = "fecha_venta")
    private LocalDateTime soldAt;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CarImage> images = new ArrayList<>();
}