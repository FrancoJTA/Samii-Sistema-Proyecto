package com.example.samiii_apiii.Repository;

import com.example.samiii_apiii.Entity.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    Optional<Usuario> findByCorreo(String correo);



    @Query("{ 'zonaid': ?0, 'roles': { $in: [?1] } }")
    List<Usuario> findByZonaidAndRolesContaining(String zonaid, String rol);

    @Query("{'propietario_medidor.medidor_id': ?0}")
    List<Usuario> findByMedidorId(String medidorId);

    @Query("{'propietario_medidor.medidor_id': {$in: ?0}}")
    List<Usuario> findByMedidorIdIn(List<String> medidorIds);

    @Query("{'roles': 'USER', 'propietario_medidor.rol': 'OWNER'}")
    List<Usuario> findUsuariosWithUserRoleAndOwnerMedidor();


    @Query("{'roles': 'MONITOR'}")
    List<Usuario> findUsuariosWithMonitorRole();

}
