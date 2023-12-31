export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative inline-flex">
        <div className="w-8 h-8 bg-sky-500 rounded-full"></div>
        <div className="w-8 h-8 bg-sky-500 rounded-full absolute top-0 left-0 animate-ping"></div>
        <div className="w-8 h-8 bg-sky-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
      </div>
    </div>
    // <div className="border border-slate-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
    //   <div className="animate-pulse flex space-x-4">
    //     <div className="rounded-full bg-slate-700 h-10 w-10"></div>
    //     <div className="flex-1 space-y-6 py-1">
    //       <div className="h-2 bg-slate-700 rounded"></div>
    //       <div className="space-y-3">
    //         <div className="grid grid-cols-3 gap-4">
    //           <div className="h-2 bg-slate-700 rounded col-span-2"></div>
    //           <div className="h-2 bg-slate-700 rounded col-span-1"></div>
    //         </div>
    //         <div className="h-2 bg-slate-700 rounded"></div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
