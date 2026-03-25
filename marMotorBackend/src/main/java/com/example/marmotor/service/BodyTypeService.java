package com.example.marmotor.service;

import com.example.marmotor.model.DTO.BodyTypeDTO;
import com.example.marmotor.repository.BodyTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BodyTypeService {
    @Autowired private BodyTypeRepository repository;

    public List<BodyTypeDTO> getAllBodyTypes() {
        return repository.findAll().stream().map(bt -> {
            BodyTypeDTO dto = new BodyTypeDTO();
            dto.setId(bt.getId());
            dto.setName(bt.getName());
            return dto;
        }).collect(Collectors.toList());
    }
}