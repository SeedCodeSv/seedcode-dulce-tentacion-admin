import Layout from '../layout/Layout'
import ERROR404 from "../assets/page_not_found.png"

function Error404() {
  return (
    <Layout title='Pagina no encontrada'>
        <div className="flex items-center dark:bg-gray-800 justify-center w-full h-full overflow-y-hidden">
            <img src={ERROR404} alt="404" />
        </div>
    </Layout>
  )
}

export default Error404
