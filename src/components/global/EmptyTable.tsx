
import EmptyBox from '@/assets/empty-box.png';

function EmptyTable({text, classText}: {text?:string, classText?: string}) {
  return (
    <div className="flex flex-col items-center justify-center w-full py-6">
     <img alt="NO DATA" className="w-40" src={EmptyBox} />
      <p className={classText ?? "mt-3 text-xl dark:text-white"}>{text ? text : 'No se encontraron resultados'}</p>
    </div>
  );
}

export default EmptyTable;
