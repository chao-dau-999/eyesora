package vn.edu.fpt.eyesora.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;

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
    private LocalDate examDate;

//    private Boolean hasRefractiveError;
//
//    private String diagnosis;

    // KHÔNG KÍNH
    @Column(name = "va_left_without_glasses", nullable = false)
    private Float vaLeftWithoutGlasses;

    @Column(name = "va_right_without_glasses", nullable = false)
    private Float vaRightWithoutGlasses;


    // CÓ KÍNH(CŨ)
    @Column(name = "va_left_old_glasses")
    private Float vaLeftOldGlasses;

    @Column(name = "va_right_old_glasses")
    private Float vaRightOldGlasses;


    // KÍNH LỖ
    @Column(name = "va_left_pinhole")
    private Float vaLeftPinhole;

    @Column(name = "va_right_pinhole")
    private Float vaRightPinhole;


    // ĐỘ CẦU
    @ColumnDefault("0")
    @Column(name = "sph_left")
    private Float sphLeft;

    @ColumnDefault("0")
    @Column(name = "sph_right")
    private Float sphRight;


    // ĐỘ TRỤ
    @ColumnDefault("0")
    @Column(name = "cyl_left")
    private Float cylLeft;

    @ColumnDefault("0")
    @Column(name = "cyl_right")
    private Float cylRight;


    // TRỤC
    @Column(name = "axis_left")
    private Integer axisLeft;

    @Column(name = "axis_right")
    private Integer axisRight;


    // TLCK
    @Column(name = "va_left_with_glasses")
    private Float vaLeftWithGlasses;

    @Column(name = "va_right_with_glasses")
    private Float vaRightWithGlasses;


    // KCĐT
    @Column(name = "pd_left")
    private String pdLeft;

    @Column(name = "pd_right")
    private String pdRight;

    @ColumnDefault("0")
    @Column(name = "is_deleted")
    private Boolean isDeleted;
}