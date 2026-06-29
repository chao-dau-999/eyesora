package vn.edu.fpt.eyesora.dto.response;

public record MyopiaTimelineResponse(
        String schoolYear,
        double rate,
        String type
){}