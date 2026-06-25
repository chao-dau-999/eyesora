package vn.edu.fpt.eyesora.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Formula;

import java.util.List;


@Getter
@Setter
@Entity
@Table(name = "classes")
public class Classes {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "class_id", nullable = false, length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "facility_id", nullable = false)
    private Facility facility;

    @Column(name = "class_name", nullable = false, length = 50)
    private String className;

    @Column(name = "grade", nullable = false)
    private Integer grade;

    @Column(name = "school_year", nullable = false, length = 20)
    private String schoolYear;

    @OneToMany(mappedBy = "classes", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Patient> patients;

    @Formula("(SELECT COUNT(*) FROM patients p WHERE p.class_id = class_id AND p.is_deleted = false)")
    private Long patientCount;
}