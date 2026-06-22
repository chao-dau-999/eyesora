package vn.edu.fpt.eyesora.service;

import vn.edu.fpt.eyesora.dto.request.CampaignRequest;
import vn.edu.fpt.eyesora.dto.response.CampaignResponse;
import vn.edu.fpt.eyesora.entity.ExamCampaign;

import java.util.List;

public interface ICampaignService {
//    List<ExamCampaign> getAllCampaigns();
    List<CampaignResponse> getAllCampaigns();
    CampaignResponse createCampaign(CampaignRequest req);
    void setCampaignStatus(String id, String statusStr);
}