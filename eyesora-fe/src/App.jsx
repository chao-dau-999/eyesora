import { Route, Routes, BrowserRouter } from 'react-router-dom'
import AppLayout from "./shared/layout/AppLayout"; // Bỏ đuôi file
import AdminDashboard from "./features/dashboard/pages/Dashboard.jsx";
import LoginPage from "./features/auth/page/LoginPage.jsx";
import PatientPage from "./features/patient/pages/PatientPage.jsx"; // Bỏ đuôi file (hoặc bỏ {} nếu export default)
import ClassesPage from "./features/class/pages/ClassesPage.jsx";
import FacilitiesPage from "./features/facility/pages/FacilitiesPage.jsx";
import CampaignsPage from "./features/campaign/pages/CampaignsPage.jsx";
import UsersPage from "./features/user/pages/UsersPage.jsx";
import DistrictsPage from "./features/district/pages/DistrictsPage.jsx";
import WardsPage from "./features/ward/pages/WardsPage.jsx";
import PatientFormPage from "./features/patient/pages/PatientFormPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="/classes" element={<ClassesPage />} />
                    <Route path="/patients" element={<PatientPage />} />
                    <Route path="/patients/create" element={<PatientFormPage />} />
                    <Route path="/patients/edit/:id" element={<PatientFormPage />} />
                    <Route path="/facilities" element={<FacilitiesPage />} />
                    <Route path="/campaigns" element={<CampaignsPage />} />
                    <Route path="/admin/users" element={<UsersPage />} />
                    <Route path="/districts" element={<DistrictsPage />} />
                    <Route path="/wards" element={<WardsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App