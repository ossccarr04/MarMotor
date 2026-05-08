package com.example.marmotor.controller;

import com.example.marmotor.model.DTO.BodyTypeDTO;
import com.example.marmotor.service.BodyTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/body-types")
@CrossOrigin(origins = "https://marmotor.vercel.app")
public class BodyTypeController {
    @Autowired
    private BodyTypeService bodyTypeService;

    @GetMapping("/active")
    public ResponseEntity<List<BodyTypeDTO>> getActiveBodyTypes(@RequestParam(defaultValue = "false") boolean isSold) {

        List<BodyTypeDTO> activeBodyTypes = bodyTypeService.getActiveBodyTypes(isSold);
        return ResponseEntity.ok(activeBodyTypes);
    }
}
