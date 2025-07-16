function LoadingTable({title}:{title?: string}) {
    return (
      <div className="flex flex-col items-center  w-full h-[325px]">
        <div className="loader" />
        <p className="mt-3 text-xl font-semibold">
         {title ? title : 'Cargando...'}
        </p>
      </div>
    )
  }
  
  export default LoadingTable
  