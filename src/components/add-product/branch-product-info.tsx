import {
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { Box, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import classNames from 'classnames';

import { ProductPayloadForm } from '@/types/products.types';
import { useBranchesStore } from '@/store/branches.store';
import { useSupplierStore } from '@/store/supplier.store';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { Supplier } from '@/types/supplier.types';
import { preventLetters } from '@/utils';
import useWindowSize from '@/hooks/useWindowSize';

function BranchProductInfo() {
  const formik = useFormikContext<ProductPayloadForm>();
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);
  const typeSearch = ['NOMBRE', 'CORREO', 'NIT', 'NRC'];
  const [selectedTypeSearch, setSelectedTypeSearch] = useState<'NOMBRE' | 'CORREO' | 'NRC' | 'NIT'>(
    'NOMBRE'
  );
  const [search, setSearch] = useState('');
  const modalSuppliers = useDisclosure();

  const { getSupplierPagination, supplier_pagination } = useSupplierStore();

  useEffect(() => {
    getSupplierPagination(1, 10, '', '', '', '', '', 1);
  }, []);

  const { branch_list } = useBranchesStore();

  const handleSearch = (page = 1) => {
    getSupplierPagination(
      page,
      10,
      selectedTypeSearch === 'NOMBRE' ? search : '',
      selectedTypeSearch === 'CORREO' ? search : '',
      selectedTypeSearch === 'NIT' ? search : '',
      selectedTypeSearch === 'NRC' ? search : '',
      '',
      1
    );
  };

  const modalBranches = useDisclosure()
  // const [modalBranches, setModalBranches] = useState(false)

  const handleAddSupplier = (supplier: Supplier) => {
    const list_suppliers = [...selectedSuppliers];

    const checkIfExist = list_suppliers.findIndex((lsP) => lsP.id === supplier.id);

    if (checkIfExist === -1) {
      list_suppliers.push(supplier);
    } else {
      list_suppliers.splice(checkIfExist, 1);
    }

    setSelectedSuppliers(list_suppliers);
    formik.setFieldValue(
      'suppliers',
      list_suppliers.map((vl) => vl.id.toString())
    );
  };

  const checkIsSelectedSupplier = (id: number) => {
    return selectedSuppliers.some((ssp) => ssp.id === id);
  };
  const { windowSize } = useWindowSize()


  return (
    <>
      <Modal isOpen={modalBranches.isOpen} onClose={() => modalBranches.onClose()}>

        <ModalContent className=''>
          <ModalHeader>
            Lista de sucursales

          </ModalHeader>
          <ModalBody>
            <Select
              multiple
              className="dark:text-white font-semibold "
              classNames={{
                label: 'font-semibold dark:text-white text-gray-500 text-sm',

              }}
              errorMessage={formik.touched.branch && formik.errors.branch}
              isInvalid={formik.touched.branch && !!formik.errors.branch}
              label="Sucursales"
              labelPlacement="outside"
              name="branch"
              selectionMode='multiple'
              placeholder="Selecciona la sucursal"
              // selectedKeys={selectedBranches}
              selectedKeys={new Set(selectedBranches.map(String))}
              variant="bordered"
              onBlur={formik.handleBlur('branch')}
              onSelectionChange={(keys) => {
                const keysArray = Array.from(keys as Set<string>).map(String);
                setSelectedBranches(keysArray);
                formik.setFieldValue('branch', keysArray);
              }}

            >
              {branch_list.map((val) => (
                <SelectItem key={val.id} className="dark:text-white">
                  {val.name}
                </SelectItem>
              ))}
            </Select>
            {/* <div>
              <p>Sucursales seleccionadas</p>
              <span>{
              
                }</span>
            </div> */}
            <div className="mt-4">
              <p className="font-semibold text-sm text-gray-700 dark:text-white mb-1">
                Sucursales seleccionadas:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-300">
                {selectedBranches.length > 0 ? (
                  selectedBranches.map((id) => {
                    const found = branch_list.find((branch) => branch.id.toString() === id);

                    return found ? <li key={id}>{found.name}</li> : null;
                  })
                ) : (
                  <p className="italic text-gray-400">Ninguna sucursal seleccionada</p>
                )}
              </ul>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="w-full border shadow dark:border-gray-700 rounded-[12px] p-5 mt-3">
        <p className="text-sm font-semibold text-white">Información a sucursal</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-3">
          <Input
            isRequired
            className="dark:text-white"
            classNames={{ label: 'font-semibold' }}
            label="Costo unitario"
            labelPlacement="outside"
            placeholder="Ingresa el costo unitario del producto"
            variant="bordered"
            {...formik.getFieldProps('costoUnitario')}
            errorMessage={formik.errors.costoUnitario}
            isInvalid={!!formik.errors.costoUnitario && !!formik.touched.costoUnitario}
            onKeyDown={preventLetters}
          />
          <Input
            isRequired
            className="dark:text-white"
            classNames={{ label: 'font-semibold' }}
            label="Cantidad minima"
            labelPlacement="outside"
            placeholder="Ingresa la cantidad minima del producto"
            variant="bordered"
            {...formik.getFieldProps('minimumStock')}
            errorMessage={formik.errors.minimumStock}
            isInvalid={!!formik.errors.minimumStock && !!formik.touched.minimumStock}
            onKeyDown={preventLetters}
          />
          <Input
            isRequired
            className="dark:text-white"
            classNames={{ label: 'font-semibold' }}
            label="Stock"
            labelPlacement="outside"
            placeholder="Ingresa el stock del producto"
            variant="bordered"
            {...formik.getFieldProps('stock')}
            errorMessage={formik.errors.stock}
            isInvalid={!!formik.errors.stock && !!formik.touched.stock}
            onKeyDown={preventLetters}
          />
          <Input
            isRequired
            className="dark:text-white"
            classNames={{ label: 'font-semibold' }}
            label="Precio"
            labelPlacement="outside"
            placeholder="Ingresa el precio del producto"
            variant="bordered"
            {...formik.getFieldProps('price')}
            errorMessage={formik.errors.price}
            isInvalid={!!formik.errors.price && !!formik.touched.price}
            onKeyDown={preventLetters}
          />
          <Input
            isRequired
            className="dark:text-white"
            classNames={{ label: 'font-semibold' }}
            label="PrecioA"
            labelPlacement="outside"
            placeholder="Ingresa el precio A del producto"
            variant="bordered"
            {...formik.getFieldProps('priceA')}
            errorMessage={formik.errors.priceA}
            isInvalid={!!formik.errors.priceA && !!formik.touched.priceA}
            onKeyDown={preventLetters}
          />
          <Input
            isRequired
            className="dark:text-white"
            classNames={{ label: 'font-semibold' }}
            label="Precio B"
            labelPlacement="outside"
            placeholder="Ingresa el precio B del producto"
            variant="bordered"
            {...formik.getFieldProps('priceB')}
            errorMessage={formik.errors.priceB}
            isInvalid={!!formik.errors.priceB && !!formik.touched.priceB}
            onKeyDown={preventLetters}
          />
          <Input
            isRequired
            className="dark:text-white"
            classNames={{ label: 'font-semibold' }}
            label="Precio C"
            labelPlacement="outside"
            placeholder="Ingresa el precio C del producto"
            variant="bordered"
            {...formik.getFieldProps('priceC')}
            errorMessage={formik.errors.priceC}
            isInvalid={!!formik.errors.priceC && !!formik.touched.priceC}
            onKeyDown={preventLetters}
          />
          {windowSize.width < 768 ? (<>
            <button
              className='w-full bg-sky-300 text-white rounded-xl h-10 flex justify-center items-center mt-6'
              onClick={() => {
                // modalBranches.onOpen()
                modalBranches.onOpen()
              }}
            >
              Sucursales
            </button>

          </>) : (<>
            <Select
              multiple
              className="dark:text-white font-semibold "
              classNames={{
                label: 'font-semibold dark:text-white text-gray-500 text-sm',

              }}
              errorMessage={formik.touched.branch && formik.errors.branch}
              isInvalid={formik.touched.branch && !!formik.errors.branch}
              label="Sucursales"
              selectionMode='multiple'
              labelPlacement="outside"
              name="branch"
              placeholder="Selecciona la sucursal"
              selectedKeys={new Set(selectedBranches)}
              variant="bordered"
              onBlur={formik.handleBlur('branch')}
              onSelectionChange={(keys) => {
                const keysArray = Array.from(keys as Set<string>);
                console.log('onSelectionChange keysArray:', keysArray);
                setSelectedBranches(keysArray);
                formik.setFieldValue('branch', keysArray);
              }}
            // onSelectionChange={(keys) => {
            //   const setkeys = new Set(keys as unknown as string[]);
            //   const keysArray = Array.from(setkeys);

            //   if (keysArray.length > 0) {
            //     const includes_key = selectedBranches.includes(keysArray[0]);

            //     if (!includes_key) {
            //       const news = [...selectedBranches, ...keysArray];

            //       setSelectedBranches(news);
            //       formik.setFieldValue('branch', news);
            //     } else {
            //       setSelectedBranches(keysArray);
            //       formik.setFieldValue('branch', keysArray);
            //     }
            //   } else {
            //     setSelectedBranches([]);
            //     formik.setFieldValue('branch', []);
            //   }
            // }}
            >
              {branch_list.map((val) => (
                <SelectItem key={val.id} className="dark:text-white">
                  {val.name}
                </SelectItem>
              ))}
            </Select>
          </>)}

          <div className="flex gap-5 items-end col-span-2 md:col-span-1">
            <Input
              readOnly
              className="w-full dark:text-white"
              classNames={{
                label: 'font-semibold dark:text-white text-gray-500 text-sm',
              }}
              errorMessage={formik.errors.suppliers}
              isInvalid={!!formik.errors.suppliers && !!formik.touched.suppliers}
              label="Proveedores"
              labelPlacement="outside"
              placeholder="Selecciona los proveedores"
              value={selectedSuppliers.map((supp) => supp.nombre).join(', ')}
              variant="bordered"
            />
            <ButtonUi isIconOnly theme={Colors.Info} onPress={modalSuppliers.onOpen}>
              <Search />
            </ButtonUi>
          </div>
        </div>
        <Modal {...modalSuppliers} scrollBehavior="inside" size="xl">
          <ModalContent>
            <ModalHeader>Selecciona los proveedores</ModalHeader>
            <ModalBody className="flex flex-col h-full overflow-y-auto">
              <div className="flex gap-5 items-end">
                <Input
                  className="dark:text-white"
                  classNames={{
                    label: 'font-semibold',
                  }}
                  endContent={
                    <div className="flex items-center">
                      <label className="sr-only" htmlFor="currency">
                        Currency
                      </label>
                      <select
                        className="outline-none border-0 bg-transparent text-default-400 text-small"
                        id="currency"
                        name="currency"
                        onChange={(e) => {
                          setSelectedTypeSearch(e.currentTarget.value as 'NOMBRE');
                        }}
                      >
                        {typeSearch.map((tpS) => (
                          <option key={tpS} value={tpS}>
                            {tpS}
                          </option>
                        ))}
                      </select>
                    </div>
                  }
                  label="Buscar proveedor"
                  labelPlacement="outside"
                  placeholder="Escribe para buscar"
                  startContent={<Search />}
                  type="text"
                  value={search}
                  variant="bordered"
                  onValueChange={setSearch}
                />
                <ButtonUi theme={Colors.Primary} onPress={() => handleSearch(1)}>
                  Buscar
                </ButtonUi>
              </div>
              <div className="flex flex-col overflow-y-auto h-full w-full gap-3">
                {supplier_pagination.suppliers.map((sup) => (
                  <button
                    key={sup.id}
                    className={classNames(
                      checkIsSelectedSupplier(sup.id)
                        ? 'shadow-green-100 dark:shadow-gray-500 border-green-400 dark:border-gray-800 bg-green-50 dark:bg-gray-950'
                        : '',
                      'shadow border dark:border-gray-600 w-full flex flex-col justify-start rounded-[12px] p-4'
                    )}
                    onClick={() => handleAddSupplier(sup)}
                  >
                    <div className="flex justify-between gap-5 w-full">
                      <p className="text-sm font-semibold dark:text-white">{sup.nombre}</p>
                      <Checkbox
                        checked={checkIsSelectedSupplier(sup.id)}
                        isSelected={checkIsSelectedSupplier(sup.id)}
                        onValueChange={() => {
                          handleAddSupplier(sup);
                        }}
                      />
                    </div>
                    <div className="w-full dark:text-white flex flex-col justify-start text-left mt-2">
                      <p className="w-full dark:text-white">Correo: {sup.correo}</p>
                      <p className="w-full dark:text-white">NRC: {sup.nrc}</p>
                      <p className="w-full dark:text-white">NIT: {sup.nit}</p>
                    </div>
                  </button>
                ))}
                {supplier_pagination.suppliers.length === 0 && (
                  <div className="flex flex-col justify-center items-center mt-5">
                    <Box size={100} />
                    <p className="text-sm font-semibold mt-6">No se encontraron proveedores</p>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="w-full flex justify-between">
              <ButtonUi
                isIconOnly
                theme={Colors.Primary}
                onPress={() => {
                  handleSearch(supplier_pagination.prevPag);
                }}
              >
                <ChevronLeft />
              </ButtonUi>
              <span className='text-sm font-semibold dark:text-white'>{supplier_pagination.currentPag} / {supplier_pagination.totalPag}</span>
              <ButtonUi
                isIconOnly
                theme={Colors.Primary}
                onPress={() => {
                  handleSearch(supplier_pagination.nextPag);
                }}
              >
                <ChevronRight />
              </ButtonUi>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}

export default BranchProductInfo;
