package vn.edu.fpt.eyesora.dto.response;

import lombok.Builder;
import java.time.Instant;
import java.time.LocalDate;

@Builder
public record EyeExamRecordResponse(
        String examId,
        String campaignTitle,
        String patientName,
        String className,
        Integer grade,
        String schoolYear,
        String examinerName,
        LocalDate examDate,

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