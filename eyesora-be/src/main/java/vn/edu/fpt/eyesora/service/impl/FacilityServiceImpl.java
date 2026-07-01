package vn.edu.fpt.eyesora.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.fpt.eyesora.dto.request.FacilityRequest;
import vn.edu.fpt.eyesora.dto.response.FacilityResponse;
import vn.edu.fpt.eyesora.entity.Facility;
import vn.edu.fpt.eyesora.entity.Ward;
import vn.edu.fpt.eyesora.exceptions.ResourceNotFoundException;
import vn.edu.fpt.eyesora.repository.FacilityRepository;
import vn.edu.fpt.eyesora.repository.WardRepository;
import vn.edu.fpt.eyesora.service.IFacilityService;

@Service
@RequiredArgsConstructor
@Transactional
public class FacilityServiceImpl implements IFacilityService {
    private final FacilityRepository facilityRepository;
    private final WardRepository wardRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<FacilityResponse> getAllFacilities(Pageable pageable) {
        return facilityRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public FacilityResponse createFacility(FacilityRequest req) {
        Ward ward = wardRepository.findById(req.wardId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phường/xã"));

        Facility f = new Facility();
        f.setFacilityName(req.facilityName());
        f.setFacilityType(req.facilityType());
        f.setAddress(req.address());
        f.setPhone(req.phone());
        f.setWard(ward);

        f = facilityRepository.save(f);
        return mapToResponse(f);
    }

    @Override
    public FacilityResponse updateFacility(String id, FacilityRequest req) {
        Facility existing = facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cơ sở với ID: " + id));

        existing.setFacilityName(req.facilityName());
        existing.setFacilityType(req.facilityType());
        existing.setAddress(req.address());
        existing.setPhone(req.phone());

        if (req.wardId() != null && !req.wardId().equals(existing.getWard().getId())) {
            Ward newWard = wardRepository.findById(req.wardId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phường/xã với ID: " + req.wardId()));
            existing.setWard(newWard);
        }

        return mapToResponse(facilityRepository.save(existing));
    }

    private FacilityResponse mapToResponse(Facility f) {
        return new FacilityResponse(
                f.getId(),
                f.getFacilityName(),
                f.getFacilityType(),
                f.getAddress(),
                f.getPhone(),
                f.getWard() != null ? f.getWard().getWardName() : null,
                f.getWard() != null ? f.getWard().getId() : null,
                f.getWard() != null ? f.getWard().getDistrict().getId() : null
        );
    }

    @Override
    @Transactional(readOnly = true)
    public FacilityResponse getFacilityDetail(String facilityId) {
        Facility facility = facilityRepository.findWithDetailById(facilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cơ sở"));

        return mapToResponse(facility);
    }
}