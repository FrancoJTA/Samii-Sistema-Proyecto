package com.example.samiii_apiii.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "Zona")
public class Zona {
    @Id
    private String zona_id;
    private String Name;
    private String latitud;
    private String longitud;
    private float limiteInferior;  // Límite inferior del consumo
    private float limiteSuperior;  // Límite superior del consumo
    private String estado;  // Puede ser "alto rendimiento", "bajo rendimiento" o "estable"
    private float potenciaIncrementada;  // Incremento de potencia si el estado es alto rendimiento
    private LocalDateTime horaPico;  // Hora en que ocurrió el pico de consumo
}
