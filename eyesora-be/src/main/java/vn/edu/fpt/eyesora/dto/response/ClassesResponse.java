package vn.edu.fpt.eyesora.dto.response;

public record ClassesResponse(
        String id,
        String facilityName,
        String className,
        Integer grade,
        String schoolYear
) {}