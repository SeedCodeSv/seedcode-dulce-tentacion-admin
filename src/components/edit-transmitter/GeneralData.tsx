import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { Search } from 'lucide-react';
import useGlobalStyles from '../global/global.styles';
import { useFormik } from 'formik';
import { useAccountCatalogsStore } from '@/store/accountCatalogs.store';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { AccountCatalog } from '@/types/accountCatalogs.types';
import { toast } from 'sonner';
import Pagination from '../global/Pagination';
import { useAuthStore } from '@/store/auth.store';
import { useFiscalDataAndParameterStore } from '@/store/fiscal-data-and-paramters.store';
import { useNavigate } from 'react-router';

function GeneralData() {
  const styles = useGlobalStyles();
  const { getAccountCatalogs } = useAccountCatalogsStore();

  const { user } = useAuthStore();

  const {
    fiscalDataAndParameter,
    getFiscalDataAndParameter,
    onCreateFiscalDataAndParameter,
    onUpdateFiscalDataAndParameter,
  } = useFiscalDataAndParameterStore();

  useEffect(() => {
    if (user) {
      const transId = user.correlative
        ? user.correlative.branch.transmitter.id
        : user.pointOfSale
          ? user.pointOfSale.branch.transmitter.id
          : 0;
      getFiscalDataAndParameter(transId);
    }
  }, [user]);

  const navigation = useNavigate();

  useEffect(() => {
    getAccountCatalogs('', '');
  }, []);

  const formik = useFormik({
    initialValues: {
      ivaLocalShopping: '',
      ivaImports: '',
      ivaTributte: '',
      ivaFinalConsumer: '',
      ivaRete1: '',
      ivaPerci1: '',
      ivaCard2: '',
      generalBox: '',
      cardCredit: '',
      indiferenceExpenseF: '',
      cescOrTurismShoppping: '',
      cescOrTurismSales: '',
      advancesCXC: '',
      transientAdvancesCXD: '',
    },
    onSubmit(values, formikHelpers) {
      if (user) {
        const transId = user.correlative
          ? user.correlative.branch.transmitter.id
          : user.pointOfSale
            ? user.pointOfSale.branch.transmitter.id
            : 0;
        if (fiscalDataAndParameter) {
          onUpdateFiscalDataAndParameter(fiscalDataAndParameter.id, {
            ...values,
            transmitterId: transId,
          });
          formikHelpers.setSubmitting(false);
        } else {
          onCreateFiscalDataAndParameter({ ...values, transmitterId: transId });
          formikHelpers.setSubmitting(false);
        }
      } else {
        formikHelpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (fiscalDataAndParameter) {
      formik.setValues({
        ivaLocalShopping: fiscalDataAndParameter.ivaLocalShopping,
        ivaImports: fiscalDataAndParameter.ivaImports,
        ivaTributte: fiscalDataAndParameter.ivaTributte,
        ivaFinalConsumer: fiscalDataAndParameter.ivaFinalConsumer,
        ivaRete1: fiscalDataAndParameter.ivaRete1,
        ivaPerci1: fiscalDataAndParameter.ivaPerci1,
        ivaCard2: fiscalDataAndParameter.ivaCard2,
        generalBox: fiscalDataAndParameter.generalBox,
        cardCredit: fiscalDataAndParameter.cardCredit,
        indiferenceExpenseF: fiscalDataAndParameter.indiferenceExpenseF,
        cescOrTurismShoppping: fiscalDataAndParameter.cescOrTurismShoppping,
        cescOrTurismSales: fiscalDataAndParameter.cescOrTurismSales,
        advancesCXC: fiscalDataAndParameter.advancesCXC,
        transientAdvancesCXD: fiscalDataAndParameter.transientAdvancesCXD,
      });
    }
  }, [fiscalDataAndParameter]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}
      >
        <div className="h-full w-full flex flex-col gap-3">
          <div className="flex gap-4 justify-between">
            <div className="w-full flex items-center justify-end">
              <span>Cuenta para el IVA Credito Fiscal(Compras Locales)</span>
            </div>
            <div className="w-full flex gap-2">
              <Input
                readOnly
                variant="bordered"
                placeholder="Cuenta para el IVA Credito Fiscal(Compras Locales)"
                className="w-full"
                {...formik.getFieldProps('ivaLocalShopping')}
              />
              <SelectedItem
                code={formik.values.ivaLocalShopping}
                setCode={(value) => formik.setFieldValue('ivaLocalShopping', value)}
              />
            </div>
            <CurrentInputValue code={formik.values.ivaLocalShopping} />
          </div>
          <div className="flex gap-4 justify-between">
            <div className="w-full flex items-center justify-end">
              <span>Cuenta para el IVA Crédito Fiscal (Importaciones)</span>
            </div>
            <div className="w-full flex gap-2">
              <Input
                readOnly
                variant="bordered"
                placeholder="Cuenta para el IVA Crédito Fiscal (Importaciones)"
                className="w-full"
                {...formik.getFieldProps('ivaImports')}
              />
              <SelectedItem
                code={formik.values.ivaImports}
                setCode={(value) => formik.setFieldValue('ivaImports', value)}
              />
            </div>
            <CurrentInputValue code={formik.values.ivaImports} />
          </div>
          <div className="flex gap-4 justify-between">
            <div className="w-full flex items-center justify-end">
              <span>Cuenta para el IVA Débito Fiscal (Contribuyentes)</span>
            </div>
            <div className="w-full flex gap-2">
              <Input
                readOnly
                variant="bordered"
                placeholder="Cuenta para el IVA Débito Fiscal (Contribuyentes)"
                className="w-full"
                {...formik.getFieldProps('ivaTributte')}
              />
              <SelectedItem
                code={formik.values.ivaTributte}
                setCode={(value) => formik.setFieldValue('ivaTributte', value)}
              />
            </div>
            <CurrentInputValue code={formik.values.ivaTributte} />
          </div>
          <div className="flex gap-4 justify-between">
            <div className="w-full flex items-center justify-end">
              <span>Cuenta para el IVA Débito Fiscal (Consumidor final)</span>
            </div>
            <div className="w-full flex gap-2">
              <Input
                readOnly
                variant="bordered"
                placeholder="Cuenta para el IVA Débito Fiscal (Consumidor final)"
                className="w-full"
                {...formik.getFieldProps('ivaFinalConsumer')}
              />
              <SelectedItem
                code={formik.values.ivaFinalConsumer}
                setCode={(value) => formik.setFieldValue('ivaFinalConsumer', value)}
              />
            </div>
            <CurrentInputValue code={formik.values.ivaFinalConsumer} />
          </div>
          <div className="flex gap-4 justify-between w-full">
            <div className="w-full flex items-center justify-end">
              <span>Cuenta contable para el IVA Retenido 1%</span>
            </div>
            <div className="w-full flex gap-2">
              <Input
                readOnly
                variant="bordered"
                placeholder="Cuenta contable para el IVA Retenido 1%"
                className="w-full"
                {...formik.getFieldProps('ivaRete1')}
              />
              <SelectedItem
                code={formik.values.ivaRete1}
                setCode={(value) => formik.setFieldValue('ivaRete1', value)}
              />
            </div>
            <CurrentInputValue code={formik.values.ivaRete1} />
          </div>
          <div className="flex gap-4 justify-between w-full">
            <div className="w-full flex items-center justify-end">
              <span>Cuenta contable para IVA Percibido 1%</span>
            </div>
            <div className="w-full flex gap-2">
              <Input
                readOnly
                variant="bordered"
                placeholder="Cuenta contable para IVA Percibido 1%"
                className="w-full"
                {...formik.getFieldProps('ivaPerci1')}
              />
              <SelectedItem
                code={formik.values.ivaPerci1}
                setCode={(value) => formik.setFieldValue('ivaPerci1', value)}
              />
            </div>
            <CurrentInputValue code={formik.values.ivaPerci1} />
          </div>
          <div className="flex gap-4 justify-between w-full">
            <div className="w-full flex items-center justify-end">
              <span>Código de Cuenta para IVA 2% (Tarjetas)</span>
            </div>
            <div className="w-full flex gap-2">
              <Input
                readOnly
                variant="bordered"
                placeholder="Código de Cuenta para IVA 2% (Tarjetas)"
                className="w-full"
                {...formik.getFieldProps('ivaCard2')}
              />
              <SelectedItem
                code={formik.values.ivaCard2}
                setCode={(value) => formik.setFieldValue('ivaCard2', value)}
              />
            </div>
            <CurrentInputValue code={formik.values.ivaCard2} />
          </div>
          <div className="flex gap-4 justify-between w-full">
            <div className="w-full flex items-center justify-end">
              <span>Código de Cuenta para la Caja GENERAL</span>
            </div>
            <div className="w-full flex gap-2">
              <Input
                readOnly
                variant="bordered"
                placeholder="Código de Cuenta para la Caja GENERAL"
                className="w-full"
                {...formik.getFieldProps('generalBox')}
              />
              <SelectedItem
                code={formik.values.generalBox}
                setCode={(value) => formik.setFieldValue('generalBox', value)}
              />
            </div>
            <CurrentInputValue code={formik.values.generalBox} />
          </div>
          <div className="flex gap-4 justify-between w-full">
            <div className="w-full flex items-center justify-end">
              <span>Código de Cuenta para Tarjeta de Credito:</span>
            </div>
            <div className="w-full flex gap-2">
              <Input
                readOnly
                variant="bordered"
                placeholder="Código de Cuenta para Tarjeta de Credito:"
                className="w-full"
                {...formik.getFieldProps('cardCredit')}
              />
              <SelectedItem
                code={formik.values.cardCredit}
                setCode={(value) => formik.setFieldValue('cardCredit', value)}
              />
            </div>
            <CurrentInputValue code={formik.values.cardCredit} />
          </div>
          <div className="flex gap-4 justify-between w-full">
            <div className="w-full flex items-center justify-end">
              <span>Código de Cuenta para la Gastos Indirectos de F</span>
            </div>
            <div className="w-full flex gap-2">
              <Input
                readOnly
                variant="bordered"
                placeholder="Código de Cuenta para la Gastos Indirectos de F"
                className="w-full"
                {...formik.getFieldProps('indiferenceExpenseF')}
              />
              <SelectedItem
                code={formik.values.indiferenceExpenseF}
                setCode={(value) => formik.setFieldValue('indiferenceExpenseF', value)}
              />
            </div>
            <CurrentInputValue code={formik.values.indiferenceExpenseF} />
          </div>
          <div className="flex gap-4 justify-between w-full">
            <div className="w-full flex items-center justify-end">
              <span>Código de Cuenta para CESC o Turismo Compras</span>
            </div>
            <div className="w-full flex gap-2">
              <Input
                readOnly
                variant="bordered"
                placeholder="Código de Cuenta para CESC o Turismo Compras"
                className="w-full"
                {...formik.getFieldProps('cescOrTurismShoppping')}
              />
              <SelectedItem
                code={formik.values.cescOrTurismShoppping}
                setCode={(value) => formik.setFieldValue('cescOrTurismShoppping', value)}
              />
            </div>
            <CurrentInputValue code={formik.values.cescOrTurismShoppping} />
          </div>
          <div className="flex gap-4 justify-between w-full">
            <div className="w-full flex items-center justify-end">
              <span>Código de Cuenta para CESC o Turismo Ventas</span>
            </div>
            <div className="w-full flex gap-2">
              <Input
                readOnly
                variant="bordered"
                placeholder="Código de Cuenta para CESC o Turismo Ventas"
                className="w-full"
                {...formik.getFieldProps('cescOrTurismSales')}
              />
              <SelectedItem
                code={formik.values.cescOrTurismSales}
                setCode={(value) => formik.setFieldValue('cescOrTurismSales', value)}
              />
            </div>
            <CurrentInputValue code={formik.values.cescOrTurismSales} />
          </div>
          <div className="flex gap-4 justify-between w-full">
            <div className="w-full flex items-center justify-end">
              <span>Cuenta Anticipos de CXC</span>
            </div>
            <div className="w-full flex gap-2">
              <Input
                readOnly
                variant="bordered"
                placeholder="Cuenta Anticipos de CXC"
                className="w-full"
                {...formik.getFieldProps('advancesCXC')}
              />
              <SelectedItem
                code={formik.values.advancesCXC}
                setCode={(value) => formik.setFieldValue('advancesCXC', value)}
              />
            </div>
            <CurrentInputValue code={formik.values.advancesCXC} />
          </div>
          <div className="flex gap-4 justify-between w-full">
            <div className="w-full flex items-center justify-end">
              <span>Cuenta Transitoria de Anticipos de CXC</span>
            </div>
            <div className="w-full flex gap-2">
              <Input
                readOnly
                variant="bordered"
                placeholder="Cuenta Transitoria de Anticipos de CXC"
                className="w-full"
                {...formik.getFieldProps('transientAdvancesCXD')}
              />
              <SelectedItem
                code={formik.values.transientAdvancesCXD}
                setCode={(value) => formik.setFieldValue('transientAdvancesCXD', value)}
              />
            </div>
            <CurrentInputValue code={formik.values.transientAdvancesCXD} />
          </div>
        </div>
        <div className="w-full flex justify-end mt-3 gap-5">
          <Button
            onClick={() => navigation('/configuration')}
            isLoading={formik.isSubmitting}
            className="px-20 font-semibold"
            style={styles.dangerStyles}
            type="submit"
          >
            Cacelar
          </Button>
          <Button
            isLoading={formik.isSubmitting}
            className="px-20 font-semibold"
            style={styles.thirdStyle}
            type="submit"
          >
            Guardar
          </Button>
        </div>
      </form>
    </>
  );
}

export default GeneralData;

interface PropsItems {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
}

export const SelectedItem = (props: PropsItems) => {
  const { account_catalog_pagination } = useAccountCatalogsStore();

  const ITEMS_PER_PAGE = 15;

  const modalCatalog = useDisclosure();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return account_catalog_pagination.accountCatalogs.filter((item) =>
      item.code.toLowerCase().startsWith(search.toLowerCase())
    );
  }, [search, account_catalog_pagination]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  }, [filteredData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const styles = useGlobalStyles();

  const handleSelectItem = (item: AccountCatalog) => {
    if (item.subAccount) {
      toast.error('No se puede agregar una cuenta con sub-cuentas');
      return;
    }
    props.setCode(item.code);
    modalCatalog.onClose();
  };

  return (
    <>
      <Button onClick={modalCatalog.onOpen} isIconOnly style={styles.secondaryStyle}>
        <Search />
      </Button>
      <Modal
        scrollBehavior="inside"
        size="3xl"
        isOpen={modalCatalog.isOpen}
        onClose={modalCatalog.onClose}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">Catalogo de cuentas</ModalHeader>
            <ModalBody>
              <div>
                <Input
                  classNames={{ base: 'font-semibold' }}
                  labelPlacement="outside"
                  variant="bordered"
                  label="Buscar por código"
                  placeholder="Escribe para buscar..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <div className="overflow-x-auto flex flex-col h-full custom-scrollbar mt-4">
                  <table className="w-full">
                    <thead className="sticky top-0 z-20 bg-white">
                      <tr>
                        <th
                          style={styles.darkStyle}
                          className="p-3 whitespace-nowrap text-xs font-semibold text-left"
                        >
                          Code
                        </th>
                        <th
                          style={styles.darkStyle}
                          className="p-3 whitespace-nowrap text-xs font-semibold text-left"
                        >
                          Name
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((item) => (
                        <tr
                          key={item.code}
                          className="cursor-pointer"
                          onClick={() => handleSelectItem(item)}
                        >
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {item.code}
                          </td>
                          <td className="p-3 text-sm text-slate-500 dark:text-slate-100">
                            {item.name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="w-full">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                nextPage={currentPage + 1}
                previousPage={currentPage - 1}
              />
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

const CurrentInputValue = ({ code }: { code: string }) => {
  const { account_catalog_pagination } = useAccountCatalogsStore();
  const labelValue = useMemo(() => {
    if (code !== '' && code !== 'N/A') {
      const item = account_catalog_pagination.accountCatalogs.find((item) => item.code === code);
      return item?.name || '';
    } else {
      return '';
    }
  }, [code, account_catalog_pagination]);

  return (
    <>
      <span className="text-red-500 w-full">{labelValue}</span>
    </>
  );
};
