package vn.edu.fpt.eyesora.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "exam_campaigns")
public class ExamCampaign {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "campaign_id", nullable = false, length = 36)
    private String campaignId;

    @Column(name = "campaign_title", nullable = false)
    private String campaignTitle;

    @Column(name = "school_year", nullable = false, length = 20)
    private String schoolYear;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "organization_id", nullable = false)
    private Facility organization;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "target_school_id", nullable = false)
    private Facility targetSchool;
}