import { useNavigate } from 'react-router';
import AddButton from '../global/AddButton';


function ListDiscount() {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
        <div className="w-full flex flex-col h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent">
          <div className="justify-between w-full gap-5 mb-5 lg:mb-10 lg:flex-row lg:gap-0">
            <div className="flex items-start gap-3"></div>
            <div className="flex w-full">
              <div className="items-start justify-between w-full gap-10 lg:justify-start">
             
                <div className="flex justify-end w-full">
                  <AddButton
                    onClick={() => {
                      navigate('/AddPromotions');
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListDiscount;
