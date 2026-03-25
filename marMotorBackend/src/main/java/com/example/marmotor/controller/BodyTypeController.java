package com.example.marmotor.controller;

import com.example.marmotor.model.DTO.BodyTypeDTO;
import com.example.marmotor.service.BodyTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/body-types")
@CrossOrigin(origins = "http://localhost:4200")
public class BodyTypeController {
    @Autowired private BodyTypeService bodyTypeService;

    @GetMapping
    public ResponseEntity<List<BodyTypeDTO>> getBodyTypes() {
        return ResponseEntity.ok(bodyTypeService.getAllBodyTypes());
    }
}
