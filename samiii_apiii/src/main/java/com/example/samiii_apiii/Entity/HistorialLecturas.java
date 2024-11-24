package com.example.samiii_apiii.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Document(collection = "HistorialLecturas")
public class HistorialLecturas {
    @Id
    private String historial_id;

    private String medidor_id;

    private float lectura;
    private LocalDateTime fechaLectura;

    private float energiaProducida;
    private float energiaConsumida;
}
