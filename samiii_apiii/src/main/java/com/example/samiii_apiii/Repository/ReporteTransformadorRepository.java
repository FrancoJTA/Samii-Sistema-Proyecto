package com.example.samiii_apiii.Repository;

import com.example.samiii_apiii.Entity.ReporteTransformador;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReporteTransformadorRepository extends MongoRepository<ReporteTransformador, String> {
    List<ReporteTransformador> findByZonaId(String zonaId);
}
