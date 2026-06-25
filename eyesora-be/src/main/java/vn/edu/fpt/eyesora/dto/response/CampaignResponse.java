package vn.edu.fpt.eyesora.dto.response;


import lombok.Builder;

import java.time.LocalDate;

@Builder
public record CampaignResponse(
        String campaignId,
        String campaignTitle,
        String facilityYear,
        LocalDate startDate,
        String managerName,
        String status,
        String organizationName,
        String targetFacilityName,
        Long patientCount
) {}