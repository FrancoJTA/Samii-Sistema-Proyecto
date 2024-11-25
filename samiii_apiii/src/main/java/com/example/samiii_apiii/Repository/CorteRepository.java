package com.example.samiii_apiii.Repository;

import com.example.samiii_apiii.Entity.Corte;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CorteRepository extends MongoRepository<Corte, String> {

    List<Corte> findByFechaInicioBeforeAndFechaFinAfter(LocalDateTime ahora1,LocalDateTime ahora2);

    List<Corte> findByFechaFinBefore(LocalDateTime ahora);

    List<Corte> findByMedidorId(String medidorId);

}
