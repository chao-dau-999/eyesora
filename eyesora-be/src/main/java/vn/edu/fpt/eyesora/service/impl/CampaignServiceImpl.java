package vn.edu.fpt.eyesora.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public Page<CampaignResponse> getAllCampaigns(Pageable pageable) {
        return campaignRepository.findByStatusNot(ExamCampaign.CampaignStatus.DELETED, pageable)
                .map(this::mapToResponse);
    }
    @Override
    public CampaignResponse createCampaign(CampaignRequest req) {
        if (req.orgId() == null || req.targetId() == null) {
            throw new BusinessException("Organization and Target are required.");
        }

        Facility org = facilityRepository.findById(req.orgId())
                .orElseThrow(() -> new ResourceNotFoundException("Org not found: " + req.orgId()));
        Facility target = facilityRepository.findById(req.targetId())
                .orElseThrow(() -> new ResourceNotFoundException("Target not found: " + req.targetId()));

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

    @Override
    public void deleteCampaign(String id) {
        ExamCampaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not found"));

        campaign.setStatus(ExamCampaign.CampaignStatus.DELETED);
        campaignRepository.save(campaign);
    }

//    @Override
//    @Transactional(readOnly = true)
//    public Page<CampaignResponse> getDeletedCampaigns(Pageable pageable) {
//        return campaignRepository.findByStatus(ExamCampaign.CampaignStatus.DELETED, pageable)
//                .map(this::mapToResponse);
//    }

    private CampaignResponse mapToResponse(ExamCampaign c) {

        Long count = campaignRepository.countPatientsByCampaignId(c.getCampaignId());

        return CampaignResponse.builder()
                .campaignId(c.getCampaignId())
                .campaignTitle(c.getCampaignTitle())
                .facilityYear(c.getFacilityYear())
                .startDate(c.getStartDate())
                .managerName(c.getManagerName())
                .status(c.getStatus().name())
                .organizationName(c.getOrganization() != null ? c.getOrganization().getFacilityName() : null)
                .targetFacilityName(c.getTargetfacility() != null ? c.getTargetfacility().getFacilityName() : null)
                .patientCount(count != null ? count : 0L) 
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CampaignResponse getCampaignDetail(String id) {
        ExamCampaign campaign = campaignRepository.findWithDetailByCampaignId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
        return mapToResponse(campaign);
    }

}