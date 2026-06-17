package vn.edu.fpt.eyesora.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.edu.fpt.eyesora.dto.request.DistrictRequest;
import vn.edu.fpt.eyesora.dto.request.WardRequest;
import vn.edu.fpt.eyesora.dto.response.DistrictResponse;
import vn.edu.fpt.eyesora.dto.response.WardResponse;

public interface IAddressService {
    DistrictResponse createDistrict(DistrictRequest req);
    DistrictResponse updateDistrict(String id, DistrictRequest req);
    Page<DistrictResponse> getAllDistricts(Pageable pageable);
    Page<WardResponse> getAllWards(String districtId, Pageable pageable);
    WardResponse createWard(WardRequest req);
    WardResponse updateWard(String id, WardRequest req);

}
