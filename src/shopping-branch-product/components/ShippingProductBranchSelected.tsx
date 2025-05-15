import { motion } from 'framer-motion';
import { Minus, MoveLeft, Plus, Trash } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from '@heroui/react';

import { useShippingBranchProductBranch } from '../store/shipping_branch_product.store';
import { Branches } from '../types/shipping_branch_product.types';

import GenerateAShippingNote from './GenerateAShippingNote';

import { global_styles } from '@/styles/global.styles';
import { useEmployeeStore } from '@/store/employee.store';
import { useBranchesStore } from '@/store/branches.store';
import { usePointOfSales } from '@/store/point-of-sales.store';
import { useCustomerStore } from '@/store/customers.store';
import { Customer } from '@/types/customers.types';
import { Employee } from '@/types/employees.types';






interface Props {
  branchData: Branches;
  setErrors: Dispatch<SetStateAction<string[]>>;
  setTitleString: Dispatch<SetStateAction<string>>;
  setCurrentStep: Dispatch<SetStateAction<string>>;
  openModalSteps: () => void;
  titleError: string;
}

function ShippingProductBranchSelected(props: Props) {
  const [branchData, setBranchData] = useState<Branches>();
  const {
    product_selected,
    OnClearProductSelected,
    OnPlusProductSelected,
    OnMinusProductSelected,
    OnChangeQuantityManual,
    OnUpdatePriceManual,
    OnClearDataShippingProductBranch,
  } = useShippingBranchProductBranch();
  const { employee_list, getEmployeesList } = useEmployeeStore();
  const { branch_list, getBranchesList } = useBranchesStore();
  const { point_of_sales, getPointOfSales } = usePointOfSales();

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
  const [pointOfSaleId, setPointOfSaleId] = useState(0);
  const [movementType, setMovementType] = useState(2);
  const [observations, setObservations] = useState('');

  useEffect(() => {
    getPointOfSales(props.branchData.id);
  }, [props]);

  const filteredEmployees = useMemo(() => {
    if (branchData) {
      return employee_list.filter((em) => em.branch.id == branchData.id);
    }

    return [];
  }, [employee_list, branchData]);

  useEffect(() => {
    getCustomerByBranchId();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg shadow-lg p-2"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-2xl font-bold dark:text-white">Productos a Enviar</span>
        {product_selected.length === 0 ? (
          <div className="flex mt-3 items-center justify-center h-[100%] border border-gray-700 w-[100%] rounded-xl">
            <div className="flex items-center justify-center w-80 h-[400px]">
              <span className="text-2xl font-bold dark:text-white">Sin resultados</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between">
              <div>
                <Autocomplete
                  className="dark:text-white mt-4"
                  clearButtonProps={{
                    onClick: () => {
                      setResponsibleEmployee(undefined);
                    },
                  }}
                  label="Selecciona el empleado responsable"
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
                      >
                        {employee.firstName}
                      </AutocompleteItem>
                    ))}
                </Autocomplete>
              </div>
              <div className="mt-10">
                <Button
                  className="dark:text-wite"
                  color="primary"
                  isDisabled={responsibleEmployee === undefined}
                  onClick={() => setIsModalOpen(true)}
                >
                  <MoveLeft />
                  Guardar
                </Button>
              </div>
            </div>
            <table className="  w-full mt-2 text-sm text-left text-gray-500 dark:text-gray-400">
              <motion.thead
                animate={{ opacity: 1, y: 0 }}
                className="text-xs h-[100%]  text-gray-700 uppercase "
                initial={{ opacity: 0, y: -20 }}
              >
                <tr>
                  {[
                    'N°',
                    'Nombre',
                    'Categoria',
                    'SubCategoria',
                    'Precio',
                    'Cantidad',
                    'Acciones',
                  ].map((column) => (
                    <motion.th
                      key={column}
                      className="px-6 py-4  "
                      scope="col"
                      style={{
                        backgroundColor: global_styles().darkStyle.backgroundColor,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-white"
                          style={{ color: global_styles().darkStyle.color }}
                        >
                          {column.charAt(0).toUpperCase() + column.slice(1)}
                        </span>
                      </div>
                    </motion.th>
                  ))}
                </tr>
              </motion.thead>
              <tbody>
                {product_selected.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 "
                    initial={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4 dark:text-white">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {item?.product.name}
                    </td>
                    <td className="px-6 py-4 dark:text-white">
                      {item.product?.subCategoryProduct?.categoryProduct?.name}
                    </td>
                    <td className="px-6 py-4 dark:text-white">
                      {item?.product?.subCategoryProduct?.name}
                    </td>
                    <td className="px-6 py-4 dark:text-white">
                      <Input
                        value={item.price!.toString()}
                        variant="bordered"
                        onChange={(e) => {
                          OnUpdatePriceManual(item.id, String(e.currentTarget.value));
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 dark:text-white">
                      <Input
                        value={item.quantity!.toString()}
                        variant="bordered"
                        onChange={(e) => {
                          OnChangeQuantityManual(
                            item.id,
                            Number(e.currentTarget.value.replace(/[^0-9]/g, ''))
                          );
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 dark:text-white ">
                      <div className="flex gap-4">
                        <Button
                          isIconOnly
                          style={{ backgroundColor: global_styles().darkStyle.backgroundColor }}
                          onClick={() => OnPlusProductSelected(item.id)}
                        >
                          <Plus style={{ color: global_styles().darkStyle.color }} />
                        </Button>
                        <Button
                          isIconOnly
                          style={{ backgroundColor: global_styles().warningStyles.backgroundColor }}
                          onClick={() => OnMinusProductSelected(item.id)}
                        >
                          <Minus style={{ color: global_styles().warningStyles.color }} />
                        </Button>
                        <Button
                          isIconOnly
                          style={{ backgroundColor: global_styles().dangerStyles.backgroundColor }}
                          onClick={() => OnClearProductSelected(item.id)}
                        >
                          <Trash style={{ color: global_styles().dangerStyles.color }} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </motion.div>

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
                    selectedKey={branchData && branchData.id.toString()}
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
                    label="Selecciona el punto de venta"
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
                      >
                        {employee.firstName}
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
            <Button
              className="px-10"
              style={global_styles().dangerStyles}
              variant="light"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <GenerateAShippingNote
              branch={props.branchData}
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
              titleError={props.titleError}
              onOpenChange={props.openModalSteps}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </motion.div>
  );
}

export default ShippingProductBranchSelected;
