package com.example.marmotor.model.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CarDTO {
    private Long id;
    private String make;
    private String model;
    private Integer year;
    private BigDecimal price;
    private String imageUrl;

    private Integer power; //cv
    private Integer mileage; //km
    private String version;

    private String badge;
    private String badgeType;
    private String label;
    private boolean isSaved;
    private LocalDateTime createdAt;
    private LocalDateTime soldAt;

    private String transmission;
    private String status;
    private String fuelType;
    private String bodyType;

    private String description;
    private List<CarImageDTO> images;
}