package vn.edu.fpt.eyesora.dto.response;

import java.util.List;

public record ExcelImportResponse(
         int totalRows,
         int successCount,
         int failureCount,
         List<RowError> errors
) {
}
