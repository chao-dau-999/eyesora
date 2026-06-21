import { Route, Routes, BrowserRouter } from 'react-router-dom'
import AppLayout from "./components/layout/AppLayout"; // Bỏ đuôi file
import { Dashboard } from "./pages/Dashboard.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PatientPage from "./pages/PatientPage.jsx"; // Bỏ đuôi file (hoặc bỏ {} nếu export default)

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/patients" element={<PatientPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App