package com.example.samiii_apiii.Controller;

import com.example.samiii_apiii.Entity.SamiTrans;
import com.example.samiii_apiii.Service.SamiTransService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/samicoin")
@CrossOrigin("*")
public class SamiTransController {
    @Autowired
    private SamiTransService samiTransService;

    /**
     * Endpoint para realizar una transacción de SamiiCoins entre usuarios.
     *
     * @param transData JSON con los datos de la transacción: origenId, destinoId y cantidad
     * @return Detalles de la transacción realizada
     */
    @PostMapping
    public ResponseEntity<SamiTrans> realizarTransaccion(@RequestBody Map<String, Object> transData) {
        try {
            String origenId = (String) transData.get("origenId");
            String destinoId = (String) transData.get("destinoId");
            float cantidad = ((Number) transData.get("cantidad")).floatValue();

            SamiTrans transaccion = samiTransService.realizarTransaccion(origenId, destinoId, cantidad);
            return ResponseEntity.status(HttpStatus.CREATED).body(transaccion);
        } catch (IllegalArgumentException    e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
