package vn.edu.fpt.eyesora.dto.response;

import lombok.Builder;

@Builder
public record DashboardSummaryResponse(
        long totalExaminedStudents,
        double currentMyopiaRate,
        Double myopiaRateTrend,
        long totalAlertCases,
        long totalParticipatingFacilities
){}