package com.example.marmotor.model.DTO;

import com.example.marmotor.model.entity.Car;
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
    private Integer mileage; // //km
    private String consumption;

    private String badge;
    private String badgeType;
    private boolean isSaved;

    private Car.Transmission transmission;
    private Car.FuelType fuelType;
    private Car.BodyType bodyType;
    private Car.Status status;
    private String description;
    private List<CarImageDTO> images;
}