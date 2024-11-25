package com.example.samiii_apiii.Entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document
public class SamiTrans {

    @Id
    private String sami_trans_id;

    private String origenid;
    private String destinoid;
    private float samiitransiPassword;
    private LocalDateTime samiitransiDate;
}
