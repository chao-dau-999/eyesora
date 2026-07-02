import { Plus } from "lucide-react";

const UserAction = ({ onAddClick }) => (
    <button onClick={onAddClick} className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition-all">
        <Plus size={18} /> Thêm tài khoản
    </button>
);
export default UserAction;