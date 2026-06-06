import Navbar from './Navbar'
import Sidebar from './Sidebar'
import RightPanel from './RightPanel'

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ flex: 1 }}>
                    {children}
                </main>
                <RightPanel />
            </div>
        </div>
    )
}

export default Layout