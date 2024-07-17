import Layout from '@/layout/Layout'

function NoAuthorization() {
  return (
    <Layout title='No Autorizado'>

<div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
          <div className="w-full h-full p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-transparent flex justify-center items-center">
            <p className="text-lg font-semibold dark:text-white">
              No tiene permisos para ver este modulo
            </p>
          </div>
        </div>
    </Layout>
  )
}

export default NoAuthorization