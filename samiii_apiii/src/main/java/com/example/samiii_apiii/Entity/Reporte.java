package com.example.samiii_apiii.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Document(collection = "Reporte")
public class Reporte {

    // informacion sobre el reporte
    @Id
    private String reporte_id;

    private String tipo;
    private String descripcion;
    private LocalDateTime fechareporte;
    private LocalDateTime fechaAcepta;
    private LocalDateTime fechaCompletado;
    private String respuesta_id;


    private String estado;
    //dato del monitor que hizo e reporte
    private String zonaid;
    private String Monitor_id;
    private String medidor_id;
    private String solicitud_id;
}