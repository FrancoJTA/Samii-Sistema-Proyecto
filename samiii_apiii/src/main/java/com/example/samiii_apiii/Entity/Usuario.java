package com.example.samiii_apiii.Entity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "Usuario")
public class Usuario {
    @Id
    private String usuario_id;

    //Datos generales
    private String nombre;

    @Indexed(unique = true)
    private String correo;

    private String apellido;

    @Indexed(unique = true)
    private String ci;
    private String password;
    private String telefono;


    private List<String> roles;

    //Cliente Datos
    private float samii_coin;
    private List<prop_medidor> propietario_medidor;


    //Empleado Zona
    private String zonaid;
    private String estado;

}