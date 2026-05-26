package com.example.marmotor.model.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CarCreateDTO {

    private String model;
    private Integer year;
    private BigDecimal price;
    private Integer power;
    private Integer mileage;
    private String version;
    private String transmission;
    private String badge;
    private String badgeType;
    private String label;

    private String brandName;
    private String fuelTypeName;
    private String bodyTypeName;

    private String color;
    private String description;

    private List<String> features; // ["Techo solar", "Asientos cuero"...]
    private List<HistoryEventDTO> history; // Lista de objetos del historial
    private List<String> existingImages;
    private boolean clearImages;

}

