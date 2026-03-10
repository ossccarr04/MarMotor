package com.example.marmotor.model.DTO;

import com.example.marmotor.model.entity.Car;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CarDTO {
    private Long id;
    private String model;
    private Integer year;
    private BigDecimal price;
    private Car.Status status;
    private String description;
    private String brandName;
    private List<CarImageDTO> images;
}