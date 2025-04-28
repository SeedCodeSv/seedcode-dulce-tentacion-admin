
function HomeReports() {
  return (
    <div className="xl:grid xl:grid-cols-4 grid grid-cols-2 p-6 gap-3">
      <div
        className="border dark:border-gray-700 shadow flex flex-col rounded-lg min-h-52 h-full dark:bg-gray-900"
        style={{
          backgroundImage: `linear-gradient(to right, #028090, #086375)`,
        }}
      >
        <p className="text-base tracking-wide px-[10px] pt-[10px] font-bold text-white uppercase">
          Reporte de ventas
        </p>
      </div>
      <div
        className="border dark:border-gray-700 shadow flex flex-col rounded-lg min-h-52 h-full dark:bg-gray-900"
        style={{
          backgroundImage: `linear-gradient(to right, #f7934c, #f08080)`,
        }}
      >
        <p className="text-base tracking-wide px-[10px] pt-[10px] font-bold text-white uppercase">
          Reporte de gastos
        </p>
      </div>
      <div
        className="border dark:border-gray-700 shadow flex flex-col rounded-lg min-h-52 h-full dark:bg-gray-900"
        style={{
          backgroundImage: `linear-gradient(to right, #4361ee, #7678ed)`,
        }}
      >
        <p className="text-base tracking-wide px-[10px] pt-[10px] font-bold text-white uppercase">
          Reporte producto
        </p>
      </div>
      <div
        className="border dark:border-gray-700 shadow flex flex-col rounded-lg min-h-52 h-full dark:bg-gray-900"
        style={{
          backgroundImage: `linear-gradient(to right, #00509d, #003f88)`,
        }}
      >
        <p className="text-base tracking-wide px-[10px] pt-[10px] font-bold text-white uppercase" />
      </div>
    </div>
  );
}

export default HomeReports