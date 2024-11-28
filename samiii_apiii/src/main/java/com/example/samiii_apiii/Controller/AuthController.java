package com.example.samiii_apiii.Controller;

import com.example.samiii_apiii.Entity.LoginRequest;
import com.example.samiii_apiii.Entity.OTPRequest;
import com.example.samiii_apiii.Entity.Usuario;
import com.example.samiii_apiii.Service.EmailService;
import com.example.samiii_apiii.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@CrossOrigin("*")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private EmailService emailService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final Map<String, String> otpStore = new HashMap<>();

    @PostMapping("/login/cliente")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {


        boolean exist = usuarioService.verificarRolPorCorreo(loginRequest.getCorreo(),"USER");
        if (!exist) {
            return ResponseEntity.status(404).body("El usuario no existe.");
        }
        Optional<Usuario> usuarioOpt = usuarioService.findByCorreo(loginRequest.getCorreo());
        Usuario usuario = usuarioOpt.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
            return ResponseEntity.status(401).body("Contraseña incorrecta.");
        }

        String otp = generateOTP();
        otpStore.put(usuario.getCorreo(), otp);

        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                otpStore.remove(usuario.getCorreo());
                System.out.println("OTP eliminado para " + usuario.getCorreo());
            }
        }, 300000);

        emailService.sendOTPEmail(usuario.getCorreo(),"Tu Codigo OTP",otp);

        return ResponseEntity.ok("OTP enviado a tu correo.");
    }
    @PostMapping("/login/admin")
    public ResponseEntity<String> loginadmimn(@RequestBody LoginRequest loginRequest) {
        boolean exist = usuarioService.verificarRolPorCorreo(loginRequest.getCorreo(),"ADMIN");
        if (!exist) {
            return ResponseEntity.status(404).body("El usuario no existe.");
        }

        Optional<Usuario> usuarioOpt = usuarioService.findByCorreo(loginRequest.getCorreo());

        Usuario usuario = usuarioOpt.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
            return ResponseEntity.status(401).body("Contraseña incorrecta.");
        }

        String otp = generateOTP();
        otpStore.put(usuario.getCorreo(), otp);

        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                otpStore.remove(usuario.getCorreo());
                System.out.println("OTP eliminado para " + usuario.getCorreo());
            }
        }, 300000);

        emailService.sendOTPEmail(usuario.getCorreo(),"Tu Codigo OTP",otp);

        return ResponseEntity.ok("OTP enviado a tu correo.");
    }
    @PostMapping("/login/monitor")
    public ResponseEntity<String> loginMonitor(@RequestBody LoginRequest loginRequest) {


        boolean exist = usuarioService.verificarRolPorCorreo(loginRequest.getCorreo(),"MONITOR");

        if (!exist) {
            return ResponseEntity.status(404).body("El usuario no existe.");
        }

        Optional<Usuario> usuarioOpt = usuarioService.findByCorreo(loginRequest.getCorreo());

        Usuario usuario = usuarioOpt.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
            return ResponseEntity.status(401).body("Contraseña incorrecta.");
        }

        String otp = generateOTP();
        otpStore.put(usuario.getCorreo(), otp);

        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                otpStore.remove(usuario.getCorreo());
                System.out.println("OTP eliminado para " + usuario.getCorreo());
            }
        }, 300000);

        emailService.sendOTPEmail(usuario.getCorreo(),"Tu Codigo OTP",otp);

        return ResponseEntity.ok("OTP enviado a tu correo.");
    }


    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOTP(@RequestBody OTPRequest otpRequest) {
        String storedOtp = otpStore.get(otpRequest.getCorreo());

        if (storedOtp != null && storedOtp.equals(otpRequest.getOtp())) {
            otpStore.remove(otpRequest.getCorreo());
            return ResponseEntity.ok("Autenticación exitosa.");
        } else {
            return ResponseEntity.status(401).body("OTP inválido o expirado.");
        }
    }


    private String generateOTP() {
        Random random = new Random();
        return String.format("%05d", random.nextInt(100000));
    }
}