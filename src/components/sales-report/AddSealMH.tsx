import axios from "axios";
import { get_json_sale } from "../../services/sales.service";
import { IDTE } from "../../types/DTE/DTE.types";

interface Props {
  id: number;
  pathPdf: string;
  pathJson: string;
  sello: string;
}

export const AddSealMH = (props: Props) => {
  get_json_sale(props.id).then((data) => {
    axios
      .get(data.data.json)
      .then((response) => {
        try {
          const jsonData: IDTE = JSON.parse(response.data);

          jsonData.respuestaMH.selloRecibido = props.sello;

        
        } catch (error) {
          console.error("Error al analizar el archivo JSON:", error);
        }
      })
      .catch((error) => {
        console.error("Error al obtener el archivo JSON:", error);
      });
  });

  return <div>AddSealMH</div>;
};
