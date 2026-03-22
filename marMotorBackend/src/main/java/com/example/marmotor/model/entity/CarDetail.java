package com.example.marmotor.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "car_details")
@Data
public class CarDetail {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "car_id")
    private Car car;

    private String color;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "car_features", joinColumns = @JoinColumn(name = "car_detail_id"))
    @Column(name = "feature")
    private List<String> features = new ArrayList<>();

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HistoryEvent> history = new ArrayList<>();
}