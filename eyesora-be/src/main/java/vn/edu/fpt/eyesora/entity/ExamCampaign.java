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
    @Column(name = "campaign_id", length = 36)
    private String campaignId;

    @Column(name = "campaign_title", nullable = false)
    private String campaignTitle;

    @Column(name = "facility_year", length = 20)
    private String facilityYear;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "manager_name")
    private String managerName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CampaignStatus status = CampaignStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Facility organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_facility_id")
    private Facility targetfacility;

    public enum CampaignStatus { ACTIVE, LOCKED, DELETED }
}