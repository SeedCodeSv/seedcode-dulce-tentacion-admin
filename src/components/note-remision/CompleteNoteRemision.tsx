import { useEffect, useState } from 'react'
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  UseDisclosureProps
} from '@heroui/react'
import { toast } from 'sonner'


import HeadlessModal from '../global/HeadlessModal'
import useGlobalStyles from '../global/global.styles'

import { DetailNote, ReferalNote } from '@/types/referal-note.types'
import { useReferalNote } from '@/store/referal-notes'
import { useAuthStore } from '@/store/auth.store'
import { get_employee_by_code } from '@/services/employess.service'
import { formatSimpleDate, getElSalvadorDateTime } from '@/utils/dates'
import { useEmployeeStore } from '@/store/employee.store'
import { Motivos_Complet } from '@/utils/constants'

interface Props {
  visibled: UseDisclosureProps
  note: ReferalNote
  onClose: () => void
  reload: () => void
}
type EditableDetail = DetailNote & { cantidadItemEditada: number };

export const CompleteNoteModal = ({ visibled, note, onClose, reload }: Props) => {
  const globalStyles = useGlobalStyles()
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuthStore()
  const [employeeCode, setEmployeeCode] = useState('')
  const { getEmployeesByBranch, employee_list } = useEmployeeStore()
  const [motivoComplet, setMotivoComplet] = useState('')
  const [editableDetails, setEditableDetails] = useState<EditableDetail[]>([]);
  const { completeReferalNote,
    getReferalNoteByBranch,
    getDetailNote, detailNoteReferal
  } = useReferalNote()


  useEffect(() => {
    if (note?.isCompleted) {
      getEmployeesByBranch(user?.branchId ?? 0)
    }
    getDetailNote(note?.id ?? 0)
  }, [note?.isCompleted, user?.branchId, note?.id])

  useEffect(() => {
    if (!detailNoteReferal || detailNoteReferal.length === 0) return;

    setEditableDetails(
      detailNoteReferal.map((item) => ({
        ...item,
        cantidadItemEditada: item.cantidadItem
      }))
    );
  }, [detailNoteReferal]);


  const handleCompleteNote = async () => {
    try {
      setIsLoading(true)

      if (!employeeCode) {
        setIsLoading(false)

        return toast.warning('Ingresa el codigo de empleado')
      }
      if (!motivoComplet) {
        setIsLoading(false)

        return toast.warning('Debes seleccionar un complemento')
      }

      await get_employee_by_code(employeeCode)
        .then((value) => {
          if (value.data.employee) {
            const fullName =
              value?.data?.employee?.firstName +
              ' ' +
              value?.data?.employee?.secondName +
              ' ' +
              value?.data?.employee?.firstLastName +
              ' ' +
              value?.data?.employee?.secondLastName
            const payload = {
              code: employeeCode ?? '',
              descriptionCompleted: `${employeeCode ?? 'N/A'}-${fullName}-${motivoComplet ?? 'N/A'}-${getElSalvadorDateTime().fecEmi}-${getElSalvadorDateTime().horEmi}`
              , details: editableDetails.map(item => ({
                idDetail: item.id,
                cantidadItemEditada: item.cantidadItemEditada,
                cantidadItem: item.cantidadItem
              }))
            }

            completeReferalNote(note.id, payload).then(() => {
              setIsLoading(false)
              getReferalNoteByBranch(Number(user?.branchId), 1, 10, false)
              onClose(), reload()
            })
          }
        })
        .catch(() => {
          setIsLoading(false)
          toast('No se encontro el empleado')
        })

    } catch (error) {
      setIsLoading(false)
    }
  }

  function EmployeeReceiving(value: number) {
    const values = employee_list.find((i) => i.id === value)
    const fullName =
      values?.firstName +
      ' ' +
      values?.secondName +
      ' ' +
      values?.firstLastName +
      ' ' +
      values?.secondLastName

    return fullName
  }

  return (
    <>
      {note?.isCompleted ? (
        <HeadlessModal
          isOpen={true}
          size="p-4 max-w-[500px]"
          title="Detalle de la nota de remisión"
          onClose={onClose}
        >
          <section className="flex flex-col gap-3 p-3">
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              Fecha:{' '}
              <span className="font-semibold">
                {formatSimpleDate(`${note.fecEmi}|${note.horEmi}`)}
              </span>
            </p>

            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              Numero control: <span className="font-semibold">{note.numeroControl}</span>
            </p>

            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              Código generación: <span className="font-semibold">{note.codigoGeneracion}</span>
            </p>

            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              Sucursal: <span className="font-semibold">{note.branch.name}</span>
            </p>

            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              Empleado:{' '}
              <span className="font-semibold">
                {EmployeeReceiving(note?.receivingEmployeeId ?? 0) ?? ''}
              </span>
            </p>

            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              Observaciones: <span className="font-semibold">{note.observaciones}</span>
            </p>

            <footer className="flex gap-3 mt-2">
              <Button
                isDisabled={false}
                isLoading={isLoading}
                style={{ backgroundColor: 'gray', color: 'white' }}
              >
                Completado
              </Button>

              <Button style={globalStyles.dangerStyles} onClick={onClose}>
                Cancelar
              </Button>
            </footer>
          </section>
        </HeadlessModal>
      ) : (
        <Modal isDismissable={false} isOpen={visibled.isOpen} size="full"
          onClose={visibled.onClose}
        >
          <ModalContent>
            <ModalHeader>Completar nota de remision</ModalHeader>
            <ModalBody>
              <div className='flex grid-cols-2 gap-4'>
                <Select
                  classNames={{ label: 'text-sm font-semibold dark:text-white' }}
                  label="Complemento nota de remisión"
                  labelPlacement="outside"
                  placeholder="Selecciona una opcion"
                  value={motivoComplet}
                  variant="bordered"
                  onChange={(e) => setMotivoComplet(e.target.value)}
                >
                  {Motivos_Complet.map((e) => (
                    <SelectItem key={e.label}>{e.label}</SelectItem>
                  ))}
                </Select>

                <Input
                  classNames={{
                    label: 'font-semibold text-gray-500 text-sm',
                    input: 'dark:text-white',
                    base: 'font-semibold'
                  }}
                  label="Código de empleado"
                  labelPlacement="outside"
                  placeholder="Ingrese el código de empleado"
                  type="text"
                  value={employeeCode}
                  variant="bordered"
                  onChange={(e) => setEmployeeCode(e.target.value)}
                />
              </div>
              <p className="text-md font-bold text-slate-600 dark:text-slate-400">
                Cantidad de productos
              </p>

              <div className="max-h-[420px] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {editableDetails.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 border border-emerald-300 shadow-sm hover:shadow-md transition-all rounded-xl p-4 flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-base font-semibold text-emerald-600 truncate max-w-full">
                          {item.branchProduct.product.name} - {item?.branchProduct?.product?.code ?? 'N/A'}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Máx: {item.cantidadItem}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <Input
                          className="w-28"
                          classNames={{
                            label: 'font-semibold text-sm text-gray-600 dark:text-gray-300',
                            input: 'dark:text-white',
                            base: 'font-semibold',
                          }}
                          label="Cantidad"
                          labelPlacement="outside"
                          max={item.cantidadItem}
                          min={0}
                          type="number"
                          value={item.cantidadItemEditada.toString()}
                          variant="bordered"
                          onChange={(e) => {
                            const value = Number(e.target.value);

                            if (value > item.cantidadItem) {
                              toast.warning('No puedes ingresar más de la cantidad asignada');

                              return;
                            }

                            const newDetails = [...editableDetails];

                            newDetails[index].cantidadItemEditada = value;
                            setEditableDetails(newDetails);
                          }}
                        />
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                          {item.cantidadItemEditada === 0
                            ? 'Sin productos'
                            : item.cantidadItemEditada === item.cantidadItem
                              ? 'Completo'
                              : 'Editado'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg"
                isDisabled={isLoading}
                isLoading={isLoading}
                onClick={() => handleCompleteNote()}
              >
                Completar Nota
              </Button>
            </ModalFooter>
          </ModalContent>{' '}
        </Modal>
      )}
    </>
  )
}
