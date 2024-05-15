import { Layout } from "lucide-react";
interface Props {
  onCloseModal: () => void;
}

function SalesEdit(props: Props) {
  console.log(props);
  return (
    <>
      <div>
        <Layout>
          <>
            <p> {} </p>
            <p className="text-black">Errores</p>
            <p>Editar campos</p>
          </>
        </Layout>
      </div>
    </>
  );
}

export default SalesEdit;
