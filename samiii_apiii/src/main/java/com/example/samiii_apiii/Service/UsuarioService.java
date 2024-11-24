package com.example.samiii_apiii.Service;

import com.example.samiii_apiii.Entity.Usuario;
import com.example.samiii_apiii.Entity.prop_medidor;
import com.example.samiii_apiii.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<Usuario> findAll() {
        return userRepository.findAll();
    }

    public Optional<Usuario> findById(String id) {
        return userRepository.findById(id);
    }

    public Usuario save(Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return userRepository.save(usuario);
    }

    public void deleteById(String id) {
        userRepository.deleteById(id);
    }



    //Obtener Correo
    public Optional<Usuario> findByCorreo(String correo) {
        return userRepository.findByCorreo(correo);
    }




    //Para Monitor Lista de Monitores
    public List<Usuario> finddByZonaid(String zonaid) {
        return userRepository.findByZonaid(zonaid);
    }


    public Optional<Usuario> findOwnerByMedidorId(String medidorId) {
        // Buscar todos los usuarios que tienen el medidor_id
        List<Usuario> usuarios = userRepository.findByMedidorId(medidorId);

        // Filtrar el usuario que tiene el rol OWNER para el medidor_id
        for (Usuario usuario : usuarios) {
            boolean isOwner = usuario.getPropietario_medidor().stream()
                    .anyMatch(pm -> pm.getMedidor_id().equals(medidorId) && pm.getRol().equals("OWNER"));
            if (isOwner) {
                return Optional.of(usuario);
            }
        }
        return Optional.empty();
    }

    //Actualizar sin necesidad de todoos los campos requeridos
    public Usuario update(String id, Usuario usuarioDetails) {
        Usuario existingUsuario = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con id: " + id));

        if (usuarioDetails.getNombre() != null) {
            existingUsuario.setNombre(usuarioDetails.getNombre());
        }
        if (usuarioDetails.getApellido() != null) {
            existingUsuario.setApellido(usuarioDetails.getApellido());
        }
        if (usuarioDetails.getCorreo() != null) {
            existingUsuario.setCorreo(usuarioDetails.getCorreo());
        }
        if (usuarioDetails.getPassword() != null) {
            existingUsuario.setPassword(passwordEncoder.encode(usuarioDetails.getPassword()));
        }
        if (usuarioDetails.getTelefono() != null) {
            existingUsuario.setTelefono(usuarioDetails.getTelefono());
        }
        if (usuarioDetails.getRoles() != null) {
            existingUsuario.setRoles(usuarioDetails.getRoles());
        }
        if (usuarioDetails.getZonaid() != null) {
            existingUsuario.setZonaid(usuarioDetails.getZonaid());
        }
        if (usuarioDetails.getCi() != null) {
            existingUsuario.setCi(usuarioDetails.getCi());
        }
        if (usuarioDetails.getEstado() != null) {
            existingUsuario.setEstado(usuarioDetails.getEstado());
        }
        if (usuarioDetails.getPropietario_medidor() != null) {
            existingUsuario.setPropietario_medidor(usuarioDetails.getPropietario_medidor());
        }
        return userRepository.save(existingUsuario);
    }


    //Encontrar en base al id del medidor
    public List<Usuario> findByMedidorId(String medidorId) {
        return userRepository.findByMedidorId(medidorId);
    }


    //Remueve tu medidor
    //Agregar Logica para eliminar el usuario
    public boolean removePropMedidor(String usuarioId, String medidorId) {
        Optional<Usuario> usuarioOpt = userRepository.findById(usuarioId);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            List<prop_medidor> updatedPropietarioMedidor = usuario.getPropietario_medidor()
                    .stream()
                    .filter(medidor -> !medidor.getMedidor_id().equals(medidorId))
                    .toList();
            if (updatedPropietarioMedidor.size() == usuario.getPropietario_medidor().size()) {
                return false;
            }
            usuario.setPropietario_medidor(updatedPropietarioMedidor);
            userRepository.save(usuario);
            return true;
        }

        return false;
    }

    //Cambiar Permisos
    public boolean updatePropMedidor(String usuarioId, String medidorId, Boolean corteLuz, Boolean verLectura, Boolean pagarFacturas) {
        Optional<Usuario> usuarioOpt = userRepository.findById(usuarioId);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            for (prop_medidor medidor : usuario.getPropietario_medidor()) {
                if (medidor.getMedidor_id().equals(medidorId)) {
                    if (corteLuz != null) {
                        medidor.setCorte_luz(corteLuz);
                    }
                    if (verLectura != null) {
                        medidor.setVer_lectura(verLectura);
                    }
                    if (pagarFacturas != null) {
                        medidor.setPagar_facturas(pagarFacturas);
                    }
                    userRepository.save(usuario);
                    return true;
                }
            }
        }

        return false; // Usuario o medidor no encontrado
    }

}
