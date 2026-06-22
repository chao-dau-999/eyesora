package vn.edu.fpt.eyesora.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.fpt.eyesora.dto.request.CampaignRequest;
import vn.edu.fpt.eyesora.dto.response.CampaignResponse;
import vn.edu.fpt.eyesora.entity.ExamCampaign;
import vn.edu.fpt.eyesora.entity.Facility;
import vn.edu.fpt.eyesora.exceptions.BusinessException;
import vn.edu.fpt.eyesora.exceptions.ResourceNotFoundException;
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
        // 1. Kiểm tra đầu vào
        if (req.orgId() == null || req.targetId() == null) {
            throw new BusinessException("Organization and Target are required.");
        }

        // 2. Tìm kiếm (Sử dụng ID từ request)
        Facility org = facilityRepository.findById(req.orgId())
                .orElseThrow(() -> new ResourceNotFoundException("Org not found: " + req.orgId()));
        Facility target = facilityRepository.findById(req.targetId())
                .orElseThrow(() -> new ResourceNotFoundException("Target not found: " + req.targetId()));

        // 3. Logic nghiệp vụ
        if (org.getFacilityType() == Facility.FacilityType.SCHOOL) {
            throw new BusinessException("Organization must be a Medical Facility.");
        }

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
    public void setCampaignStatus(String id, String statusStr) {
        ExamCampaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found with ID: " + id));

        try {
            ExamCampaign.CampaignStatus newStatus = ExamCampaign.CampaignStatus.valueOf(statusStr.toUpperCase());
            campaign.setStatus(newStatus);
            campaignRepository.save(campaign);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + statusStr);
        }
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