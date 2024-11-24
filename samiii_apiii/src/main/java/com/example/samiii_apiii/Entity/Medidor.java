package com.example.samiii_apiii.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private float lectura;
    private boolean activo;
    private Date fechaInstalacion;
    private String Latitud;
    private String Longitud;
}
