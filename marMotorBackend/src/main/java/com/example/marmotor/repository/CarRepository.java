package com.example.marmotor.repository;

import com.example.marmotor.model.entity.Car;
import com.example.marmotor.model.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    boolean existsByBrandId(Long brandId);

    List<Car> findByStatus(Status status);

    @Query(value = "SELECT c.* FROM cars c " +
            "JOIN brands b ON c.brand_id = b.id " +
            "WHERE LOWER(CONCAT(b.name, ' ', c.model)) LIKE LOWER(CONCAT('%', :query, '%'))",
            nativeQuery = true)
    List<Car> findByFullSearch(@Param("query") String query);

}