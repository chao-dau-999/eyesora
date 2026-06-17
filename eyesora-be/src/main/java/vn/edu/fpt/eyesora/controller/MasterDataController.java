package vn.edu.fpt.eyesora.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.fpt.eyesora.dto.request.DistrictRequest;
import vn.edu.fpt.eyesora.dto.request.FacilityRequest;
import vn.edu.fpt.eyesora.dto.request.WardRequest;
import vn.edu.fpt.eyesora.entity.District;
import vn.edu.fpt.eyesora.entity.Facility;
import vn.edu.fpt.eyesora.entity.Ward;
import vn.edu.fpt.eyesora.service.impl.AddressServiceImpl;
import vn.edu.fpt.eyesora.service.impl.FacilityServiceImpl;

@RestController
@RequestMapping("/api/master-data")
@RequiredArgsConstructor
public class MasterDataController {
    private final AddressServiceImpl addressService;
    private final FacilityServiceImpl facilityService;

    @GetMapping("/districts")
    public ResponseEntity<?> getAllDistricts() {
        return ResponseEntity.ok(addressService.getAllDistricts());
    }

    @PostMapping("/districts")
    public ResponseEntity<?> createDistrict(@RequestBody DistrictRequest req) {
        return ResponseEntity.ok(addressService.createDistrict(req));
    }

    @PutMapping("/districts/{id}")
    public ResponseEntity<?> updateDistrict(@PathVariable String id, @RequestBody DistrictRequest req) {
        return ResponseEntity.ok(addressService.updateDistrict(id, req));
    }

    // Gọi: /api/master-data/wards
    // Gọi: /api/master-data/wards?districtId=xyz
    @GetMapping("/wards")
    public ResponseEntity<?> getAllWards(@RequestParam(required = false) String districtId) {
        return ResponseEntity.ok(addressService.getAllWards(districtId));
    }

    @PostMapping("/wards")
    public ResponseEntity<?> createWard(@RequestBody WardRequest req) {
        return ResponseEntity.ok(addressService.createWard(req));
    }

    @PutMapping("/wards/{id}")
    public ResponseEntity<?> updateWard(@PathVariable String id, @RequestBody WardRequest req) {
        return ResponseEntity.ok(addressService.updateWard(id, req));
    }

    @GetMapping("/facilities")
    public ResponseEntity<?> getFacilities() {
        return ResponseEntity.ok(facilityService.getAllFacilities());
    }

    @PostMapping("/facilities")
    public ResponseEntity<?> createFacility(@RequestBody FacilityRequest req) {
        return ResponseEntity.ok(facilityService.createFacility(req));
    }

    @PutMapping("/facilities/{id}")
    public ResponseEntity<?> updateFacility(@PathVariable String id, @RequestBody FacilityRequest req) {
        return ResponseEntity.ok(facilityService.updateFacility(id, req));
    }
}
