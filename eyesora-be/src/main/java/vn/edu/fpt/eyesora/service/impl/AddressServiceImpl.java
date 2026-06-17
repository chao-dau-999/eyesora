package vn.edu.fpt.eyesora.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.fpt.eyesora.dto.request.DistrictRequest;
import vn.edu.fpt.eyesora.dto.request.WardRequest;
import vn.edu.fpt.eyesora.dto.response.DistrictResponse;
import vn.edu.fpt.eyesora.dto.response.WardResponse;
import vn.edu.fpt.eyesora.entity.District;
import vn.edu.fpt.eyesora.entity.Ward;
import vn.edu.fpt.eyesora.repository.DistrictRepository;
import vn.edu.fpt.eyesora.repository.WardRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressServiceImpl {
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;

    public DistrictResponse createDistrict(DistrictRequest req) {
        District d = new District();
        d.setDistrictName(req.districtName());
        d = districtRepository.save(d);
        return new DistrictResponse(d.getId(), d.getDistrictName());
    }

    public DistrictResponse updateDistrict(String id, DistrictRequest req) {
        District d = districtRepository.findById(id).orElseThrow();
        d.setDistrictName(req.districtName());
        d = districtRepository.save(d);
        return new DistrictResponse(d.getId(), d.getDistrictName());
    }

    public List<DistrictResponse> getAllDistricts() {
        return districtRepository.findAll().stream()
                .map(d -> new DistrictResponse(d.getId(), d.getDistrictName()))
                .toList();
    }

    public List<WardResponse> getAllWards(String districtId) {
        if (districtId != null) {
            return wardRepository.findByDistrictId(districtId).stream()
                    .map(w -> new WardResponse(w.getId(), w.getWardName(), w.getDistrict().getDistrictName()))
                    .toList();
        }
        return wardRepository.findAll().stream()
                .map(w -> new WardResponse(w.getId(), w.getWardName(), w.getDistrict().getDistrictName()))
                .toList();
    }

    public WardResponse createWard(WardRequest req) {
        District d = districtRepository.findById(req.districtId()).orElseThrow();
        Ward w = new Ward();
        w.setWardName(req.wardName());
        w.setDistrict(d);
        w = wardRepository.save(w);
        return new WardResponse(w.getId(), w.getWardName(), d.getDistrictName());
    }

    public WardResponse updateWard(String id, WardRequest req) {
        Ward w = wardRepository.findById(id).orElseThrow();
        w.setWardName(req.wardName());
        if (req.districtId() != null) {
            District d = districtRepository.findById(req.districtId()).orElseThrow();
            w.setDistrict(d);
        }
        w = wardRepository.save(w);
        return new WardResponse(w.getId(), w.getWardName(), w.getDistrict().getDistrictName());
    }
}
