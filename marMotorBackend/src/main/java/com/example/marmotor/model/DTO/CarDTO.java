package com.example.marmotor.model.DTO;

import com.example.marmotor.model.entity.Car;
import com.example.marmotor.model.enums.Status;
import com.example.marmotor.model.enums.Transmission;
import lombok.Data;

import java.math.BigDecimal;
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
    private String consumption;

    private String badge;
    private String badgeType;
    private boolean isSaved;

    private Transmission transmission;
    private Status status;
    private String fuelType;
    private String bodyType;

    private String description;
    private List<CarImageDTO> images;
}