


// import Sidebar from "../sidebar/Sidebar"

// function Layout({children}) {
//   return (
//     <div className="appcontainer flex h-screen overflow-hidden">
//       <Sidebar/>
//       <main className="flex-1 overflow-y-auto">
//         {children}
//       </main>
//     </div>
//   )
// }

// export default Layout



import Navbar from "../sidebar/Sidebar"

function Layout({children}) {
  return (
    <div className="appcontainer flex flex-col h-screen overflow-hidden">
      <Navbar/>
      <main className="flex-1 overflow-y-auto mt-16">
        {children}
      </main>
    </div>
  )
}

export default Layout