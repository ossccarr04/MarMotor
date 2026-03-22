package com.example.marmotor.model.DTO;

import lombok.Data;
import java.util.List;

@Data
public class CarDetailDTO {
    private String color;
    private String description;
    private List<String> features;
    private List<HistoryEventDTO> history;
}