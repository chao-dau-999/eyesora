package vn.edu.fpt.eyesora.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import vn.edu.fpt.eyesora.service.IAddressService;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressServiceImpl implements IAddressService {
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;

    @Override
    public DistrictResponse createDistrict(DistrictRequest req) {
        District d = new District();
        d.setDistrictName(req.districtName());
        d = districtRepository.save(d);
        return new DistrictResponse(d.getId(), d.getDistrictName());
    }

    @Override
    public DistrictResponse updateDistrict(String id, DistrictRequest req) {
        District d = districtRepository.findById(id).orElseThrow();
        d.setDistrictName(req.districtName());
        d = districtRepository.save(d);
        return new DistrictResponse(d.getId(), d.getDistrictName());
    }


    @Override
    public Page<DistrictResponse> getAllDistricts(Pageable pageable) {
        return districtRepository.findAll(pageable)
                .map(d -> new DistrictResponse(d.getId(), d.getDistrictName()));
    }

    @Override
    public Page<WardResponse> getAllWards(String districtId, Pageable pageable) {
        Page<Ward> wardPage;

        if (districtId != null) {
            wardPage = wardRepository.findByDistrictId(districtId, pageable);
        } else {
            wardPage = wardRepository.findAll(pageable);
        }

        return wardPage.map(w -> new WardResponse(
                w.getId(),
                w.getWardName(),
                w.getDistrict().getDistrictName()
        ));
    }

    @Override
    public WardResponse createWard(WardRequest req) {
        District d = districtRepository.findById(req.districtId()).orElseThrow();
        Ward w = new Ward();
        w.setWardName(req.wardName());
        w.setDistrict(d);
        w = wardRepository.save(w);
        return new WardResponse(w.getId(), w.getWardName(), d.getDistrictName());
    }

    @Override
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
