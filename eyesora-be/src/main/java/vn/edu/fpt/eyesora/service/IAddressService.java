package vn.edu.fpt.eyesora.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.edu.fpt.eyesora.dto.request.DistrictRequest;
import vn.edu.fpt.eyesora.dto.request.WardRequest;
import vn.edu.fpt.eyesora.dto.response.DistrictResponse;
import vn.edu.fpt.eyesora.dto.response.WardResponse;

public interface IAddressService {
    Page<DistrictResponse> getAllDistricts(Pageable pageable);
    DistrictResponse getDistrictById(String id);
    DistrictResponse createDistrict(DistrictRequest req);
    DistrictResponse updateDistrict(String id, DistrictRequest req);

    Page<WardResponse> getAllWards(String districtId, Pageable pageable);
    WardResponse getWardById(String id);
    WardResponse createWard(WardRequest req);
    WardResponse updateWard(String id, WardRequest req);


}
