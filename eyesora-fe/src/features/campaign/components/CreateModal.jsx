import { X } from "lucide-react";

const CreateModal = ({ onClose, formData, setFormData, onSave, orgs = [], facilities = [], errors = {} }) => {

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const renderError = (key) => (
        errors[key] && <p className="text-red-500 text-[10px] mt-1 ml-1 font-black uppercase">{errors[key]}</p>
    );

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-gray-900">Create New Campaign</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={20}/></button>
                </div>

                <div className="space-y-4">
                    {[
                        {key: 'title', label: 'Title'},
                        {key: 'year', label: 'Year'},
                        {key: 'startDate', label: 'Start Date', type: 'date'},
                        {key: 'managerName', label: 'Manager Name'}
                    ].map(field => (
                        <div key={field.key}>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">{field.label}</label>
                            <input
                                type={field.type || 'text'}
                                className={`w-full p-3 border ${errors[field.key] ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-900 font-medium`}
                                placeholder={field.label}
                                value={formData[field.key] || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                            />
                            {renderError(field.key)}
                        </div>
                    ))}

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Organization</label>
                        <select
                            className={`w-full p-3 border ${errors.orgId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-900 font-medium bg-white`}
                            value={formData.orgId}
                            onChange={(e) => handleChange('orgId', e.target.value)}
                        >
                            <option value="">-- Select Organization --</option>
                            {orgs.map((o) => {
                                const id = o.id || o.facilityId || o.facility_id;
                                return <option key={id} value={id}>{o.facilityName}</option>;
                            })}
                        </select>
                        {renderError('orgId')}
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Target School</label>
                        <select
                            className={`w-full p-3 border ${errors.targetId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-gray-900 font-medium bg-white`}
                            value={formData.targetId}
                            onChange={(e) => handleChange('targetId', e.target.value)}
                        >
                            <option value="">-- Select Target School --</option>
                            {facilities.map((f) => {
                                const id = f.id || f.facilityId || f.facility_id;
                                return <option key={id} value={id}>{f.facilityName}</option>;
                            })}
                        </select>
                        {renderError('targetId')}
                    </div>

                    <button
                        onClick={onSave}
                        className="w-full mt-6 py-4 bg-blue-900 text-white rounded-lg font-black hover:bg-blue-800 transition-colors"
                    >
                        Save Campaign
                    </button>
                </div>
            </div>
        </div>
    );
};
export default CreateModal;