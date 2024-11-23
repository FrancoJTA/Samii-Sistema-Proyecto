package com.example.samiii_apiii.Repository;

import com.example.samiii_apiii.Entity.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    Optional<Usuario> findByCorreo(String correo);



    List<Usuario> findByZonaid(String zonaId);


    @Query("{'propietario_medidor.medidor_id': ?0}")
    List<Usuario> findByMedidorId(String medidorId);
}
