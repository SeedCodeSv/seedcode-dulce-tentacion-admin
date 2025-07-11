import { AiOutlineFilePdf } from "react-icons/ai";

import ButtonUi from "@/themes/ui/button-ui";
import { Colors } from "@/types/themes.types";

export default function ExportPdfProductLoss () {
return (
    <ButtonUi
    //   isDisabled={loading_data || kardexGeneral.length === 0}
      theme={Colors.Primary}
    //   onPress={() => {
    //     if (!loading_data) {
    //       handle()
    //     }
    //     else return
    //   }}
    >
      {/* {loading_data ?
        <Loader className='animate-spin' /> :
        <> */}
          <AiOutlineFilePdf className="" size={25} /> <p className="font-medium hidden lg:flex"> Descargar PDF</p>
        {/* </>
      } */}
    </ButtonUi>
)
}