package vn.edu.fpt.eyesora.dto.request;

public record ClassesRequest(
        String facilityId,
        String className,
        Integer grade,
        String schoolYear
) {}