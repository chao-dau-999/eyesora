package vn.edu.fpt.eyesora.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "eye_exam_records")
public class EyeExamRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "exam_id", nullable = false, length = 36)
    private String examId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    private ExamCampaign campaign;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_id", nullable = false)
    private Classes classesField;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "examiner_id")
    private User examiner;

    @CreationTimestamp
    @Column(name = "exam_date")
    private Instant examDate;

    @Column(name = "va_left_without_glasses", nullable = false)
    private Float vaLeftWithoutGlasses;

    @Column(name = "va_left_with_glasses")
    private Float vaLeftWithGlasses;

    @ColumnDefault("0")
    @Column(name = "sph_left")
    private Float sphLeft;

    @ColumnDefault("0")
    @Column(name = "cyl_left")
    private Float cylLeft;

    @Column(name = "axis_left")
    private Integer axisLeft;

    @Column(name = "va_right_without_glasses", nullable = false)
    private Float vaRightWithoutGlasses;

    @Column(name = "va_right_with_glasses")
    private Float vaRightWithGlasses;

    @ColumnDefault("0")
    @Column(name = "sph_right")
    private Float sphRight;

    @ColumnDefault("0")
    @Column(name = "cyl_right")
    private Float cylRight;

    @Column(name = "axis_right")
    private Integer axisRight;

    @ColumnDefault("0")
    @Column(name = "is_deleted")
    private Boolean isDeleted;
}