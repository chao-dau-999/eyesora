package vn.edu.fpt.eyesora.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
@Table(name = "classes")
public class Class {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "class_id", nullable = false, length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "school_id", nullable = false)
    private Facility school;

    @Column(name = "class_name", nullable = false, length = 50)
    private String className;

    @Column(name = "grade", nullable = false)
    private Integer grade;

    @Column(name = "school_year", nullable = false, length = 20)
    private String schoolYear;
}