package vn.edu.fpt.eyesora.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CampaignRequest (
        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Year is required")
        String year,

        @NotNull(message = "Start date is required")
        LocalDate startDate,

        String managerName,
        String orgId,
        String targetId
){}