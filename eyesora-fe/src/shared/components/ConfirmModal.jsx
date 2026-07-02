const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, error }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl">
                <h2 className="text-lg font-black text-gray-950 mb-2">{title}</h2>
                <p className="text-sm text-gray-600 mb-4">{message}</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-lg">
                        {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 bg-gray-100 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-200">Hủy</button>
                    <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-600 rounded-xl font-bold text-sm text-white hover:bg-red-700">Xác nhận</button>
                </div>
            </div>
        </div>
    );
};
export default ConfirmModal;