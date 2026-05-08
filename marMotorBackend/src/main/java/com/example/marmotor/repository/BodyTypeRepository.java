package com.example.marmotor.repository;

import com.example.marmotor.model.entity.BodyType;
import com.example.marmotor.model.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BodyTypeRepository extends JpaRepository<BodyType, Long> {
    Optional<BodyType> findByNameIgnoreCase(String name);

    @Query(value = "SELECT DISTINCT bt.* FROM body_types bt " +
            "INNER JOIN car c ON c.body_type_id = bt.id " +
            "WHERE (:isSold = true AND UPPER(c.badge) = 'SOLD') OR " +
            "(:isSold = false AND UPPER(c.badge) != 'SOLD')",
            nativeQuery = true)
    List<BodyType> findDistinctBodyTypesBySoldStatus(@Param("isSold") boolean isSold);
}
