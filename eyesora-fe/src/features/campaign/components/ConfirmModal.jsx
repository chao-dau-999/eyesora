const ConfirmModal = ({onConfirm, onClose}) => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
            <h3 className="font-black text-lg text-gray-900">Confirm Action</h3>
            <p className="text-sm text-gray-600 mt-2 font-medium">Are you sure you want to perform this action?</p>

            <div className="flex gap-3 mt-6">
                <button
                    onClick={onClose}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                    No
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors">
                    Yes
                </button>
            </div>
        </div>
    </div>);
export default ConfirmModal;