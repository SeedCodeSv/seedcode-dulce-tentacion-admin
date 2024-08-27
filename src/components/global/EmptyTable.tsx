import NO_DATA from "../../assets/svg/NO_DATA.svg"

function EmptyTable() {
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <img
                src={NO_DATA}
                alt="X"
                className="w-32 h-32"
            />
            <p className="mt-3 text-xl dark:text-white">
                No se encontraron resultados
            </p>
        </div>
    )
}

export default EmptyTable
