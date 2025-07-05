import { Autocomplete, AutocompleteItem, Button, Checkbox, Input } from '@heroui/react';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useFormik } from 'formik';

import { useBranchesStore } from '../../store/branches.store';
import { useChargesStore } from '../../store/charges.store';
import { useBillingStore } from '../../store/facturation/billing.store';
import { useEmployeeStatusStore } from '../../store/employee_status.store';
import { useContractTypeStore } from '../../store/contract_type.store';
import { useStudyLevelStore } from '../../store/study_level.store';
import { useEmployeeStore } from '../../store/employee.store';


import { validationEmployeeSchema } from './validation-employee';

import { PropsUpdateEmployee } from '@/types/sub_categories.types';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import DivGlobal from '@/themes/ui/div-global';
import { preventLetters } from '@/utils';


function UpdateEmployee(props: PropsUpdateEmployee) {
  const { GetEmployeeStatus, employee_status } = useEmployeeStatusStore();
  const { GetContractType, contract_type } = useContractTypeStore();
  const { GetStudyLevel, study_level } = useStudyLevelStore();
  const { getBranchesList, branch_list } = useBranchesStore();
  const { getChargesList, charges } = useChargesStore();
  const { getCat012Departamento, getCat013Municipios, cat_012_departamento, cat_013_municipios } =
    useBillingStore();
  const [codeDepartamento, setCodeDepartamento] = useState(props.data?.address?.departamento ?? '');
  const [isCutResponsible, setIsCutResponsible] = useState(false);

  useEffect(() => {
    if (props.data?.isResponsibleCutZ !== undefined) {
      setIsCutResponsible(props.data.isResponsibleCutZ);
    }
  }, [props.data]);

  useEffect(() => {
    getBranchesList();
    getChargesList();
    getCat012Departamento();
    GetEmployeeStatus();
    GetContractType();
    GetStudyLevel();
  }, [codeDepartamento]);
  useEffect(() => {
    if (codeDepartamento !== '0') {
      getCat013Municipios(props.data?.department ?? codeDepartamento);
    }
    getCat013Municipios(codeDepartamento);
  }, [codeDepartamento, props.data?.address?.departamento]);
  const { patchEmployee, verifyCode } = useEmployeeStore();

  const formik = useFormik({
    initialValues: {
      firstName: props.data?.firstName || '',
      secondName: props.data?.secondName || '',
      firstLastName: props.data?.firstLastName || '',
      secondLastName: props.data?.secondLastName || '',
      bankAccount: props.data?.bankAccount || '',
      chargeId: props.data?.chargeId || 0,
      nit: props.data?.nit || '',
      dui: props.data?.dui || '',
      isss: props.data?.isss || '',
      afp: props.data?.afp || '',
      code: props.data?.code || '',
      phone: props.data?.phone || '',
      age: props.data?.age || '',
      salary: props.data?.salary || '',
      dateOfBirth: props.data?.dateOfBirth || '',
      dateOfEntry: props.data?.dateOfEntry || '',
      dateOfExit: props.data?.dateOfExit || '',
      responsibleContact: props.data?.responsibleContact || '',
      statusId: props.data?.employeeStatusId || 0,
      studyLevelId: props.data?.studyLevelId || 0,
      contractTypeId: props.data?.contractTypeId || 0,
      department: props.data?.address?.departamento || '',
      departmentName: props.data?.address?.nombreDepartamento || '',
      municipality: props.data?.address?.municipio || '',
      municipalityName: props.data?.address?.nombreMunicipio || '',
      complement: props.data?.address?.complemento || '',
      branchId: props.data?.branchId || 0,
      isResponsibleCutZ: props.data?.isResponsibleCutZ || false
    },
    validationSchema: validationEmployeeSchema,
    onSubmit: async (values, formikHelpers) => {
      const sameCode = values.code === props.data?.code
      const verify = await verifyCode(values.code);

      if (!sameCode && !verify) {
        toast.error('Error al verificar o código no disponible');
        formikHelpers.setSubmitting(false);

        return
      }
      const payload = {
        ...values,
        isResponsibleCutZ: isCutResponsible
      }

      patchEmployee(payload, props.data?.id ?? 0)
        .then((res) => {
          if (res) {
            props.id(0);
          }
          formikHelpers.setSubmitting(false);
        })
        .catch(() => {
          formik.setSubmitting(false);
          toast.error('Error al guardar el producto');
        });
    },
  });

  const generateCode = async () => {
    const name = formik.values.firstName;
    const lastName = formik.values.firstLastName;

    if (!name || !lastName) {
      toast.error('Nombre y apellido son requeridos para generar el código');

      return;
    }

    const firstNamePart = name.slice(0, 2).toUpperCase();
    const lastNamePart = lastName.slice(0, 2).toUpperCase();

    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    const generatedCode = `${firstNamePart}${lastNamePart}${randomNumber}`;

    const verify = await verifyCode(generatedCode);

    if (verify) {
      toast.success('Código disponible');
      formik.setFieldValue('code', generatedCode);
    } else {
      toast.error('Error al verificar o código no disponible');
    }
  };


  return (
    <DivGlobal>
      <div>
        <div className='w-full flex justify-between'>
          <Button className="bg-transparent dark:text-white" onPress={() => props.id(0)}>
            <ArrowLeft className="dark:text-white" />
            Atras
          </Button>
          {/* <div className='flex flex-row justify-start'>
          <Checkbox
            checked={isCutResponsible}
            isSelected={isCutResponsible}
            onValueChange={() => {
              setIsCutResponsible(prev => !prev)
            }}
          />
          <p className='dark:text-white'>Responsable de corte Z</p>
        </div> */}
          <button
            className='flex flex-row justify-start mr-6 border border-sky-200 rounded-xl p-2'>
            <Checkbox
              checked={isCutResponsible}
              isSelected={isCutResponsible}
              onValueChange={() => {
                setIsCutResponsible(prev => !prev)
              }}
              color={'warning'}
              // checked={isCutResponsible}
              size='md'
            // onChange={() => setIsCutResponsible(!isCutResponsible)}
            />
            <p className='dark:text-white mt-1 text-sky-500'>Responsable de corte Z</p>
          </button>
        </div>
        <div className="overflow-y-auto dark:text-white">
          <div className="w-full h-full p-5 overflow-y-auto custom-scrollbar1 bg-white rounded-xl dark:bg-transparent">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit(e);
              }}
            >
              <>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col mt-3">
                    <Input
                      autoComplete="off"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      label="Primer Nombre"
                      labelPlacement="outside"
                      placeholder="Ingresa el primer nombre"
                      variant="bordered"
                      {...formik.getFieldProps('firstName')}
                      errorMessage={formik.errors.firstName}
                      isInvalid={!!formik.errors.firstName && !!formik.touched.firstName}
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      autoComplete="off"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      label="Segundo Nombre"
                      labelPlacement="outside"
                      placeholder="Ingresa el segundo nombre"
                      variant="bordered"
                      {...formik.getFieldProps('secondName')}
                      errorMessage={formik.errors.secondName}
                      isInvalid={!!formik.errors.secondName && !!formik.touched.secondName}
                    />
                  </div>
                  <div className="mt-3">
                    <Input
                      autoComplete="off"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      label="Primer Apellido"
                      labelPlacement="outside"
                      placeholder="Ingresa el primer apellido"
                      variant="bordered"
                      {...formik.getFieldProps('firstLastName')}
                      errorMessage={formik.errors.firstLastName}
                      isInvalid={!!formik.errors.firstLastName && !!formik.touched.firstLastName}
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      autoComplete="off"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      label="Segundo Apellido"
                      labelPlacement="outside"
                      placeholder="Ingresa el segundo apellido"
                      variant="bordered"
                      {...formik.getFieldProps('secondLastName')}
                      errorMessage={formik.errors.secondLastName}
                      isInvalid={!!formik.errors.secondLastName && !!formik.touched.secondLastName}
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      autoComplete="off"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      defaultValue={props.data?.bankAccount}
                      label="Numero de cuenta bancaria"
                      labelPlacement="outside"
                      placeholder="Ingresa el numero de cuenta"
                      variant="bordered"
                      {...formik.getFieldProps('bankAccount')}
                      errorMessage={formik.errors.bankAccount}
                      isInvalid={!!formik.errors.bankAccount && !!formik.touched.bankAccount}
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      autoComplete="off"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      defaultValue={props.data?.dui}
                      label="DUI"
                      labelPlacement="outside"

                      placeholder="Ingresa el numero de DUI"
                      variant="bordered"
                      {...formik.getFieldProps('dui')}
                      errorMessage={formik.errors.dui}
                      isInvalid={!!formik.errors.dui && !!formik.touched.dui}
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      autoComplete="off"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      defaultValue={props.data?.nit}
                      label="NIT"
                      labelPlacement="outside"
                      placeholder="Ingresa el numero de NIT"
                      variant="bordered"
                      {...formik.getFieldProps('nit')}
                      errorMessage={formik.errors.nit}
                      isInvalid={!!formik.errors.nit && !!formik.touched.nit}
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      defaultValue={props.data?.isss}
                      label="ISSS"
                      labelPlacement="outside"

                      placeholder="Ingresa el numero de ISSS"
                      variant="bordered"
                      {...formik.getFieldProps('isss')}
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      defaultValue={props.data?.afp}
                      label="AFP"
                      labelPlacement="outside"
                      placeholder="Ingresa el numero de AFP"
                      variant="bordered"
                      {...formik.getFieldProps('afp')}
                      errorMessage={formik.errors.afp}
                      isInvalid={!!formik.errors.afp && !!formik.touched.afp}
                    />
                  </div>
                  <div className="flex flex-row gap-3 mt-3 w-full">
                    <Input
                      className=""
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      label="Codigo"
                      labelPlacement="outside"
                      placeholder="Ingresa el codigo"
                      variant="bordered"
                      {...formik.getFieldProps('code')}
                      errorMessage={formik.errors.code}
                      isInvalid={!!formik.errors.code && !!formik.touched.code}
                    />
                    <ButtonUi
                      className="mt-6 text-sm"
                      theme={Colors.Info}
                      onPress={() => {
                        generateCode();
                      }}
                    >
                      Generar
                    </ButtonUi>
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      autoComplete="off"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      label="Teléfono"
                      labelPlacement="outside"
                      placeholder="Ingresa el numero de teléfono"
                      variant="bordered"
                      onKeyDown={preventLetters}
                      {...formik.getFieldProps('phone')}
                      errorMessage={formik.errors.phone}
                      isInvalid={!!formik.errors.phone && !!formik.touched.phone}
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      autoComplete="off"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      defaultValue={props.data?.age}
                      label="Edad"
                      labelPlacement="outside"
                      placeholder="Ingresa la edad"
                      type="number"
                      variant="bordered"
                      {...formik.getFieldProps('age')}
                      errorMessage={formik.errors.age}
                      isInvalid={!!formik.errors.age && !!formik.touched.age}
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      autoComplete="off"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      defaultValue={props.data?.salary}
                      label="Salario Mensual"
                      labelPlacement="outside"
                      placeholder="Ingresa el salario mensual"
                      type="number"
                      variant="bordered"
                      {...formik.getFieldProps('salary')}
                      errorMessage={formik.errors.salary}
                      isInvalid={!!formik.errors.salary && !!formik.touched.salary}
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      autoComplete="off"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      defaultValue={props.data?.dateOfBirth}
                      label="Fecha de Nacimiento"
                      labelPlacement="outside"
                      type="date"
                      variant="bordered"
                      {...formik.getFieldProps('dateOfBirth')}
                      errorMessage={formik.errors.dateOfBirth}
                      isInvalid={!!formik.errors.dateOfBirth && !!formik.touched.dateOfBirth}
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      autoComplete="off"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      defaultValue={props.data?.dateOfEntry}
                      label="Fecha de Ingreso"
                      labelPlacement="outside"
                      type="date"
                      variant="bordered"
                      {...formik.getFieldProps('dateOfEntry')}
                      errorMessage={formik.errors.dateOfEntry}
                      isInvalid={!!formik.errors.dateOfEntry && !!formik.touched.dateOfEntry}
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      autoComplete="off"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      defaultValue={props.data?.dateOfExit}
                      label="Fecha de Salida"
                      labelPlacement="outside"

                      type="date"
                      variant="bordered"
                      {...formik.getFieldProps('dateOfExit')}
                    />
                  </div>
                  <div className="flex flex-col mt-3">
                    <Autocomplete
                      className="dark:text-white"
                      classNames={{
                        base: 'font-semibold text-sm',
                      }}
                      defaultSelectedKey={props.data?.studyLevelId.toString()} // El valor actual
                      errorMessage={formik.errors.studyLevelId}
                      isInvalid={!!formik.errors.studyLevelId && !!formik.touched.studyLevelId}
                      label="Nivel de Estudio"
                      labelPlacement="outside"
                      placeholder="Seleccione el nivel de estudio"
                      variant="bordered"
                      onBlur={() => formik.setFieldTouched('studyLevelId', true)}
                      onSelectionChange={(key) => formik.setFieldValue('studyLevelId', Number(key))}
                    >
                      {study_level?.map((item) => (
                        <AutocompleteItem key={item.id} className="dark:text-white">
                          {item.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>

                  </div>
                  <div className="flex flex-col mt-3">
                    <Autocomplete
                      className="dark:text-white"
                      classNames={{
                        base: 'font-semibold text-sm',
                      }}
                      defaultInputValue={props.data?.employeeStatus?.name ?? ''}
                      defaultSelectedKey={props.data?.employeeStatusId?.toString()}
                      errorMessage={formik.errors.statusId}
                      isInvalid={!!formik.errors.statusId && !!formik.touched.statusId}
                      label="Estado del Empleado"
                      labelPlacement="outside"
                      placeholder={'Seleccione el estado del empleado'}
                      variant="bordered"
                      onBlur={() => formik.setFieldTouched('statusId', true)}
                      onSelectionChange={(key) => formik.setFieldValue('statusId', Number(key))}
                    >
                      {employee_status?.map((item) => (
                        <AutocompleteItem
                          key={item.id.toString()}
                          className="dark:text-white"
                        >
                          {item.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>

                  </div>
                  <div className="flex flex-col mt-3">
                    <Autocomplete
                      className="dark:text-white"
                      classNames={{
                        base: 'font-semibold text-sm',
                      }}
                      defaultSelectedKey={props.data?.contractTypeId.toString()}
                      errorMessage={formik.errors.contractTypeId}
                      isInvalid={!!formik.errors.contractTypeId && !!formik.touched.contractTypeId}
                      label="Tipo de contratacion"
                      labelPlacement="outside"
                      placeholder={'Seleccione el tipo de contrato'}
                      variant="bordered"
                      onBlur={() => formik.setFieldTouched('contractTypeId', true)}
                      onSelectionChange={(key) => formik.setFieldValue('contractTypeId', Number(key))}
                    >
                      {contract_type.map((item) => (
                        <AutocompleteItem
                          key={item.id}
                          className="dark:text-white"
                        >
                          {item.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="flex flex-col mt-3">
                    <Input
                      autoComplete="off"
                      classNames={{ label: 'font-semibold text-sm  text-gray-600' }}
                      label="Contacto Responsable"
                      labelPlacement="outside"
                      placeholder="Ingresa el contacto responsable"
                      type="text"
                      variant="bordered"
                      {...formik.getFieldProps('responsibleContact')}
                      errorMessage={formik.errors.responsibleContact}
                      isInvalid={!!formik.errors.responsibleContact && !!formik.touched.responsibleContact}
                    />
                  </div>

                  <div className="flex flex-col mt-3">
                    <Autocomplete
                      className="dark:text-white"
                      classNames={{
                        base: 'font-semibold text-sm',
                      }}
                      defaultSelectedKey={props.data?.chargeId.toString()}
                      errorMessage={formik.errors.chargeId}
                      isInvalid={!!formik.errors.chargeId && !!formik.touched.chargeId}
                      label="Cargo"
                      labelPlacement="outside"
                      placeholder={'Seleccione un cargo'}
                      variant="bordered"
                      onBlur={() => formik.setFieldTouched('chargeId', true)}
                      onSelectionChange={(key) => formik.setFieldValue('chargeId', Number(key))}
                    >
                      {charges.map((item) => (
                        <AutocompleteItem
                          key={item.id}
                          className="dark:text-white"
                        >
                          {item.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="mt-3">
                    <Autocomplete
                      className="dark:text-white"
                      classNames={{
                        base: 'font-semibold text-sm',
                      }}
                      defaultSelectedKey={props.data?.branchId.toString()}
                      errorMessage={formik.errors.branchId}
                      isInvalid={!!formik.errors.branchId && !!formik.touched.branchId}
                      label="Sucursal"
                      labelPlacement="outside"
                      placeholder={'Selecciona la sucursal'}
                      variant="bordered"
                      onBlur={() => formik.setFieldTouched('branchId', true)}
                      onSelectionChange={(key) => formik.setFieldValue('branchId', Number(key))}
                    >
                      {branch_list.map((bra) => (
                        <AutocompleteItem
                          key={bra.id}
                          className="dark:text-white"
                        >
                          {bra.name}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="mt-3">
                    <Autocomplete
                      className="dark:text-white"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      defaultSelectedKey={props.data?.address?.departamento ?? undefined}
                      errorMessage={formik.errors.department}
                      isInvalid={!!formik.errors.department && !!formik.touched.department}
                      label="Departamento"
                      labelPlacement="outside"
                      placeholder='Selecciona el departamento'
                      variant="bordered"
                      onBlur={() => formik.setFieldTouched('department', true)}
                      onSelectionChange={(key) => {
                        const selected = cat_012_departamento.find(
                          (dep) => dep.codigo === key
                        );

                        if (selected) {
                          formik.setFieldValue('department', selected.codigo);
                          formik.setFieldValue('departmentName', selected.valores);
                          formik.setFieldTouched('department', true);
                          setCodeDepartamento(selected.codigo);
                        }
                      }}
                    >
                      {cat_012_departamento.map((dep) => (
                        <AutocompleteItem
                          key={dep.codigo}
                          className="dark:text-white"
                        >
                          {dep.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                  <div className="mt-3">
                    <Autocomplete
                      className="dark:text-white"
                      classNames={{
                        base: 'font-semibold text-gray-500 text-sm',
                      }}
                      defaultSelectedKey={props.data?.address?.municipio}
                      errorMessage={formik.errors.municipality}
                      isInvalid={!!formik.errors.municipality && !!formik.touched.municipality}
                      label="Municipio"
                      labelPlacement="outside"
                      placeholder='Seleccione el municipio'
                      variant="bordered"
                      onBlur={() => formik.setFieldTouched('department', true)}
                      onSelectionChange={(key) => {
                        const selected = cat_013_municipios.find(
                          (dep) => dep.codigo === key
                        );

                        if (selected) {
                          formik.setFieldValue('municipality', selected.codigo);
                          formik.setFieldValue('municipalityName', selected.valores);
                          formik.setFieldTouched('municipality', true);
                          setCodeDepartamento(selected.codigo);
                        }
                      }}
                    >
                      {cat_013_municipios.map((dep) => (
                        <AutocompleteItem
                          key={dep.codigo}
                          className="dark:text-white"
                        >
                          {dep.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                </div>

                {/* <span className="flex flex-col mt-4">-- Dirección --</span> */}
                <div className="grid xl:grid-cols-2 gap-4 mt-5">
                  <div>
                    <Input
                      classNames={{
                        label: 'font-semibold text-gray-500 text-sm',
                      }}
                      defaultValue={props.data?.address?.complemento ?? ''}
                      label="Complemento de dirección"
                      labelPlacement="outside"
                      placeholder="Ingresa el complemento de dirección"
                      variant="bordered"
                      {...formik.getFieldProps('complement')}
                      errorMessage={formik.errors.complement}
                      isInvalid={!!formik.errors.complement && !!formik.touched.complement}
                    />
                  </div>

                  <div className="mt-3 md:mt-3">

                    <ButtonUi
                      className="w-full mt-3 text-sm font-semibold"
                      theme={Colors.Primary}
                      type='submit'
                    >
                      Guardar
                    </ButtonUi>
                  </div>
                </div>
              </>
            </form>
          </div>
        </div>
      </div>
    </DivGlobal>
  );
}
export default UpdateEmployee;
