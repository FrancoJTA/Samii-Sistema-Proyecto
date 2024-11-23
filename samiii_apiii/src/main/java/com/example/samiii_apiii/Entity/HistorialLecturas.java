package com.example.samiii_apiii.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "HistorialLecturas")
public class HistorialLecturas {
    @Id
    private String historial_id;

    // Medidor asociado
    private String medidor_id;

    // Datos de lectura
    private float lectura;       // Valor de la lectura
    private Date fechaLectura;   // Fecha en que se registró la lectura

    // Datos de panel solar
    private float energiaProducida; // Energía producida por panel solar (si aplica)
    private float energiaConsumida; // Energía consumida realmente
}
