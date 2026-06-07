import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'
import RightPanel from './RightPanel.jsx'

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-5">
                <div className="flex gap-4 items-start">
                    <aside className="w-64 shrink-0 sticky top-[72px]">
                        <Sidebar />
                    </aside>
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                    <aside className="w-72 shrink-0 sticky top-[72px]">
                        <RightPanel />
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default Layout;