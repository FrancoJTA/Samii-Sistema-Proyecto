package com.example.samiii_apiii.Repository;

import com.example.samiii_apiii.Entity.Factura;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface FacturaRepository extends MongoRepository<Factura, String> {
    List<Factura> findByMedidorId(String medidorId);

    Optional<Factura> findTopByMedidorIdOrderByFechaEmisionDesc(String medidorId);

    List<Factura> findByPagadaFalseAndFechaVencimientoBefore(LocalDateTime fechaActual);

    boolean existsByMedidorIdAndPagadaFalseAndFechaVencimientoBefore(String medidorId, LocalDateTime fechaActual);

}

