package com.example.marmotor.controller;

import com.example.marmotor.model.entity.BodyType;
import com.example.marmotor.repository.BodyTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/body-types")
@CrossOrigin(origins = "*")
public class BodyTypeController {
    @Autowired
    private BodyTypeRepository repository;

    @GetMapping
    public List<BodyType> getAll() {
        return repository.findAll();
    }
}

