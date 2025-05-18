import { useEffect, useState } from 'react'
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  UseDisclosureProps
} from '@heroui/react'
import { toast } from 'sonner'


import HeadlessModal from '../global/HeadlessModal'
import useGlobalStyles from '../global/global.styles'

import { ReferalNote } from '@/types/referal-note.types'
import { useReferalNote } from '@/store/referal-notes'
import { useAuthStore } from '@/store/auth.store'
import { get_employee_by_code } from '@/services/employess.service'
import { formatSimpleDate, getElSalvadorDateTime } from '@/utils/dates'
import { useEmployeeStore } from '@/store/employee.store'

interface Props {
  visibled: UseDisclosureProps
  note: ReferalNote
  onClose: () => void
  reload: () => void
}

export const CompleteNoteModal = ({ visibled, note, onClose, reload }: Props) => {
  const globalStyles = useGlobalStyles()
  const { completeReferalNote } = useReferalNote()
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuthStore()
  const [employeeCode, setEmployeeCode] = useState('')
  const [description, setDescription] = useState('')
  const { getEmployeesByBranch, employee_list } = useEmployeeStore()

  useEffect(() => {
    if (note?.isCompleted) {
      getEmployeesByBranch(user?.branchId ?? 0)
    }
  }, [note?.isCompleted, user?.branchId])

  const handleCompleteNote = async () => {
    try {
      setIsLoading(true)

      if (!employeeCode) {
        setIsLoading(false)

        return toast('Ingresa el codigo de empleado')
      }
      if (!description) {
        setIsLoading(false)

        return toast('Ingresa la descripción')
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
              descriptionCompleted: `${employeeCode ?? 'N/A'}-${fullName}-${description ?? 'N/A'}-${getElSalvadorDateTime().fecEmi}-${getElSalvadorDateTime().horEmi}`
            }

            completeReferalNote(note.id, payload).then(() => {
              setIsLoading(false)
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
        <Modal isDismissable={false} isOpen={visibled.isOpen} onClose={visibled.onClose}>
          <ModalContent>
            <ModalHeader className='dark:text-white'>Completar nota de remision</ModalHeader>
            <ModalBody>

              <Input
                classNames={{
                  label: 'font-semibold text-gray-500 text-sm',
                  input: 'dark:text-white',
                  base: 'font-semibold'
                }}
                label="Descripción para completar nota de remision"
                labelPlacement="outside"
                placeholder="Ingrese el motivo por la cual completa la nota"
                type="text"
                value={description}
                variant="bordered"
                onChange={(e) => setDescription(e.target.value)}
              />

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
            </ModalBody>
            <ModalFooter>

              <Button
                isDisabled={isLoading}
                isLoading={isLoading}
                style={globalStyles.secondaryStyle}
                onClick={() => handleCompleteNote()}
              >
                Completar
              </Button>
            </ModalFooter>
          </ModalContent>{' '}
        </Modal>
      )}
    </>
  )
}
