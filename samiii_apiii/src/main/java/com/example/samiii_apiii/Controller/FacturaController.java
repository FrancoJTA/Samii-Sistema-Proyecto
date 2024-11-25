package com.example.samiii_apiii.Controller;

import com.example.samiii_apiii.Entity.Factura;
import com.example.samiii_apiii.Entity.Usuario;
import com.example.samiii_apiii.Service.FacturaService;
import com.example.samiii_apiii.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@CrossOrigin("*")
@RestController
@RequestMapping("/facturas")
public class FacturaController {

    @Autowired
    private FacturaService facturaService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/{medidorId}")
    public ResponseEntity<List<Factura>> obtenerFacturasPorMedidor(@PathVariable String medidorId) {
        return ResponseEntity.ok(facturaService.obtenerFacturasPorMedidorId(medidorId));
    }

    @GetMapping
    public ResponseEntity<List<Factura>> obtenerTodasLasFacturas() {
        return ResponseEntity.ok(facturaService.obtenerTodasLasFacturas());
    }
    @PostMapping
    public ResponseEntity<Factura> crearFactura(@RequestBody Factura facturaData) {
        try {
            LocalDateTime fechaActual = LocalDateTime.now();
            LocalDateTime fechaVencimiento = fechaActual.plusMinutes(3);
            facturaData.setFechaEmision(fechaActual);
            facturaData.setFechaVencimiento(fechaVencimiento);

            // Guardar la factura en la base de datos
            Factura facturaGuardada = facturaService.guardarFactura(facturaData);

            return ResponseEntity.status(HttpStatus.CREATED).body(facturaGuardada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }



    @PutMapping("/{facturaId}/pagar")
    public ResponseEntity<Factura> pagarFactura(
            @PathVariable String facturaId,
            @RequestBody Map<String, Object> pagoData) {

        Optional<Factura> facturaOptional = facturaService.obtenerFacturaPorId(facturaId);
        if (facturaOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Factura factura = facturaOptional.get();

        // Extraer datos del JSON usando el mapa
        String usuarioId = (String) pagoData.get("usuario_id");
        float samiCoins = ((Number) pagoData.get("sami_coins")).floatValue();
        float dinero = ((Number) pagoData.get("dinero")).floatValue();

        // Verificar si el usuario tiene suficientes SamiiCoins
        Optional<Usuario> usuarioOptional = usuarioService.findById(usuarioId);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Usuario no encontrado
        }

        Usuario usuario = usuarioOptional.get();
        if (usuario.getSamii_coin() < samiCoins) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Insuficientes SamiiCoins
        }

        // Lógica de pago con SamiiCoins y dinero
        if (procesarPago(factura, samiCoins, dinero)) {
            // Actualizar los SamiiCoins del usuario
            usuario.setSamii_coin(usuario.getSamii_coin() - samiCoins);
            usuarioService.update(usuarioId,usuario);

            // Actualizar los datos de la factura
            factura.setUsuarioId(usuarioId);
            factura.setPagada(true); // Cambiar estado a pagada
            factura.setFechaPagado(LocalDateTime.now());
            if (samiCoins != 0) {
                factura.setDescuentoSamiicoin(samiCoins);
                factura.setUsoSamiiCoins(true);
            }
            facturaService.guardarFactura(factura); // Guardar cambios
            return ResponseEntity.ok(factura);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(factura);
        }
    }

    private boolean procesarPago(Factura factura, float samiCoins, float dinero) {
        float totalPago = (samiCoins * 1) + dinero;

        if (totalPago >= factura.getCostoTotal()) {
            // Manejar lógica adicional, como restar SamiiCoins al usuario si aplica
            return true;
        }

        return false; // Pago insuficiente
    }
}
