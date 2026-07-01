package vn.edu.fpt.eyesora.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.edu.fpt.eyesora.dto.request.CampaignRequest;
import vn.edu.fpt.eyesora.dto.response.CampaignResponse;
import vn.edu.fpt.eyesora.entity.ExamCampaign;

import java.util.List;

public interface ICampaignService {
    Page<CampaignResponse> getAllCampaigns(String status, Pageable pageable);

    CampaignResponse createCampaign(CampaignRequest req);

    void setCampaignStatus(String id, String statusStr);

    void deleteCampaign(String id);

    //    Page<CampaignResponse> getDeletedCampaigns(Pageable pageable);
    
    CampaignResponse getCampaignDetail(String id);

    CampaignResponse updateCampaign(String id, CampaignRequest req);
}