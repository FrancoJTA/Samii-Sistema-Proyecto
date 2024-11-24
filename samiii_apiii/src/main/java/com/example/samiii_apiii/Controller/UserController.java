package com.example.samiii_apiii.Controller;

import com.example.samiii_apiii.Entity.Usuario;
import com.example.samiii_apiii.Entity.Zona;
import com.example.samiii_apiii.Entity.prop_medidor;
import com.example.samiii_apiii.Service.EmailService;
import com.example.samiii_apiii.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/usuarios")
public class UserController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable String id) {
        return usuarioService.findById(id)
                .map(usuario -> new ResponseEntity<>(usuario, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<?> createUsuario(@RequestBody Usuario usuario) {
        try {
            // Buscar si el usuario ya existe en la base de datos
            Optional<Usuario> existingUserOpt = usuarioService.findByCorreo(usuario.getCorreo());

            if (existingUserOpt.isPresent()) {
                // Si el usuario ya existe, actualizar la información
                Usuario existingUser = existingUserOpt.get();

                // Extender la lista de prop_medidor
                List<prop_medidor> existingMedidores = existingUser.getPropietario_medidor();
                List<prop_medidor> newMedidores = usuario.getPropietario_medidor();

                newMedidores.forEach(newMedidor -> {
                    boolean exists = existingMedidores.stream()
                            .anyMatch(existingMedidor -> existingMedidor.getMedidor_id().equals(newMedidor.getMedidor_id()));
                    if (!exists) {
                        existingMedidores.add(newMedidor);
                    }
                });

                existingUser.setPropietario_medidor(existingMedidores);

                // Actualizar otros datos (excepto el correo)
                if (usuario.getNombre() != null) {
                    existingUser.setNombre(usuario.getNombre());
                }
                if (usuario.getApellido() != null) {
                    existingUser.setApellido(usuario.getApellido());
                }
                if (usuario.getTelefono() != null) {
                    existingUser.setTelefono(usuario.getTelefono());
                }
                if (usuario.getRoles() != null) {
                    existingUser.setRoles(usuario.getRoles());
                }

                // Guardar el usuario actualizado en la base de datos
                Usuario updatedUser = usuarioService.save(existingUser);

                // Enviar correo avisando sobre la adición del medidor
                emailService.sendMedidorAddedEmail(
                        existingUser.getCorreo(),
                        "Se agregó un nuevo medidor",
                        "Se ha añadido un nuevo medidor a tu cuenta."
                );

                return ResponseEntity.status(HttpStatus.OK).body(updatedUser);

            } else {
                // Si el usuario no existe, crear uno nuevo
                // Generar una contraseña aleatoria
                String generatedPassword = generateRandomPassword();
                usuario.setPassword(generatedPassword);

                // Guardar el usuario en la base de datos
                Usuario newUser = usuarioService.save(usuario);

                // Enviar correo de bienvenida con la contraseña generada
                emailService.sendWelcomeEmail(
                        usuario.getCorreo(),
                        "Bienvenido a Samiii",
                        generatedPassword
                );

                return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creando el usuario: " + e.getMessage());
        }
    }


    private String generateRandomPassword() {
        int min = 100000; // Número mínimo de 6 dígitos
        int max = 999999; // Número máximo de 6 dígitos
        int randomPassword = (int) (Math.random() * (max - min + 1)) + min;
        return String.valueOf(randomPassword);
    }

    @PostMapping("/find-correo")
    public ResponseEntity<Usuario> getUsuarioByCorreo(@RequestBody Map<String, String> request) {
        try {
            String correo = request.get("correo");
            if (correo == null || correo.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return usuarioService.findByCorreo(correo)
                    .map(usuario -> new ResponseEntity<>(usuario, HttpStatus.OK))
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable String id, @RequestBody Usuario usuarioDetails) {
        Usuario updatedUsuario = usuarioService.update(id, usuarioDetails);
        return ResponseEntity.ok(updatedUsuario);
    }



    //Actualizar Parte Cliente Miembros
    @GetMapping("/find-by-medidor/{medidorId}")
    public ResponseEntity<List<Usuario>> getUsuariosByMedidorId(@PathVariable String medidorId) {
        try {
            List<Usuario> usuarios = usuarioService.findByMedidorId(medidorId);
            if (usuarios.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Collections.emptyList());
            }
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    @PutMapping("/update-prop-medidor")
    public ResponseEntity<String> updatePropMedidor(@RequestBody Map<String, Object> request) {
        try {
            String usuarioId = (String) request.get("usuario_id");
            String medidorId = (String) request.get("medidor_id");

            if (usuarioId == null || medidorId == null) {
                return ResponseEntity.badRequest().body("Los campos 'usuario_id' y 'medidor_id' son obligatorios.");
            }

            Boolean corteLuz = (Boolean) request.get("corte_luz");
            Boolean verLectura = (Boolean) request.get("ver_lectura");
            Boolean pagarFacturas = (Boolean) request.get("pagar_facturas");

            boolean updated = usuarioService.updatePropMedidor(usuarioId, medidorId, corteLuz, verLectura, pagarFacturas);

            if (updated) {
                return ResponseEntity.ok("Propiedad del medidor actualizada correctamente.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario o medidor no encontrado.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno del servidor: " + e.getMessage());
        }
    }

    @PutMapping("/remove-prop-medidor")
    public ResponseEntity<String> removePropMedidor(@RequestBody Map<String, String> request) {
        try {
            String usuarioId = request.get("usuario_id");
            String medidorId = request.get("medidor_id");

            if (usuarioId == null || medidorId == null) {
                return ResponseEntity.badRequest().body("Los campos 'usuario_id' y 'medidor_id' son obligatorios.");
            }

            boolean removed = usuarioService.removePropMedidor(usuarioId, medidorId);

            if (removed) {
                return ResponseEntity.ok("Propietario del medidor eliminado correctamente.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Usuario o medidor no encontrado.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno del servidor: " + e.getMessage());
        }
    }

    @GetMapping("/owner/{medidorId}")
    public ResponseEntity<Usuario> getOwnerByMedidorId(@PathVariable String medidorId) {
        try {
            Optional<Usuario> usuarioOpt = usuarioService.findOwnerByMedidorId(medidorId);

            if (usuarioOpt.isPresent()) {
                return ResponseEntity.ok(usuarioOpt.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }


    //Obtener Usuarios Por sus zona
    @GetMapping("/find-zona/{zona_id}")
    public ResponseEntity<List<Usuario>> getUsuariosByZona (@PathVariable String zona_id) {
        try {
            List<Usuario> usuarios = usuarioService.finddByZonaid(zona_id);
            if (usuarios.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Collections.emptyList());
            }
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable String id) {
        usuarioService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}