package com.example.marmotor.model.DTO;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class CarDetailDTO extends CarDTO {
    private List<String> imagesAlbum;
    private String color;
    private String description;
    private List<String> features;
    private List<HistoryEventDTO> history;
}