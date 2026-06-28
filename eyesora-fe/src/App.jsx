import { Route, Routes, BrowserRouter } from 'react-router-dom'
import AppLayout from "./shared/layout/AppLayout"; // Bỏ đuôi file
import AdminDashboard from "./features/dashboard/pages/Dashboard.jsx";
import LoginPage from "./features/auth/page/LoginPage.jsx";
import PatientPage from "./features/patient/pages/PatientPage.jsx"; // Bỏ đuôi file (hoặc bỏ {} nếu export default)
import FacilitiesPage from "./features/facility/pages/FacilitiesPage.jsx";
import FacilityFormPage from "./features/facility/pages/FacilityFormPage.jsx";
import CampaignsPage from "./features/campaign/pages/CampaignsPage.jsx";
import CampaignFormPage from './features/campaign/pages/CampaignFormPage';
import UsersPage from "./features/user/pages/UsersPage.jsx";
import DistrictsPage from "./features/district/pages/DistrictsPage.jsx";
import DistrictFormPage from './features/district/pages/DistrictFormPage';
import WardsPage from "./features/ward/pages/WardsPage.jsx";
import WardsFormPage from "./features/ward/pages/WardsFormPage.jsx";
import PatientFormPage from "./features/patient/pages/PatientFormPage.jsx";
import ClassesPage from "./features/class/pages/ClassesPage";
import ClassFormPage from "./features/class/pages/ClassFormPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="/classes" element={<ClassesPage />} />
                    <Route path="/classes/create" element={<ClassFormPage />} />
                    <Route path="/classes/edit/:id" element={<ClassFormPage />} />
                    <Route path="/patients" element={<PatientPage />} />
                    <Route path="/patients/create" element={<PatientFormPage />} />
                    <Route path="/patients/edit/:id" element={<PatientFormPage />} />
                    <Route path="/facilities" element={<FacilitiesPage />} />
                    <Route path="/facilities/create" element={<FacilityFormPage />} />
                    <Route path="/facilities/edit/:id" element={<FacilityFormPage />} />
                    <Route path="/campaigns" element={<CampaignsPage />} />
                    <Route path="/campaigns/create" element={<CampaignFormPage />} />
                    <Route path="/campaigns/edit/:id" element={<CampaignFormPage />} />
                    <Route path="/admin/users" element={<UsersPage />} />
                    <Route path="/districts" element={<DistrictsPage />} />
                    <Route path="/districts/create" element={<DistrictFormPage />} />
                    <Route path="/districts/edit/:id" element={<DistrictFormPage />} />
                    <Route path="/wards" element={<WardsPage />} />
                    <Route path="/wards/create" element={<WardsFormPage />} />
                    <Route path="/wards/edit/:id" element={<WardsFormPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App