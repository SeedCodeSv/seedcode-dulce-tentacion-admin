import Layout from "../layout/Layout";
import { db } from "../plugins/dexie/db";
function Home() {
  const handleAdd = async () => {
    const direecion = await db.direccion.add({
      departamento: "03",
      municipio: "01",
      complemento: "casa",
    });

    console.log(direecion);
  };

  return (
    <Layout title="Home">
      <div className="flex w-full h-full justify-center items-center">
        <p>Bienvenido</p>
      </div>
    </Layout>
  );
}

export default Home;
