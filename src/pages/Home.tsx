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
      <>
        <h1>Home</h1>
        <button onClick={handleAdd}>Nuevo</button>
      </>
    </Layout>
  );
}

export default Home;
