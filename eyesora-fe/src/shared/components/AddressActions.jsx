import { Plus } from "lucide-react";

const AddressActions = ({ onAdd }) => (
    <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-blue-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-800 transition-all"
    >
        <Plus size={20} /> Add New
    </button>
);
export default AddressActions;