package com.example.marmotor.model.DTO;

import lombok.Data;

@Data
public class HistoryEventDTO {
    private int year;
    private String title;
    private String icon;
    private boolean isCompleted;
}