package vn.edu.fpt.eyesora.dto.response;

import lombok.Builder;
import java.time.Instant;

@Builder
public record EyeExamRecordResponse(
        String examId,
        String campaignTitle,
        String patientName,
        String className,
        String examinerName,
        Instant examDate,

        Float vaLeftWithoutGlasses,
        Float vaLeftWithGlasses,
        Float sphLeft,
        Float cylLeft,
        Integer axisLeft,

        Float vaRightWithoutGlasses,
        Float vaRightWithGlasses,
        Float sphRight,
        Float cylRight,
        Integer axisRight
){}

