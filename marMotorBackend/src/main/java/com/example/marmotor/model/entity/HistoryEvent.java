package com.example.marmotor.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "history_events")
@Data
public class HistoryEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer year;
    private String title;
    private String icon;
    private boolean isCompleted;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id")
    private CarDetail car;
}