import {Search} from "lucide-react";

const SearchExamRecords = ({
                       searchQuery,
                       setSearchQuery,
                       placeholder = "Tìm kiếm"
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
            </div>
        </>
    );
};

export default SearchExamRecords;