package vn.edu.fpt.eyesora.service.impl;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.fpt.eyesora.dto.request.FacilityRequest;
import vn.edu.fpt.eyesora.dto.response.FacilityResponse;
import vn.edu.fpt.eyesora.entity.Facility;
import vn.edu.fpt.eyesora.entity.Ward;
import vn.edu.fpt.eyesora.repository.FacilityRepository;
import vn.edu.fpt.eyesora.repository.WardRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FacilityServiceImpl {
    private final FacilityRepository facilityRepository;
    private final WardRepository wardRepository;

    public List<FacilityResponse> getAllFacilities() {
        return facilityRepository.findAll().stream()
                .map(f -> new FacilityResponse(f.getId(), f.getFacilityName(), f.getFacilityType(), f.getAddress(), f.getPhone(), f.getWard().getWardName()))
                .toList();
    }

    public FacilityResponse createFacility(FacilityRequest req) {
        Ward ward = wardRepository.findById(req.wardId())
                .orElseThrow(() -> new RuntimeException("Ward not found"));

        Facility f = new Facility();
        f.setFacilityName(req.facilityName());
        f.setFacilityType(req.facilityType());
        f.setAddress(req.address());
        f.setPhone(req.phone());
        f.setWard(ward);

        f = facilityRepository.save(f);
        return new FacilityResponse(f.getId(), f.getFacilityName(), f.getFacilityType(), f.getAddress(), f.getPhone(), ward.getWardName());
    }

    public FacilityResponse updateFacility(String id, FacilityRequest req) {
        Facility existing = facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found"));

        existing.setFacilityName(req.facilityName());
        existing.setFacilityType(req.facilityType());
        existing.setAddress(req.address());
        existing.setPhone(req.phone());

        if (req.wardId() != null && !req.wardId().equals(existing.getWard().getId())) {
            Ward newWard = wardRepository.findById(req.wardId())
                    .orElseThrow(() -> new RuntimeException("Ward not found"));
            existing.setWard(newWard);
        }

        Facility saved = facilityRepository.save(existing);
        return new FacilityResponse(
                saved.getId(),
                saved.getFacilityName(),
                saved.getFacilityType(),
                saved.getAddress(),
                saved.getPhone(),
                saved.getWard().getWardName()
        );
    }
}