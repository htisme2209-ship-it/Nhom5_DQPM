package com.danang.railway.entity;

import java.io.Serializable;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
public class GaTuyenId implements Serializable {
    private String maGa;
    private String maTuyen;
}
