import {Search} from "lucide-react";

const SearchBar = ({
                       searchQuery,
                       setSearchQuery,
                       // onAddClick,
                       // onBulkClick,
                       placeholder = "Tìm kiếm theo Tên hoặc Mã HS..."
                   }) => {
    return (<>
            <div className="flex flex-wrap items-center gap-4 flex-grow">
                {/* Search Input */}
                <div className="relative min-w-[280px]">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search/>
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-sm text-gray-900 placeholder-gray-400"
                        placeholder={placeholder}
                    />
                </div>

                <select
                    className="rounded-lg border border-gray-200 bg-white text-sm text-gray-800 focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 py-2 pl-3 pr-8 min-w-[140px] cursor-pointer outline-none">
                    <option className="text-gray-900 bg-white">Chọn Lớp</option>
                    <option className="text-gray-900 bg-white">Lớp 10A1</option>
                    <option className="text-gray-900 bg-white">Lớp 10A2</option>
                </select>

                <select
                    className="rounded-lg border border-gray-200 bg-white text-sm text-gray-800 focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 py-2 pl-3 pr-8 min-w-[140px] cursor-pointer outline-none">
                    <option className="text-gray-900 bg-white">Năm Học 2023-2024</option>
                    <option className="text-gray-900 bg-white">Năm Học 2022-2023</option>
                </select>
            </div>
        </>
    );
};

export default SearchBar;