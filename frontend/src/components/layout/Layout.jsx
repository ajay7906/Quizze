
// import Sidebar from "../sidebar/Sidebar"




// function Layout({children}) {
//   return (
//   <div className="appcontainer">
//       <>
//        {/* <Sidebar/>
//         {children} */}
//          <Sidebar/>
//       <main className="flex-1 lg:ml-0 overflow-auto pt-16 lg:pt-0">
//         {children}
//       </main>
//     </>
//   </div>
//   )
// }

// export default Layout






import Sidebar from "../sidebar/Sidebar"

function Layout({children}) {
  return (
    <div className="appcontainer flex h-screen overflow-hidden">
      <Sidebar/>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout