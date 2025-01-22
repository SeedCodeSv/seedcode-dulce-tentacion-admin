import useGlobalStyles from '@/components/global/global.styles';
import Layout from '@/layout/Layout';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NO_DATA from '../assets/no.png';
import { Button, Input, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import AddButton from '@/components/global/AddButton';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import { generate_catalog_de_cuentas } from '@/components/accountCatalogs/accountCatalogs';
import { Pen, SearchIcon, Trash } from 'lucide-react';
import { ThemeContext } from '@/hooks/useTheme';
import { global_styles } from '@/styles/global.styles';
import axios from 'axios';
import { API_URL } from '@/utils/constants';
import { toast } from 'sonner';

function AddAccountCatalogs() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const { getAccountCatalogs, account_catalog_pagination, loading } = useAccountCatalogsStore();
  useEffect(() => {
    getAccountCatalogs(name, code);
  }, []);
  const { theme } = useContext(ThemeContext);

  const handleSearch = (searchParam: string | undefined) => {
    getAccountCatalogs(searchParam ?? name, searchParam ?? code);
  };
  const exportAnnexes = async () => {
    // const month = months.find((month) => month.value === monthSelected)?.name || ""
    const blob = await generate_catalog_de_cuentas(account_catalog_pagination.accountCatalogs);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CATALOGO_DE_CUENTAS.xlsx`;
    link.click();
  };

  const navigate = useNavigate();
  const styles = useGlobalStyles();

  const onDeleteConfirm = (id: number) => {
    axios
      .delete(API_URL + '/account-catalogs/' + id)
      .then(() => {
        getAccountCatalogs(name, code);
        toast.success('Eliminado con éxito');
      })
      .catch(() => {
        toast.error('Error al eliminar');
      });
  };

  return (
    <Layout title="Catalogos de Cuentas">
      <>
        <div className="w-full h-full flex flex-col overflow-y-auto p-5 bg-white dark:bg-gray-800">
          <div className="w-full mt-2">
            <div className="w-full flex flex-col lg:flex-row justify-between gap-5 mt-4">
              <div className="w-full">
                <div className="mt-2 flex flex-col lg:flex-row w-full justify-between gap-5">
                  <Input
                    startContent={<SearchIcon />}
                    className="w-full dark:text-white border border-white rounded-xl mb-4 lg:mb-0"
                    variant="bordered"
                    labelPlacement="outside"
                    label="Nombre"
                    classNames={{
                      label: 'font-semibold text-gray-700',
                      inputWrapper: 'pr-0',
                    }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Escribe para buscar..."
                    isClearable
                    onClear={() => {
                      setName('');
                      handleSearch('');
                    }}
                  />
                  <Input
                    startContent={<SearchIcon />}
                    className="w-full dark:text-white border border-white rounded-xl mb-4 lg:mb-0"
                    variant="bordered"
                    labelPlacement="outside"
                    label="Código"
                    classNames={{
                      label: 'font-semibold text-gray-700',
                      inputWrapper: 'pr-0',
                    }}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Escribe para buscar..."
                    isClearable
                    onClear={() => {
                      setCode('');
                      handleSearch('');
                    }}
                  />
                  <Button
                    style={{
                      backgroundColor: theme.colors.secondary,
                      color: theme.colors.primary,
                    }}
                    className="w-full lg:w-auto mt-2 lg:mt-6 font-semibold flex justify-center items-center border border-white rounded-xl"
                    color="primary"
                    startContent={<SearchIcon className="w-10" />}
                    onClick={() => {
                      handleSearch(undefined);
                    }}
                  >
                    Buscar
                  </Button>
                </div>
              </div>
              <div className="w-full flex flex-col lg:flex-row justify-end gap-5 pb-5 mt-6 lg:mt-9">
                <Button
                  className="w-full lg:w-auto px-4 lg:px-10 mb-4 lg:mb-0"
                  endContent={<PiMicrosoftExcelLogoBold size={20} />}
                  onClick={() => exportAnnexes()}
                  color="secondary"
                >
                  Exportar Catálogo
                </Button>
                <AddButton
                  onClick={() => {
                    navigate('/add-account-catalog');
                  }}
                />
              </div>
            </div>

            <div className="w-full max-h-[500px] lg:max-h-[600px] xl:max-h-[700px] 2xl:max-h-[800px] overflow-y-auto overflow-x-auto custom-scrollbar mt-4">
              {loading ? (
                <div className="w-full flex justify-center p-20 items-center flex-col">
                  <div className="loader"></div>
                  <p className="mt-5 dark:text-white text-gray-600 text-xl">Cargando...</p>
                </div>
              ) : (
                <>
                  {account_catalog_pagination.accountCatalogs.length > 0 ? (
                    <>
                      <table className="w-full">
                        <thead className="sticky top-0 z-20 bg-white">
                          <tr>
                            <th
                              style={styles.darkStyle}
                              className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                            >
                              N
                            </th>
                            <th
                              style={styles.darkStyle}
                              className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                            >
                              Código
                            </th>
                            <th
                              style={styles.darkStyle}
                              className="p-3 text-sm font-semibold text-left text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                            >
                              Nombre
                            </th>
                            <th
                              style={styles.darkStyle}
                              className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                            >
                              Cuenta Mayor
                            </th>
                            <th
                              style={styles.darkStyle}
                              className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                            >
                              Nivel de Cuenta
                            </th>
                            <th
                              style={styles.darkStyle}
                              className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                            >
                              Tipo de Cuenta
                            </th>

                            <th
                              style={styles.darkStyle}
                              className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                            >
                              Elemento
                            </th>
                            <th
                              style={styles.darkStyle}
                              className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                            >
                              Cargado como
                            </th>
                            <th
                              style={styles.darkStyle}
                              className="p-3 text-sm font-semibold text-left whitespace-nowrap text-slate-600 dark:text-gray-100 dark:bg-slate-700 bg-slate-200"
                            >
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {account_catalog_pagination.accountCatalogs.map((shop, index) => (
                            <tr key={index} className="border-b border-slate-200">
                              <td className="p-4 text-sm text-slate-500 dark:text-slate-100">
                                {shop.id}
                              </td>
                              <td className="p-4 text-sm text-slate-500 dark:text-slate-100">
                                {shop.code}
                              </td>
                              <td className="p-4 text-sm text-slate-500 dark:text-slate-100">
                                {shop.name}
                              </td>
                              <td className="p-4 text-sm text-slate-500 dark:text-slate-100">
                                {shop.majorAccount}
                              </td>
                              <td className="p-4 text-sm text-slate-500 dark:text-slate-100">
                                {shop.accountLevel}
                              </td>
                              <td className="p-4 text-sm text-slate-500 dark:text-slate-100">
                                {shop.accountType}
                              </td>
                              <td className="p-4 text-sm text-slate-500 dark:text-slate-100">
                                {shop.item}
                              </td>
                              <td className="p-4 text-sm text-slate-500 dark:text-slate-100">
                                {shop.uploadAs}
                              </td>
                              <td className="flex gap-4">
                                <Popover className="border border-white rounded-xl">
                                  <PopoverTrigger className="">
                                    <Button style={global_styles().warningStyles} isIconOnly>
                                      <Trash />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <div className="p-4">
                                      <p className="text-sm font-normal text-gray-600">
                                        ¿Deseas eliminar el registro {shop.id}?
                                      </p>
                                      <div className="flex justify-center mt-4">
                                        <Button
                                          onClick={() => onDeleteConfirm(shop.id)}
                                          style={{
                                            backgroundColor: '#FF4D4F',
                                            color: 'white',
                                          }}
                                          className="mr-2"
                                        >
                                          Sí, eliminar
                                        </Button>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>

                                <Button
                                  className=""
                                  onClick={() => navigate(`/update-account-catalog/${shop.id}`)}
                                  style={global_styles().secondaryStyle}
                                  isIconOnly
                                >
                                  <Pen />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <>
                      <div className="w-full h-full flex dark:bg-gray-600 p-10 flex-col justify-center items-center">
                        <img className="w-44 mt-10" src={NO_DATA} alt="" />
                        <p className="mt-5 dark:text-white text-gray-600 text-xl">
                          No se encontraron resultados
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </>
    </Layout>
  );
}

export default AddAccountCatalogs;
