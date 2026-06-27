import { Plus } from "lucide-react";

const FacilityActions = ({ onAdd }) => (
    <button
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-all text-sm shadow-sm"
    >
        <Plus size={18}/>
        Thêm cơ sở
    </button>
);

export default FacilityActions;