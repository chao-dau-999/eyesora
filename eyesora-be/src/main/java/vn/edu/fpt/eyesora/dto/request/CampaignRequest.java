package vn.edu.fpt.eyesora.dto.request;

import java.time.LocalDate;

public record CampaignRequest (
         String title,
         String year,
         LocalDate startDate,
         String managerName,
         String orgId,
         String targetId
){
}
