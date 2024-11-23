package com.example.samiii_apiii.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Document(collection = "Solicitud")
public class Solicitud {

    @Id
    private String solicitud_id;
    private String reporte_id;

    //datos importante de la solicitud
    private String tipo;
    private String descripcion;
    private LocalDateTime fechasolicitud;

    // no estoy seguro de si existe este dato o si utilizara
    private String estado;

    // datos que reutilizare para el apartado usuario
    private String nombre;
    private String apellido;
    private String correo;
    private String ci;
    private String telefono;

    //lo voy a usar para obtener la ubicacion exacta
    // datos que reutilizare para el apartado medidor
    private String Latitud;
    private String Longitud;

}