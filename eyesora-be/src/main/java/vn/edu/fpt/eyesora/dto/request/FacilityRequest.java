package vn.edu.fpt.eyesora.dto.request;

import vn.edu.fpt.eyesora.entity.Facility;

public record FacilityRequest(
        String facilityName,
        Facility.FacilityType facilityType,
        String address,
        String phone,
        String wardId 
) {}