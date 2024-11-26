package com.example.samiii_apiii.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "ReporteTransformador")
public class ReporteTransformador {
    @Id
    private String reportetransformador_id;
    private String zonaId;
    private LocalDateTime horaPico;
    private float incrementoPotencia;  // Potencia adicional requerida
    private String estado;  // "alto rendimiento", "bajo rendimiento", "estable"
}
