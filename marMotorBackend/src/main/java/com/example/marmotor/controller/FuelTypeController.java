package com.example.marmotor.controller;

import com.example.marmotor.model.entity.FuelType;
import com.example.marmotor.repository.FuelTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/fuel-types")
@CrossOrigin(origins = "*")
public class FuelTypeController {
    @Autowired
    private FuelTypeRepository repository;

    @GetMapping
    public List<FuelType> getAll() {
        return repository.findAll();
    }
}