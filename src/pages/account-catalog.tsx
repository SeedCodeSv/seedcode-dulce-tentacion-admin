import Layout from '@/layout/Layout';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NO_DATA from '../assets/no.png';
import { Button, Input, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import AddButton from '@/components/global/AddButton';
import { PiMicrosoftExcelLogoBold } from 'react-icons/pi';
import { generate_catalog_de_cuentas } from '@/components/account-catalogs/accountCatalogs';
import { Pen, SearchIcon, Trash } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '@/utils/constants';
import { toast } from 'sonner';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import ThGlobal from '@/themes/ui/th-global';
import useThemeColors from '@/themes/use-theme-colors';
import { useAuthStore } from '@/store/auth.store';

function AddAccountCatalogs() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const style = useThemeColors({ name: Colors.Error });

  const { user } = useAuthStore();

  const { getAccountCatalogs, account_catalog_pagination, loading } = useAccountCatalogsStore();
  useEffect(() => {
    const transmitterId =
      user?.pointOfSale?.branch.transmitter.id ?? user?.correlative?.branch.transmitter.id;
    getAccountCatalogs(Number(transmitterId ?? 0), name, code);
  }, []);

  const handleSearch = (searchParam: string | undefined) => {
    const transmitterId =
      user?.pointOfSale?.branch.transmitter.id ?? user?.correlative?.branch.transmitter.id;
    getAccountCatalogs(Number(transmitterId ?? 0), searchParam ?? name, searchParam ?? code);
  };
  const exportAnnexes = async () => {
    const blob = await generate_catalog_de_cuentas(account_catalog_pagination.accountCatalogs);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CATALOGO_DE_CUENTAS.xlsx`;
    link.click();
  };

  const navigate = useNavigate();
  const onDeleteConfirm = (id: number) => {
    axios
      .delete(API_URL + '/account-catalogs/' + id)
      .then(() => {
        const transmitterId =
          user?.pointOfSale?.branch.transmitter.id ?? user?.correlative?.branch.transmitter.id;
        getAccountCatalogs(Number(transmitterId ?? 0), name, code);
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
                <div className="mt-2 flex flex-row w-full justify-between items-end gap-5">
                  <Input
                    startContent={<SearchIcon />}
                    className="w-full dark:text-white border border-white rounded-xl"
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
                    className="w-full dark:text-white border border-white rounded-xl"
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
                  <ButtonUi
                    theme={Colors.Primary}
                    startContent={<SearchIcon className="w-10" />}
                    onPress={() => {
                      handleSearch(undefined);
                    }}
                  >
                    Buscar
                  </ButtonUi>
                </div>
              </div>
              <div className="w-full flex flex-col lg:flex-row justify-end items-end gap-5 pb-5 mt-6 lg:mt-9">
                <ButtonUi
                  theme={Colors.Info}
                  endContent={<PiMicrosoftExcelLogoBold size={20} />}
                  onPress={() => exportAnnexes()}
                  color="secondary"
                >
                  Exportar Catálogo
                </ButtonUi>
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
                            <ThGlobal className="text-left p-3">No.</ThGlobal>
                            <ThGlobal className="text-left p-3">Codigo</ThGlobal>
                            <ThGlobal className="text-left p-3">Nombre</ThGlobal>
                            <ThGlobal className="text-left p-3">Cuenta mayor</ThGlobal>
                            <ThGlobal className="text-left p-3">Nivel</ThGlobal>
                            <ThGlobal className="text-left p-3">Tipo</ThGlobal>
                            <ThGlobal className="text-left p-3">Elemento</ThGlobal>
                            <ThGlobal className="text-left p-3">Cargando como</ThGlobal>
                            <ThGlobal className="text-left p-3">Acciones</ThGlobal>
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
                                    <Button style={style} isIconOnly>
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
                                          onPress={() => onDeleteConfirm(shop.id)}
                                          style={style}
                                          className="mr-2"
                                        >
                                          Sí, eliminar
                                        </Button>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>

                                <ButtonUi
                                  className=""
                                  onPress={() => navigate(`/update-account-catalog/${shop.id}`)}
                                  theme={Colors.Success}
                                  isIconOnly
                                >
                                  <Pen />
                                </ButtonUi>
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
