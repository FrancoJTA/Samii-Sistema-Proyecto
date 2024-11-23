package com.example.samiii_apiii.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Document(collection = "RespuestaReporte")
public class RespuestaReporte {
    @Id
    private String respuesta_id;

    private String Reporte_id;
    private String Respuesta;
    private String Descripcion;
    public LocalDateTime FechaRespuesta;
    private String monitor_id;
}