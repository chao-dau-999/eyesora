package vn.edu.fpt.eyesora.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.fpt.eyesora.dto.request.ClassesRequest;
import vn.edu.fpt.eyesora.dto.request.DistrictRequest;
import vn.edu.fpt.eyesora.dto.request.FacilityRequest;
import vn.edu.fpt.eyesora.dto.request.WardRequest;

import vn.edu.fpt.eyesora.dto.response.ClassDetailResponse;
import vn.edu.fpt.eyesora.dto.response.FacilityResponse;
import vn.edu.fpt.eyesora.service.IAddressService;
import vn.edu.fpt.eyesora.service.IClassesService;
import vn.edu.fpt.eyesora.service.IFacilityService;

@RestController
@RequestMapping("/api/master-data")
@RequiredArgsConstructor
public class MasterDataController {
    private final IAddressService addressService;
    private final IFacilityService facilityService;
    private final IClassesService classesService;

    // --- Districts ---
    @GetMapping("/districts")
    public ResponseEntity<?> getAllDistricts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(addressService.getAllDistricts(pageable));
    }

    @PostMapping("/districts")
    public ResponseEntity<?> createDistrict(@Valid @RequestBody DistrictRequest req) {
        return ResponseEntity.ok(addressService.createDistrict(req));
    }

    @PutMapping("/districts/{id}")
    public ResponseEntity<?> updateDistrict(@PathVariable String id, @Valid @RequestBody DistrictRequest req) {
        return ResponseEntity.ok(addressService.updateDistrict(id, req));
    }

    // --- Wards ---
    @GetMapping("/wards")
    public ResponseEntity<?> getAllWards(
            @RequestParam(required = false) String districtId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(addressService.getAllWards(districtId, pageable));
    }

    @PostMapping("/wards")
    public ResponseEntity<?> createWard(@Valid @RequestBody WardRequest req) {
        return ResponseEntity.ok(addressService.createWard(req));
    }

    @PutMapping("/wards/{id}")
    public ResponseEntity<?> updateWard(@PathVariable String id, @Valid @RequestBody WardRequest req) {
        return ResponseEntity.ok(addressService.updateWard(id, req));
    }

    // --- Facilities ---
    @GetMapping("/facilities")
    public ResponseEntity<?> getFacilities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "facilityName") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(facilityService.getAllFacilities(pageable));
    }

    @GetMapping("/facilities/{id}")
    public ResponseEntity<FacilityResponse> getFacilityDetail(@PathVariable String id) {
        return ResponseEntity.ok(facilityService.getFacilityDetail(id));
    }

    @PostMapping("/facilities")
    public ResponseEntity<?> createFacility(@Valid @RequestBody FacilityRequest req) {
        return ResponseEntity.ok(facilityService.createFacility(req));
    }

    @PutMapping("/facilities/{id}")
    public ResponseEntity<?> updateFacility(@PathVariable String id, @Valid @RequestBody FacilityRequest req) {
        return ResponseEntity.ok(facilityService.updateFacility(id, req));
    }


    // --- Classes ---
    @GetMapping("/classes")
    public ResponseEntity<?> getAllClasses(
            @PageableDefault(size = 10, sort = "className") Pageable pageable) {
        return ResponseEntity.ok(classesService.getAllClasses(pageable));
    }

    @PostMapping("/classes")
    public ResponseEntity<?> createClass(@Valid @RequestBody ClassesRequest req) {
        return ResponseEntity.ok(classesService.createClass(req));
    }

    @PutMapping("/classes/{id}")
    public ResponseEntity<?> updateClass(@PathVariable String id, @Valid @RequestBody ClassesRequest req) {
        return ResponseEntity.ok(classesService.updateClass(id, req));
    }

    @GetMapping("/classes/{id}/patients")
    public ResponseEntity<ClassDetailResponse> getClassDetail(
            @PathVariable String id,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(classesService.getClassDetail(id, pageable));
    }
}