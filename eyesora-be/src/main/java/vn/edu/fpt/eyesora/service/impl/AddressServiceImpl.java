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
import vn.edu.fpt.eyesora.exceptions.ResourceNotFoundException;
import vn.edu.fpt.eyesora.repository.DistrictRepository;
import vn.edu.fpt.eyesora.repository.WardRepository;
import vn.edu.fpt.eyesora.service.IAddressService;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressServiceImpl implements IAddressService {

    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;

    @Override
    public DistrictResponse createDistrict(DistrictRequest req) {
        District district = new District();
        district.setDistrictName(req.districtName());

        district = districtRepository.save(district);

        return new DistrictResponse(
                district.getId(),
                district.getDistrictName()
        );
    }

    @Override
    public DistrictResponse updateDistrict(String id, DistrictRequest req) {
        District district = districtRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy quận/huyện với ID: " + id
                ));

        district.setDistrictName(req.districtName());

        district = districtRepository.save(district);

        return new DistrictResponse(
                district.getId(),
                district.getDistrictName()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public DistrictResponse getDistrictById(String id) {
        return districtRepository.findById(id)
                .map(district -> new DistrictResponse(
                        district.getId(),
                        district.getDistrictName()
                ))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy quận/huyện với ID: " + id
                ));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DistrictResponse> getAllDistricts(Pageable pageable) {
        return districtRepository.findAll(pageable)
                .map(district -> new DistrictResponse(
                        district.getId(),
                        district.getDistrictName()
                ));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<WardResponse> getAllWards(String districtId, Pageable pageable) {

        Page<Ward> wardPage = (districtId != null)
                ? wardRepository.findByDistrictId(districtId, pageable)
                : wardRepository.findAll(pageable);

        return wardPage.map(ward -> new WardResponse(
                ward.getId(),
                ward.getWardName(),
                ward.getDistrict().getId(),
                ward.getDistrict().getDistrictName()
        ));
    }

    @Override
    @Transactional(readOnly = true)
    public WardResponse getWardById(String id) {
        return wardRepository.findById(id)
                .map(ward -> new WardResponse(
                        ward.getId(),
                        ward.getWardName(),
                        ward.getDistrict().getId(),
                        ward.getDistrict().getDistrictName()
                ))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy phường/xã với ID: " + id
                ));
    }

    @Override
    public WardResponse createWard(WardRequest req) {

        District district = districtRepository.findById(req.districtId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy quận/huyện với ID: " + req.districtId()
                ));

        Ward ward = new Ward();
        ward.setWardName(req.wardName());
        ward.setDistrict(district);

        ward = wardRepository.save(ward);

        return new WardResponse(
                ward.getId(),
                ward.getWardName(),
                district.getId(),
                district.getDistrictName()
        );
    }

    @Override
    public WardResponse updateWard(String id, WardRequest req) {

        Ward ward = wardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Không tìm thấy phường/xã với ID: " + id
                ));

        ward.setWardName(req.wardName());

        if (req.districtId() != null) {
            District district = districtRepository.findById(req.districtId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy quận/huyện với ID: " + req.districtId()
                    ));

            ward.setDistrict(district);
        }

        ward = wardRepository.save(ward);

        return new WardResponse(
                ward.getId(),
                ward.getWardName(),
                ward.getDistrict().getId(),
                ward.getDistrict().getDistrictName()
        );
    }
}