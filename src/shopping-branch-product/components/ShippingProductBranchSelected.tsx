import { motion } from 'framer-motion';
import { Minus, MoveLeft, Plus, Trash } from 'lucide-react';
import React, { Dispatch, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
  useDisclosure,
} from '@heroui/react';
import { useHotkeys } from 'react-hotkeys-hook';

import { useShippingBranchProductBranch } from '../store/shipping_branch_product.store';
import { Branches } from '../types/shipping_branch_product.types';

import GenerateAShippingNote from './GenerateAShippingNote';

import { useEmployeeStore } from '@/store/employee.store';
import { useBranchesStore } from '@/store/branches.store';
import { usePointOfSales } from '@/store/point-of-sales.store';
import { useCustomerStore } from '@/store/customers.store';
import { Customer } from '@/types/customers.types';
import { Employee } from '@/types/employees.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { useSocket } from '@/hooks/useSocket';
import { ThemeContext } from '@/hooks/useTheme';
import TdGlobal from '@/themes/ui/td-global';

interface Props {
  branchData: Branches;
  branchDestiny?: Branches;
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
    OnUpdateCosteManual,
    OnClearDataShippingProductBranch,
  } = useShippingBranchProductBranch();
  const { employee_list, getEmployeesList } = useEmployeeStore();
  const { branch_list, getBranchesList } = useBranchesStore();
  const { point_of_sales, getPointOfSales } = usePointOfSales();
  const { socket } = useSocket()
  const { theme, context } = useContext(ThemeContext);

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const branchIssuingId = branchData?.id ?? 0
  const autocomplete = React.useRef<HTMLInputElement>(null)
  const [closeModal, setCloseModal] = useState(false)

  useHotkeys('ctrl+f3', () => {
    autocomplete?.current?.focus()
  })

  useHotkeys('ctrl+0', () => {
    if (!responsibleEmployee) {
      toast.warning('Debes seleccionar un empleado')

      return
    }
    setIsModalOpen(true)
  })

  useHotkeys('0', () => {
    if (isModalOpen) {
      setCloseModal(true)
    }
  })



  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectProduct, setSelectedProduct] = useState(0)


  useHotkeys('arrowdown', () => {
    setSelectedIndex((prev) => {
      const next = Math.min(product_selected.length - 1, prev + 1);

      rowRefs.current[next]?.focus();

      return next;
    });
  });

  useHotkeys('arrowup', () => {
    setSelectedIndex((prev) => {
      const next = Math.max(0, prev - 1);

      rowRefs.current[next]?.focus();

      return next;
    });
  });
  const modalDelete = useDisclosure()


  useHotkeys('backspace', () => {
    const selectedProduct = product_selected[selectedIndex];

    if (selectedProduct) {
      modalDelete.onOpen()
      setSelectedProduct(selectedProduct?.id ?? 0)
    }
  });

  useHotkeys('Enter', () => {
    if (modalDelete.isOpen) {
      handleDeleteProduct()
    }
    if (closeModal) {
      handleClosed()
    }
  })

  const handleDeleteProduct = () => {
    OnClearProductSelected(selectProduct)
    modalDelete.onClose()
  }

  const handleClosed = () => {
    setIsModalOpen(false)
    setCloseModal(false)
  }


  return (
    <>
      <Modal isDismissable isOpen={modalDelete.isOpen} size='md' onClose={modalDelete.onClose}>
        <ModalContent>
          <ModalHeader className='text-14'>
            ¿Deseas quitar este producto seleccionado?
          </ModalHeader>
          <ModalBody>
            <div className='flex justify-between'>
              <ButtonUi
                theme={Colors.Error}
                onPress={() => { modalDelete.onClose() }
                }
              >
                Cancelar
              </ButtonUi>
              <ButtonUi
                theme={Colors.Success}
                onPress={() => {
                  handleDeleteProduct()
                }}
              >
                Aceptar
              </ButtonUi>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal >
      <Modal isDismissable isOpen={closeModal} size='md' onClose={() => { setCloseModal(false) }}>
        <ModalContent>
          <ModalHeader className='text-14'>
            ¿Deseas cerrar el formulario?
          </ModalHeader>
          <ModalBody>
            <div className='flex justify-between'>
              <ButtonUi
                theme={Colors.Error}
                onPress={() => { setCloseModal(false) }
                }
              >
                Cancelar
              </ButtonUi>
              <ButtonUi
                theme={Colors.Success}
                onPress={() => {
                  handleClosed()
                }}
              >
                Aceptar
              </ButtonUi>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal >
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
                    ref={autocomplete}
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
                    onPress={() => setIsModalOpen(true)}
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
                      'Costo Unitario',
                      'Cantidad',
                      'Acciones',
                    ].map((column) => (
                      <motion.th
                        key={column}
                        className="px-6 py-4  "
                        scope="col"
                        style={{
                          color: theme.colors[context].table.textColor,
                          backgroundColor: theme.colors[context].table.background,
                          fontSize: "12px",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-white"
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
                      ref={(el) => (rowRefs.current[index] = el)}
                      animate={{ opacity: 1, x: 0 }}
                      className={`transition-colors
                        focus:outline-none ${index === selectedIndex ? 'ring-2 ring-emerald-500 rounded-lg' : ''
                        }`}

                      initial={{ opacity: 0, x: -20 }}
                      tabIndex={-1}
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
                        <Input
                          value={Number(item.costoUnitario)!.toString()}
                          variant="bordered"
                          onChange={(e) => {
                            OnUpdateCosteManual(item.id, String(e.currentTarget.value));
                          }}
                        />
                      </TdGlobal>
                      <TdGlobal className="px-6 py-4 dark:text-white">
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
                      </TdGlobal>
                      <TdGlobal className="px-6 py-4 dark:text-white ">
                        <div className="flex gap-4">
                          <ButtonUi
                            isIconOnly
                            theme={Colors.Success}
                            onPress={() => OnPlusProductSelected(item.id)}
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
          onClose={() => setCloseModal(true)

          }
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
              <ButtonUi
                className="px-10"
                // style={global_styles().dangerStyles}
                // variant="light"
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
      </motion.div>
    </>

  );
}

export default ShippingProductBranchSelected;
