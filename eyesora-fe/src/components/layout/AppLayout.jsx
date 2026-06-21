import { useState } from 'react';
import SideBar from './SideBar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
            {/* Sidebar điều khiển trạng thái */}
            <SideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/*
                Vùng nội dung chính:
                - Mobile: ml-0 (Sidebar đè lên dạng drawer)
                - Desktop (md): ml-20 nếu đóng, ml-64 nếu mở.
                - duration-300 trùng với sidebar để chuyển động mượt mà đồng bộ.
            */}
            <div
                className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ml-0 ${
                    sidebarOpen ? 'md:ml-64' : 'md:ml-20'
                }`}
            >
                {/* Truyền hàm mở sidebar vào Header phục vụ nút bấm Mobile */}
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;