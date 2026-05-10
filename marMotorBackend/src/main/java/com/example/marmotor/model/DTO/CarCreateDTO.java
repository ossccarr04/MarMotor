package com.example.marmotor.model.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CarCreateDTO {
    //Datos basicos

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

    // Cambiamos IDs por Names para la lógica de "Buscar o Crear"
    private String brandName;
    private String fuelTypeName;
    private String bodyTypeName;

    // Campos para CarDetail (La parte de abajo del formulario)
    private String color;
    private String description;

    // Listas dinámicas
    private List<String> features; // ["Techo solar", "Asientos cuero"...]
    private List<HistoryEventDTO> history; // Lista de objetos del historial
    private List<String> existingImages;
    private boolean clearImages;

}

