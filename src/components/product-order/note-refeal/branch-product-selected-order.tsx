import { motion } from 'framer-motion';
import { ArrowBigLeft, Minus, Plus, Save, Trash, TriangleAlert } from 'lucide-react';
import { Dispatch, ReactNode, SetStateAction, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from '@heroui/react';
import { MdCancel, MdWarning } from 'react-icons/md';
import { useNavigate } from 'react-router';

import { useEmployeeStore } from '@/store/employee.store';
import { useBranchesStore } from '@/store/branches.store';
import { usePointOfSales } from '@/store/point-of-sales.store';
import { useCustomerStore } from '@/store/customers.store';
import { Customer } from '@/types/customers.types';
import { Employee } from '@/types/employees.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { useSocket } from '@/hooks/useSocket';
import { TableComponent } from '@/themes/ui/table-ui';
import TdGlobal from '@/themes/ui/td-global';
import { useShippingBranchProductBranch } from '@/shopping-branch-product/store/shipping_branch_product.store';
import GenerateAShippingNote from '@/shopping-branch-product/components/GenerateAShippingNote';
import { Branches } from '@/shopping-branch-product/types/shipping_branch_product.types';
import { ICheckStockResponse } from '@/types/branch_products.types';
import { verify_products_stock } from '@/services/branch_product.service';

interface Props {
  branchData: Branches;
  branchDestiny?: Branches;
  setErrors: Dispatch<SetStateAction<string[]>>;
  setTitleString: Dispatch<SetStateAction<string>>;
  setCurrentStep: Dispatch<SetStateAction<string>>;
  openModalSteps: () => void;
  titleError: string;
  // response: ICheckStockResponse | undefined
  setResponse: (response: ICheckStockResponse) => void
  children?: ReactNode
}


interface Product {
  id: number,
  name: string,
  quantity: number,
}

export default function BranchProductSelectedOrder(props: Props) {
  const [branchData, setBranchData] = useState<Branches>();
  const {
    product_selected,
    OnClearProductSelected,
    OnPlusProductSelected,
    OnMinusProductSelected,
    OnChangeQuantityManual,
    OnClearDataShippingProductBranch,
    response,
  } = useShippingBranchProductBranch();
  const { employee_list, getEmployeesList } = useEmployeeStore();
  const { branch_list, getBranchesList } = useBranchesStore();
  const { point_of_sales, getPointOfSales } = usePointOfSales();
  const { socket } = useSocket()
  const modalError = useDisclosure()
  const navigate = useNavigate()

  useEffect(() => {
    getEmployeesList();
    getBranchesList();
  }, []);

  useEffect(() => {
    OnClearDataShippingProductBranch;
  }, []);

  const [employeeReceptor, setEmployeeReceptor] = useState<Employee>();
  const { customer_list, getCustomerByBranchId } = useCustomerStore();
  const [customerData, setCustomerData] = useState<Customer>();
  const [responsibleEmployee, setResponsibleEmployee] = useState<Employee>();
  const [pointOfSaleId, setPointOfSaleId] = useState(
    point_of_sales.find((p) => p.typeVoucher === 'NRE')?.id ?? 0
  );
  const [movementType, setMovementType] = useState(2);
  const [observations, setObservations] = useState('Nota de Remisión a partir de orden de producto');

  useEffect(() => {
    if (props.branchData)
      getPointOfSales(props.branchData.id);
  }, [props.branchData]);

  const filteredEmployees = useMemo(() => {
    if (branchData) {
      return employee_list.filter((em) => em.branch.id == branchData.id);
    }

    return [];
  }, [employee_list, branchData]);

  useEffect(() => {
    getCustomerByBranchId();
  }, []);

  useEffect(() => {
    if (props.branchDestiny) {
      setBranchData(props.branchDestiny)
    }

  }, [props.branchDestiny])

  useEffect(() => {
    if (point_of_sales) {
      setPointOfSaleId(point_of_sales.find((p) => p.typeVoucher === 'NRE')?.id ?? 0)
    }
  }, [point_of_sales])

  const [isModalOpen, setIsModalOpen] = useState(false);
  const branchIssuingId = branchData?.id ?? 0

  const handleSave = async () => {
    if (!responsibleEmployee) {
      toast.warning('Debes seleccionar el responsable');

      return;
    }

    if (!props.branchData) {
      toast.warning('Debes seleccionar la sucursal de origen');

      return;
    }

    const isValid = await verifyProducts(props.branchData);

    if (isValid) {
      setIsModalOpen(true);
    }
  };


  const verifyProducts = async (branch: Branches): Promise<boolean> => {
    let products: Product[] = product_selected.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      quantity: item.quantity ?? 1,
    }));

    const data = await verify_products_stock(branch.id, products);

    if (data) {
      props.setResponse(data.data);

      const hasWarningsOrErrors = data.data?.results.some(
        (item) => item.status === 'insufficient_stock' || item.status === 'not_found'
      );

      if (hasWarningsOrErrors) {
        modalError.onOpen();

        return false;
      }
    }

    return true;
  };



  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <ButtonUi
          startContent={<ArrowBigLeft />}
          theme={Colors.Info}
          onPress={() => {
            navigate('/order-products')
            props.setResponse({ ok: false, results: [] })
          }}
        >
          Regresar
        </ButtonUi>
      </div>
      {product_selected.length === 0 ? (
        <div className="flex mt-3 items-center justify-center h-[100%] border border-gray-700 w-[100%] rounded-xl">
          <div className="flex items-center justify-center w-80 h-[400px]">
            <span className="text-2xl font-bold dark:text-white">Sin resultados</span>
          </div>
        </div>
      ) : (
        <>
          <div className='flex gap-5 items-start mt-4'>
            <Autocomplete
              required
              className="dark:text-white font-semibold max-w-72"
              clearButtonProps={{
                onClick: () => {
                  setResponsibleEmployee(undefined);
                },
              }}
              label="Responsable"
              labelPlacement="outside"
              placeholder="Selecciona el empleado responsable"
              variant="bordered"
              onSelectionChange={(key) => {
                if (key) {
                  const employee = JSON.parse(key as string) as Employee;

                  setResponsibleEmployee(employee);
                }
              }}
            >
              {employee_list &&
                employee_list.map((employee) => (
                  <AutocompleteItem
                    key={JSON.stringify(employee)}
                    className="dark:text-white"
                    textValue={
                      employee.firstName + ' ' + employee.secondName + ' ' + employee.firstLastName + ' ' + employee.secondLastName
                    }
                  >
                    {employee.firstName ?? '-'} {employee.secondName ?? '-'} {employee.firstLastName ?? '-'}{employee.secondLastName ?? '-'}
                  </AutocompleteItem>
                ))}
            </Autocomplete>
            {props.children}
          </div>
          <div className="flex justify-between">
            <span className="text-2xl font-bold dark:text-white">Productos a Enviar</span>
            <ButtonUi
              className="dark:text-wite"
              theme={Colors.Success}
              onPress={() => handleSave()}
            >
              <Save />
              Guardar
            </ButtonUi>
          </div>
          <TableComponent className='uppercase' headers={[
            'N°',
            'Nombre',
            'Categoria',
            'Stock disponible',
            'Cantidad',
            'Acciones',
          ]}>
            {product_selected.map((item, index) => (
              <motion.tr
                key={item.id}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 "
                initial={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <TdGlobal className="px-6 py-4 dark:text-white">{index + 1}</TdGlobal>
                <TdGlobal className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {item?.product.name}
                </TdGlobal>
                <TdGlobal className="px-6 py-4 dark:text-white">
                  {item.product?.subCategory?.categoryProduct?.name}
                </TdGlobal>

                <TdGlobal className="px-6 py-4 dark:text-white">
                  {item.stock}
                </TdGlobal>
                <TdGlobal className="px-6 py-4 dark:text-white">
                  <Input
                    value={item.quantity!.toString()}
                    variant="bordered"
                    onChange={(e) => {
                      OnChangeQuantityManual(
                        item.id,
                        item.product.id,
                       Number(item.stock),
                        Number(e.currentTarget.value.replace(/[^0-9]/g, ''))
                      );
                    }}
                  />
                </TdGlobal>
                <TdGlobal className="px-6 py-4 dark:text-white ">
                  <div className="flex gap-4">
                    <ButtonUi
                      isIconOnly
                      theme={Colors.Success}
                      onPress={() => OnPlusProductSelected(item.id, Number(item.stock))}
                    >
                      <Plus />
                    </ButtonUi>
                    <ButtonUi
                      isIconOnly
                      theme={Colors.Primary}
                      onPress={() => OnMinusProductSelected(item.id)}
                    >
                      <Minus />
                    </ButtonUi>
                    <ButtonUi
                      isIconOnly
                      theme={Colors.Error}
                      onPress={() => OnClearProductSelected(item.id)}
                    >
                      <Trash />
                    </ButtonUi>
                  </div>
                </TdGlobal>
              </motion.tr>
            ))}
          </TableComponent>
        </>
      )}
      <Modal
        backdrop="blur"
        isOpen={isModalOpen}
        scrollBehavior="inside"
        size="xl"
        onClose={() => setIsModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader className="flex justify-between ">
            <p className="dark:text-white">Seleccionar destino de movimiento</p>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-3">
              <Select
                className="dark:text-white"
                classNames={{
                  base: 'font-semibold text-sm text-gray-900 dark:text-white',
                }}
                label="Tipo de movimiento"
                labelPlacement="outside"
                placeholder="Selecciona el tipo de movimiento"
                selectedKeys={[movementType.toString()]}
                variant="bordered"
                onSelectionChange={(key) => {
                  if (key) {
                    if (Number(key.currentKey) === 2) {
                      setCustomerData(undefined);
                    } else {
                      setEmployeeReceptor(undefined);
                    }
                    setMovementType(Number(key.currentKey));
                  }
                }}
              >

                <SelectItem
                  key={2}
                  className="dark:text-white"

                >
                  Enviar a Sucursal
                </SelectItem>
              </Select>
              {movementType === 1 && (
                <>
                  <Autocomplete
                    className="dark:text-white"
                    classNames={{
                      base: 'font-semibold text-sm text-gray-900 dark:text-white',
                    }}
                    clearButtonProps={{
                      onClick: () => {
                        setCustomerData(undefined);
                      },
                    }}
                    label="Selecciona el cliente destino"
                    labelPlacement="outside"
                    placeholder="Selecciona  el cliente destino"
                    variant="bordered"
                    onSelectionChange={(key) => {
                      if (key) {
                        const customer = JSON.parse(key as string) as Customer;

                        setCustomerData(customer);
                      }
                    }}
                  >
                    {customer_list.map((c) => (
                      <AutocompleteItem
                        key={JSON.stringify(c)}
                        className="dark:text-white"
                      >
                        {c.nombre}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  <Autocomplete
                    classNames={{
                      base: 'font-semibold text-sm text-gray-900 dark:text-white',
                    }}
                    defaultSelectedKey={pointOfSaleId.toString()}
                    label="Punto de venta de salida"
                    labelPlacement="outside"
                    placeholder="Selecciona el punto de venta"
                    variant="bordered"
                    onSelectionChange={(key) => {
                      if (key) {
                        const pointSale = JSON.parse(key as string) as {
                          id: number;
                          code: string;
                        };

                        setPointOfSaleId(pointSale.id);
                      }
                    }}
                  >
                    {point_of_sales
                      .filter((p) => ['NRE'].includes(p.typeVoucher))
                      .map((p) => (
                        <AutocompleteItem
                          key={JSON.stringify(p)}
                          className="dark:text-white"
                        >
                          {p.code}
                        </AutocompleteItem>
                      ))}
                  </Autocomplete>
                </>
              )}
              {movementType === 2 && (
                <>
                  <Autocomplete
                    className="dark:text-white"
                    classNames={{
                      base: 'font-semibold text-sm text-gray-900 dark:text-white',
                    }}
                    clearButtonProps={{
                      onClick: () => {
                        setBranchData(undefined);
                      },
                    }}
                    label="Selecciona la sucursal destino"
                    labelPlacement="outside"
                    placeholder="Selecciona la sucursal destino"
                    selectedKey={branchData && branchData?.id?.toString()}
                    variant="bordered"
                    onSelectionChange={(key) => {
                      if (key) {
                        const branch = branch_list.find((b) => b.id === Number(key));

                        if (!branch) {
                          toast.error('Sucursal no encontrada');

                          return;
                        }

                        if (branch.id === props.branchData.id) {
                          toast.error('No puedes enviar a la misma sucursal');

                          return;
                        }
                        setBranchData(branch as any);
                      }
                    }}
                  >
                    {branch_list.map((branch) => (
                      <AutocompleteItem
                        key={branch.id}
                        // value={branch.name}
                        className="dark:text-white"
                      >
                        {branch.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  <Autocomplete
                    classNames={{
                      base: 'font-semibold text-sm text-gray-900 dark:text-white',
                    }}
                    defaultSelectedKey={pointOfSaleId.toString()}
                    label="Selecciona el punto de venta"
                    labelPlacement="outside"
                    placeholder="Selecciona el punto de venta"
                    variant="bordered"
                    onSelectionChange={(key) => {
                      if (key) {
                        setPointOfSaleId(Number(key));
                      }
                    }}
                  >
                    {point_of_sales
                      .filter((p) => ['NRE'].includes(p.typeVoucher))
                      .map((p) => (
                        <AutocompleteItem
                          key={p.id}
                          className="dark:text-white"
                        >
                          {p.code}
                        </AutocompleteItem>
                      ))}
                  </Autocomplete>

                  <Autocomplete
                    classNames={{
                      base: 'font-semibold text-sm text-gray-900 dark:text-white',
                    }}
                    clearButtonProps={{
                      onClick: () => {
                        setEmployeeReceptor(undefined);
                      },
                    }}
                    label="Selecciona el empleado a enviar "
                    labelPlacement="outside"
                    placeholder="Selecciona el empleado a enviar"
                    variant="bordered"
                    onSelectionChange={(key) => {
                      if (key) {
                        const employee = JSON.parse(key as string) as Employee;

                        setEmployeeReceptor(employee);
                      }
                    }}
                    
                  >
                    {filteredEmployees.map((employee) => (
                      <AutocompleteItem
                        key={JSON.stringify(employee)}
                        className="dark:text-white"
                         textValue={
                            employee.firstName +  ' ' + employee.firstLastName 
                          }
                      >
                        {employee.firstName}{' '}{employee.firstLastName}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </>
              )}
              <Textarea
                classNames={{ base: 'font-semibold text-sm text-gray-900 dark:text-white' }}
                label="Observaciones"
                labelPlacement="outside"
                placeholder="Escribe ... "
                rows={3}
                value={observations}
                variant="bordered"
                onChange={(e) => setObservations(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-between items-end">
            <ButtonUi
              className="px-10"
              theme={Colors.Error}
              onPress={() => setIsModalOpen(false)}
            >
              Cancelar
            </ButtonUi>
            <GenerateAShippingNote
              branch={props.branchData}
              branchIssuingId={branchIssuingId}
              branchLlegada={branchData}
              customer={customerData}
              employee={responsibleEmployee as Employee}
              employeeReceptor={employeeReceptor as Employee}
              observation={observations}
              openModalSteps={props.openModalSteps}
              pointOfSaleId={pointOfSaleId}
              setCurrentStep={props.setCurrentStep}
              setErrors={props.setErrors}
              setTitleString={props.setTitleString}
              socket={socket}
              titleError={props.titleError}
              onOpenChange={props.openModalSteps}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal {...modalError}>
        <ModalContent>
          <ModalHeader className='flex gap-2'>
            <TriangleAlert className='text-orange-500' size={26} /> Advertencia
          </ModalHeader>
          <ModalBody className='pb-4'>
            {response && response.results.length > 0 && (
              <div className='text-[14px]'>
                {response.results.filter((item) => item.status !== 'ok').map((item) => {
                  let icon, color, message;

                  switch (item.status) {
                    case 'insufficient_stock':
                      icon = <span className="text-yellow-600"><MdWarning /></span>;
                      color = 'text-yellow-700';
                      message = `${item.productName}: stock insuficiente (${item.stock} disponibles, requiere ${item.required})`;
                      break;
                    case 'not_found':
                      icon = <span className="text-red-600"><MdCancel /></span>;
                      color = 'text-red-700';
                      message = `${item.productName}: no encontrado en esta sucursal`;
                      break;
                    default:
                      icon = null;
                      color = 'text-gray-700';
                      message = item.productName;
                  }

                  return (
                    <div key={item.productId} className={`flex items-center gap-2 ${color}`}>
                      {icon}
                      <span>{message}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <strong className='text-[14px]'>¡Advertencia: Se encontró algunos problemas con algunos productos!</strong>
          </ModalBody>
        </ModalContent>
      </Modal>
    </motion.div>
  );
}

