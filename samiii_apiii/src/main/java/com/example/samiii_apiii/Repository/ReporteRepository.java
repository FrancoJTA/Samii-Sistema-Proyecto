package com.example.samiii_apiii.Repository;

import com.example.samiii_apiii.Entity.Reporte;
import com.example.samiii_apiii.Entity.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReporteRepository extends MongoRepository<Reporte, String> {

    List<Reporte> findByZonaid(String zonaId);

}
