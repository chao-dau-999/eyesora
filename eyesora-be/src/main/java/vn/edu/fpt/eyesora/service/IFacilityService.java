package vn.edu.fpt.eyesora.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.edu.fpt.eyesora.dto.request.FacilityRequest;
import vn.edu.fpt.eyesora.dto.response.FacilityResponse;

public interface IFacilityService {
    Page<FacilityResponse> getAllFacilities(Pageable pageable);
    FacilityResponse createFacility(FacilityRequest req);
    FacilityResponse updateFacility(String id, FacilityRequest req);
}
