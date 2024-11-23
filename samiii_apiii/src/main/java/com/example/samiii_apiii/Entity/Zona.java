package com.example.samiii_apiii.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "Zona")
public class Zona {
    @Id
    private String zona_id;
    private String latitud;
    private String longitud;
}
