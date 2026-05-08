package com.example.marmotor.service;

import com.example.marmotor.model.DTO.BodyTypeDTO;
import com.example.marmotor.model.entity.BodyType;
import com.example.marmotor.repository.BodyTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BodyTypeService {
    @Autowired
    private BodyTypeRepository repository;

    public List<BodyTypeDTO> getActiveBodyTypes(boolean isSold) {
        List<BodyType> activeBodyTypes = repository.findDistinctBodyTypesBySoldStatus(isSold);
        return activeBodyTypes.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private BodyTypeDTO convertToDto(BodyType bodyType) {
        BodyTypeDTO dto = new BodyTypeDTO();
        dto.setId(bodyType.getId());
        dto.setName(bodyType.getName());
        return dto;
    }
}