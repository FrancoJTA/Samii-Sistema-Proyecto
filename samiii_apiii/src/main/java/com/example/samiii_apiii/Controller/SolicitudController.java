package com.example.samiii_apiii.Controller;

import com.example.samiii_apiii.Entity.Solicitud;
import com.example.samiii_apiii.Entity.Usuario;
import com.example.samiii_apiii.Service.EmailService;
import com.example.samiii_apiii.Service.SolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@CrossOrigin("*")
@RestController
@RequestMapping("/solicitud")
public class SolicitudController {

    @Autowired
    private SolicitudService solicitudService;

    @Autowired
    private EmailService emailService;

    private final Map<String, String> otpStorage = new HashMap<>();

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody Map<String, String> request) {
        String correo = request.get("correo");

        if (correo == null || correo.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Correo inválido.");
        }

        // Generar OTP de 6 dígitos
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Almacenar OTP temporalmente
        otpStorage.put(correo, otp);

        // Enviar OTP por correo
        emailService.sendOTPEmail(correo, "Tu código OTP para validar la solicitud", otp);

        return ResponseEntity.ok("OTP enviado al correo.");
    }

    @PostMapping("/validate-otp")
    public ResponseEntity<String> validateOtp(@RequestBody Map<String, String> request) {
        String correo = request.get("correo");
        String otp = request.get("otp");

        if (correo == null || otp == null || correo.isEmpty() || otp.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Datos inválidos.");
        }

        String storedOtp = otpStorage.get(correo);

        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(correo);
            return ResponseEntity.ok("OTP válido.");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("OTP inválido o expirado.");
        }
    }

    @GetMapping
    public List<Solicitud> getAllSolicitud() {
        return solicitudService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Solicitud> getSolicitudById(@PathVariable String id) {
        return solicitudService.findById(id)
                .map(solicitud -> new ResponseEntity<>(solicitud, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public Solicitud createSolicitud(@RequestBody Solicitud solicitud) {
        solicitud.setFechasolicitud(LocalDateTime.now());
        solicitud.setEstado("En Espera");
        return solicitudService.save(solicitud);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Solicitud> updateSolicitud(@PathVariable String id, @RequestBody Solicitud solicitud) {
        Solicitud soli = solicitudService.update(id, solicitud);
        return ResponseEntity.ok(soli);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteSolicitud(@PathVariable String id) {
        solicitudService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
