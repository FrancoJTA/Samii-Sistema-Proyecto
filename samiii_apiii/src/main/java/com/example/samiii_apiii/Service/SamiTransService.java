package com.example.samiii_apiii.Service;

import com.example.samiii_apiii.Entity.SamiTrans;
import com.example.samiii_apiii.Entity.Usuario;
import com.example.samiii_apiii.Repository.Sami_transRepository;
import com.example.samiii_apiii.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SamiTransService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private Sami_transRepository samiTransRepository;

    public SamiTrans realizarTransaccion(String origenId, String destinoId, float cantidad) {
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad a transferir debe ser mayor a 0.");
        }

        Usuario origen = usuarioRepository.findById(origenId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario origen no encontrado."));
        Usuario destino = usuarioRepository.findById(destinoId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario destino no encontrado."));

        if (origen.getSamii_coin() < cantidad) {
            throw new IllegalArgumentException("Saldo insuficiente en el usuario origen.");
        }

        // Realizar la transferencia
        origen.setSamii_coin(origen.getSamii_coin() - cantidad);
        destino.setSamii_coin(destino.getSamii_coin() + cantidad);
        usuarioRepository.save(origen);
        usuarioRepository.save(destino);

        // Registrar la transacción
        SamiTrans transaccion = new SamiTrans();
        transaccion.setSami_trans_id(java.util.UUID.randomUUID().toString());
        transaccion.setOrigenid(origenId);
        transaccion.setDestinoid(destinoId);
        transaccion.setSamiitransiPassword(cantidad);
        transaccion.setSamiitransiDate(LocalDateTime.now());

        return samiTransRepository.save(transaccion);
    }
}
