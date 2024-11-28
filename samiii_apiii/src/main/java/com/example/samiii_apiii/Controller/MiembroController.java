package com.example.samiii_apiii.Controller;

import com.example.samiii_apiii.Entity.OTPRequest;
import com.example.samiii_apiii.Entity.Usuario;
import com.example.samiii_apiii.Entity.prop_medidor;
import com.example.samiii_apiii.Service.EmailService;
import com.example.samiii_apiii.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/miembro")
public class MiembroController {
    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private EmailService emailService;

    // Almacén para guardar OTP junto con tiempos de expiración
    private final Map<String, String> otpStorage = new HashMap<>();
    private final Map<String, Timer> otpTimers = new HashMap<>();

    @PostMapping("/verificar")
    public String enviarOTP(@RequestBody OTPRequest otpRequest) {
        String correo = otpRequest.getCorreo();

        // Generar un OTP aleatorio de 6 dígitos
        String otp = String.format("%05d", new Random().nextInt(100000));

        // Almacenar el OTP en memoria
        otpStorage.put(correo, otp);

        // Configurar un temporizador para eliminar el OTP después de 5 minutos
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                otpStorage.remove(correo);
                otpTimers.remove(correo);
                System.out.println("OTP eliminado para " + correo);
            }
        }, 300000); // 5 minutos en milisegundos
        otpTimers.put(correo, timer);

        // Enviar correo con el OTP
        emailService.sendEmail(correo, "Tu código OTP", otp);

        return "OTP enviado a " + correo;

    }

    @PostMapping("/registrar")
    public Usuario registrarUsuario(@RequestBody Map<String, Object> requestData) {
        System.out.println(requestData);
        String correo = (String) requestData.get("correo");
        String otp = (String) requestData.get("otp");
        String nombre = (String) requestData.get("nombre");
        String apellido = (String) requestData.get("apellido");
        List<Map<String, Object>> propietarioMedidorList = (List<Map<String, Object>>) requestData.get("propietario_medidor");

        // Validar el OTP
        if (otpStorage.containsKey(correo) && otpStorage.get(correo).equals(otp)) {
            // Cancelar y remover el temporizador del OTP
            Timer timer = otpTimers.get(correo);
            if (timer != null) {
                timer.cancel();
                otpTimers.remove(correo);
            }

            // Crear la lista de prop_medidor a partir de los datos de la solicitud
            List<prop_medidor> nuevosPropMedidores = propietarioMedidorList.stream().map(pm -> {
                prop_medidor nuevoMedidor = new prop_medidor();
                nuevoMedidor.setRol("USER");
                nuevoMedidor.setCorte_luz(false);
                nuevoMedidor.setVer_lectura(false);
                nuevoMedidor.setPagar_facturas(false);
                nuevoMedidor.setMedidor_id((String) pm.get("medidor_id"));
                return nuevoMedidor;
            }).toList();

            // Obtener el dueño del medidor
            String medidorId = nuevosPropMedidores.get(0).getMedidor_id();
            Optional<Usuario> dueñoMedidorOpt = usuarioService.findByMedidorId(medidorId)
                    .stream().findFirst();
            String nombreDueño = dueñoMedidorOpt.map(Usuario::getNombre).orElse("N/A");

            // Buscar si el correo ya existe en la base de datos
            Optional<Usuario> usuarioExistenteOpt = usuarioService.findByCorreo(correo);

            if (usuarioExistenteOpt.isPresent()) {
                // Si el usuario ya existe, agregar los nuevos medidores a su lista
                Usuario usuarioExistente = usuarioExistenteOpt.get();
                List<prop_medidor> medidoresExistentes = usuarioExistente.getPropietario_medidor();

                // Evitar duplicados en la lista de medidores
                nuevosPropMedidores.forEach(nuevoMedidor -> {
                    boolean yaExiste = medidoresExistentes.stream()
                            .anyMatch(medidor -> medidor.getMedidor_id().equals(nuevoMedidor.getMedidor_id()));
                    if (!yaExiste) {
                        medidoresExistentes.add(nuevoMedidor);
                    }
                });

                usuarioExistente.setPropietario_medidor(medidoresExistentes);
                usuarioService.save(usuarioExistente);

                // Enviar correo indicando que ya es miembro
                emailService.sendMemberNotification(
                        correo,
                        "Nuevo acceso como miembro",
                        nombreDueño
                );

                return usuarioExistente;
            } else {
                // Crear un nuevo usuario si no existe
                Usuario nuevoUsuario = new Usuario();
                nuevoUsuario.setCorreo(correo);
                nuevoUsuario.setNombre(nombre);
                nuevoUsuario.setApellido(apellido);
                nuevoUsuario.setPropietario_medidor(nuevosPropMedidores);

                // Generar contraseña temporal
                String temporaryPassword = generateRandomPassword();
                nuevoUsuario.setPassword(temporaryPassword);

                // Guardar el nuevo usuario
                Usuario usuarioGuardado = usuarioService.save(nuevoUsuario);

                // Enviar correo de bienvenida
                emailService.sendWelcomeMemberEmail(
                        correo,
                        "Bienvenido a Samiii",
                        temporaryPassword,
                        nombreDueño
                );

                otpStorage.remove(correo);
                return usuarioGuardado;
            }
        } else {
            throw new IllegalArgumentException("OTP inválido o expirado.");
        }
    }


    private String generateRandomPassword() {
        int min = 100000;
        int max = 999999;
        int randomPassword = (int) (Math.random() * (max - min + 1)) + min;
        return String.valueOf(randomPassword);
    }
}
