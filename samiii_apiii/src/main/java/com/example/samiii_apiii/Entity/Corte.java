package com.example.samiii_apiii.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "Corte")
public class Corte {
    @Id
    private String corte_id;
    private String medidorId;
    private String usuarioId;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
}
