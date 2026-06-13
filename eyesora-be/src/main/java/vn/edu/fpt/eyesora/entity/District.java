package vn.edu.fpt.eyesora.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "districts")
public class District {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "district_id", nullable = false, length = 36)
    private String id;

    @Column(name = "district_name", nullable = false, length = 100)
    private String districtName;
}