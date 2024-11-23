package com.example.samiii_apiii.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
// no estoy seguro de esta entidad pero aun no tienee elservicio creado
@Data
@Document(collection = "Samiicoin")
public class SamiiCoin {
    @Id
    private String transaccion_id;

    // Usuario asociado
    private String usuario_id;

    // Detalles de la transacción
    private int cantidad;        // Puntos ganados o usados
    private String tipo;         // "Ganancia" o "Descuento"
    private String descripcion;  // Detalle de la transacción
    private Date fecha;          // Fecha de la transacción
}
