package com.example.samiii_apiii.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "Medidor")
public class Medidor {
    @Id
    private String medidor_id;
    private String numero_serie;
    private String modelo;
    private String tipo;
    private String name;
    private float lectura;
    private boolean activo;
    private LocalDateTime fechaInstalacion;
    private String Latitud;
    private String Longitud;
    private String zonaid;

    // Atributo nuevo para el consumo acumulado
    private float ultimaLectura; // Consumo acumulado en tiempo real
}
