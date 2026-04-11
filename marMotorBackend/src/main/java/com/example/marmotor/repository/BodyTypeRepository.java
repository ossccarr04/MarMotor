package com.example.marmotor.repository;

import com.example.marmotor.model.entity.BodyType;
import com.example.marmotor.model.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BodyTypeRepository extends JpaRepository<BodyType, Long> {
    Optional<BodyType> findByNameIgnoreCase(String name);
}
