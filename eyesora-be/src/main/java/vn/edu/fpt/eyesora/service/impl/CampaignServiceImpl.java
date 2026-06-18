package vn.edu.fpt.eyesora.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.fpt.eyesora.dto.request.CampaignRequest;
import vn.edu.fpt.eyesora.dto.response.CampaignResponse;
import vn.edu.fpt.eyesora.entity.ExamCampaign;
import vn.edu.fpt.eyesora.entity.Facility;
import vn.edu.fpt.eyesora.repository.CampaignRepository;
import vn.edu.fpt.eyesora.repository.FacilityRepository;
import vn.edu.fpt.eyesora.service.ICampaignService;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CampaignServiceImpl implements ICampaignService {

    private final CampaignRepository campaignRepository;
    private final FacilityRepository facilityRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CampaignResponse> getAllCampaigns() {
        return campaignRepository.findAll().stream().map(campaign ->
                CampaignResponse.builder()
                        .campaignId(campaign.getCampaignId())
                        .campaignTitle(campaign.getCampaignTitle())
                        .facilityYear(campaign.getFacilityYear())
                        .startDate(campaign.getStartDate())
                        .managerName(campaign.getManagerName())
                        .status(campaign.getStatus() != null ? campaign.getStatus().name() : "ACTIVE")
                        .organizationName(campaign.getOrganization() != null ?
                                campaign.getOrganization().getFacilityName() : null)
                        .targetFacilityName(campaign.getTargetfacility() != null ?
                                campaign.getTargetfacility().getFacilityName() : null)
                        .build()
        ).toList();
    }

    @Override
    public CampaignResponse createCampaign(CampaignRequest req) {
        Facility org = facilityRepository.findById(req.orgId())
                .orElseThrow(() -> new RuntimeException("Organization not found with ID: " + req.orgId()));

        Facility target = facilityRepository.findById(req.targetId())
                .orElseThrow(() -> new RuntimeException("Target facility not found with ID: " + req.targetId()));

        ExamCampaign campaign = new ExamCampaign();
        campaign.setCampaignTitle(req.title());
        campaign.setFacilityYear(req.year());
        campaign.setStartDate(req.startDate());
        campaign.setManagerName(req.managerName());
        campaign.setStatus(ExamCampaign.CampaignStatus.ACTIVE);
        campaign.setOrganization(org);
        campaign.setTargetfacility(target);

        return mapToResponse(campaignRepository.save(campaign));
    }

    @Override
    public void lockCampaign(String id) {
        ExamCampaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exam campaign not found with ID: " + id));
        campaign.setStatus(ExamCampaign.CampaignStatus.LOCKED);
        campaignRepository.save(campaign);
    }

    private CampaignResponse mapToResponse(ExamCampaign campaign) {
        return CampaignResponse.builder()
                .campaignId(campaign.getCampaignId())
                .campaignTitle(campaign.getCampaignTitle())
                .facilityYear(campaign.getFacilityYear())
                .startDate(campaign.getStartDate())
                .managerName(campaign.getManagerName())
                .status(campaign.getStatus() != null ? campaign.getStatus().name() : "ACTIVE")
                .organizationName(campaign.getOrganization() != null ? campaign.getOrganization().getFacilityName() : null)
                .targetFacilityName(campaign.getTargetfacility() != null ? campaign.getTargetfacility().getFacilityName() : null)
                .build();
    }

}