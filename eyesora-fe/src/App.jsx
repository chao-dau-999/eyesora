import { Route, Routes, BrowserRouter } from 'react-router-dom'
import AppLayout from "./components/layout/AppLayout"; // Bỏ đuôi file
import { Dashboard } from "./pages/Dashboard.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PatientPage from "./pages/PatientPage.jsx"; // Bỏ đuôi file (hoặc bỏ {} nếu export default)
import ClassesPage from "./pages/ClassesPage.jsx";
import FacilitiesPage from "./pages/FacilitiesPage.jsx";
import CampaignsPage from "./pages/CampaignsPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import ExamRecordsPage from "./pages/ExamRecordsPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/classes" element={<ClassesPage />} />
                    <Route path="/patients" element={<PatientPage />} />
                    <Route path="/eye-exam-records" element={<ExamRecordsPage />} />
                    <Route path="/facilities" element={<FacilitiesPage />} />
                    <Route path="/campaigns" element={<CampaignsPage />} />
                    <Route path="/admin/users" element={<UsersPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App