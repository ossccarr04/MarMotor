package com.example.marmotor.model.DTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CarCreateDTO {
    private String model;
    private Long brandId;
    private Long fuelTypeId;
    private Long bodyTypeId;
    private Integer year;
    private BigDecimal price;
    private Integer power;
    private Integer mileage;
    private String consumption;
    private String transmission;
    private String badge;
    private String badgeType;
    private String description;
}

