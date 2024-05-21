
import Sidebar from "../sidebar/Sidebar"




function Layout({children}) {
  return (
    <>
       <Sidebar/>
        {children}
    </>
  )
}

export default Layout