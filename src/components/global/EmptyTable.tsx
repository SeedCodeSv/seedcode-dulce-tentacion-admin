
import EmptyBox from '@/assets/empty-box.png';

function EmptyTable() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-6">
     <img alt="NO DATA" className="w-40" src={EmptyBox} />
      <p className="mt-3 text-xl dark:text-white">No se encontraron resultados</p>
    </div>
  );
}

export default EmptyTable;
