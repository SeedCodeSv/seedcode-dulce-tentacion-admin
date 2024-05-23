import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@nextui-org/react";
import {
  Customer,
  Sale,
  ValidateContigence,
} from "../../types/report_contigence";
import { useContext, useEffect, useState } from "react";
import { useLogsStore } from "../../store/logs.store";
import { ThemeContext } from "../../hooks/useTheme";
import { Municipio } from "../../types/billing/cat-013-municipio.types";
// import { useBillingStore } from "../../store/facturation/billing.store";
import { Departamento } from "../../types/billing/cat-012-departamento.types";
import { CodigoActividadEconomica } from "../../types/billing/cat-019-codigo-de-actividad-economica.types";
// import { useProductsStore } from "../../store/products.store";
import { SeedcodeCatalogosMhService } from "seedcode-catalogos-mh";
import { Formik } from "formik";
import * as yup from "yup";
import { IUnitOfMeasurement } from "../../types/billing/cat-014-tipos-de-medida.types";
import { TipoDeItem } from "../../types/billing/cat-011-tipo-de-item.types";
import { ITipoDocumento } from "../../types/DTE/tipo_documento.types";
interface Props {
  onClose: () => void;
  codigoGeneracion: string;
  customer?: Customer;
  handleSendToContingencia: (sale: Sale, salesCustomer: Sale) => void;
  selectedSale?: Sale;
}
const UpdateCustomerSales = (props: Props) => {
  const { theme } = useContext(ThemeContext);
  const { logs, getLogs } = useLogsStore();
  const [selectedCodeDep, setSelectedCodeDep] = useState("0");
  const [selectedMunicipio, setSeletedMunicipio] = useState<Municipio>();
  const [selectedDep, setSeletedDep] = useState<Departamento>();
  const [codActividad, setCodActividad] = useState<CodigoActividadEconomica>();
  const [tipoDocument, setTipoDocument] = useState<ITipoDocumento>();
  //-------------------------------------------------------------------
  const [selectedTipeItem, setSelectedTipeItem] = useState<TipoDeItem>();
  const [selectedUnidadMedi, setSelectedUnidadMedi] =
    useState<IUnitOfMeasurement>();
  // en progreso
  //-------------------------------------------------------------------
  const validationSchema = yup.object().shape({
    nombre: yup.string().required("**El nombre es requerido**"),
    nombreComercial: yup.string().required("El campo es requerida"),
    nrc: yup.string().required("El nrc es requerido"),
    nit: yup.string().required("El nit es requerido"),
    nombreDepartamento: yup
      .string()
      .required("Debes seleccionar el departamento"),
    nombreMunicipio: yup.string().required("Debes seleccionar el municipio"),
    descActividad: yup.string().required("La actividad es requerida"),
    numDocumento: yup.string().required("El numero documento es requerido"),
    tipoItem: yup.string().required("El tipo item es requerido"),
    uniMedida: yup.string().required("La unidad de medida es requerida"),
    tipoDocument: yup.string().required("El tipo de documento es requerido"),
  });
  const initialValues = {
    nombre: props.selectedSale?.customer?.nombre ?? "",
    nombreComercial: props.selectedSale?.customer.nombreComercial ?? "N/A",
    nrc: props.selectedSale?.customer.nrc ?? null,
    nit: props.selectedSale?.customer.nit ?? null,
    nombreDepartamento:
      props.selectedSale?.customer.direccion.nombreDepartamento ?? "N/A",
    nombreMunicipio:
      props.selectedSale?.customer.direccion.nombreMunicipio ?? "N/A",
    descActividad: props.selectedSale?.customer.descActividad ?? "N/A",
    numDocumento: props.selectedSale?.customer.numDocumento ?? "N/A",
    tipoDocument: props.selectedSale?.customer.tipoDocumento ?? "N/A",
    tipoItem: 1,
    uniMedida: 26,
  };
  useEffect(() => {
    if (props.codigoGeneracion) {
      getLogs(props.codigoGeneracion);
    }
  }, [props.customer]);

  const cat_012_departamento =
    new SeedcodeCatalogosMhService().get012Departamento();
  const cat_013_municipios = new SeedcodeCatalogosMhService().get013Municipio(
    selectedCodeDep
  );
  const cat_019_codigo_de_actividad_economica =
    new SeedcodeCatalogosMhService().get019CodigoDeActividaEcono();
  const cay_002_tipo_de_documento =
    new SeedcodeCatalogosMhService().get022TipoDeDocumentoDeIde();
  const cat_011_tipo_de_item =
    new SeedcodeCatalogosMhService().get011TipoDeItem();
  const unidadDeMedidaList =
    new SeedcodeCatalogosMhService().get014UnidadDeMedida();
  const object = cay_002_tipo_de_documento.find(
    (obj) => obj.codigo === props.customer?.tipoDocumento
  );
  const handleSave = (values: ValidateContigence) => {
    const sale: Sale = {
      ...props!.selectedSale!,
      customer: {
        ...props.selectedSale?.customer!,
        nombre: values.nombre,
        nombreComercial: values.nombreComercial,
        nrc: String(values.nrc),
        nit: String(values.nit),
        numDocumento: values.numDocumento,
        codActividad: String(
          codActividad?.codigo
            ? codActividad.codigo
            : props.selectedSale?.customer.codActividad
        ),
        descActividad: String(
          codActividad?.valores
            ? codActividad.valores
            : props.selectedSale?.customer.descActividad
        ),
        tipoDocumento: tipoDocument?.codigo
          ? tipoDocument.codigo
          : String(props.selectedSale?.customer.tipoDocumento),
        direccion: {
          id: Number(props.selectedSale?.customer.direccion.id),
          departamento: String(
            selectedDep?.codigo
              ? selectedDep.codigo
              : props.selectedSale?.customer.direccion.departamento
          ),
          nombreDepartamento: String(
            selectedDep?.valores
              ? selectedDep.valores
              : props.selectedSale?.customer.direccion.nombreDepartamento
          ),
          municipio: String(
            selectedMunicipio?.codigo
              ? selectedMunicipio?.codigo
              : props.selectedSale?.customer.direccion.municipio
          ),
          nombreMunicipio: String(
            selectedMunicipio?.codigo
              ? selectedMunicipio?.codigo
              : props.selectedSale?.customer.direccion.nombreMunicipio
          ),
          complemento: String(
            props.selectedSale?.customer.direccion.complemento
          ),
          active: Boolean(props.selectedSale?.customer.direccion.active),
        },
      },
      //---------------------------------------
      tipoItem: Number(selectedTipeItem?.codigo ? selectedTipeItem.codigo : 1),
      uniMedida: Number(
        selectedUnidadMedi?.codigo ? selectedUnidadMedi.codigo : 26
      ),
      //faltan algunos cambios
      //---------------------------------------
    };
    // console.log("sales", sale)
    props.handleSendToContingencia(sale, sale);
    props.onClose();
  };
  return (
    <>
      <div>
        {logs.map((log) => (
          <p> {log.message}</p>
        ))}
      </div>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSave}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleSubmit,
          handleChange,
        }) => (
          <>
            <div className="grid grid-cols-2 gap-3 p-3  ">
              <div className="mt-5">
                <Input
                  label="Nombre de cliente"
                  labelPlacement="outside"
                  
                  onChange={handleChange("nombre")}
                  onBlur={handleBlur("nombre")}
                  defaultValue={props.selectedSale?.customer.nombre}
                  value={values.nombre}
                  placeholder="Ingresa el nombre de cliente"
                  classNames={{
                    label: "text-gray-500 text-base",
                  }}
                  variant="bordered"
                />
                {errors.nombre && touched.nombre && (
                  <span className="text-sm font-semibold text-red-500">
                    {errors.nombre}
                  </span>
                )}
              </div>
              <div className="mt-5">
                <Input
                  label="Nombre Comercial"
                  labelPlacement="outside"
                  
                  onChange={handleChange("nombreComercial")}
                  onBlur={handleBlur("nombreComercial")}
                  defaultValue={props.customer?.nombreComercial}
                  placeholder="Ingresa el nombre comercial"
                  type="text"
                  value={values.nombreComercial}
                  classNames={{
                    label: "text-gray-500 text-base",
                  }}
                  variant="bordered"
                />
                {errors.nombreComercial && touched.nombreComercial && (
                  <span className="text-sm font-semibold text-red-500">
                    {errors.nombreComercial}
                  </span>
                )}
              </div>
              {props.selectedSale?.tipoDte === "03" && (
                <>
                  <div className="pt-2">
                    <Input
                      label="Nit"
                      defaultValue={props.selectedSale.customer.nit}
                      labelPlacement="outside"
                      
                      placeholder="Ingresa el numero de nit"
                      type="text"
                      classNames={{
                        label: "text-gray-500 text-base",
                      }}
                      onChange={handleChange("nit")}
                      onBlur={handleBlur("nit")}
                      variant="bordered"
                    />
                    {errors.nit && touched.nit && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.nit}
                      </span>
                    )}
                  </div>
                  <div className="pt-2">
                    <Input
                      label="Nrc"
                      defaultValue={props.selectedSale.customer.nrc}
                      labelPlacement="outside"
                      
                      placeholder="Ingresa el numero de nrc"
                      type="text"
                      classNames={{
                        label: "text-gray-500 text-base",
                      }}
                      onChange={handleChange("nrc")}
                      onBlur={handleBlur("nrc")}
                      variant="bordered"
                    />
                    {errors.nrc && touched.nrc && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.nrc}
                      </span>
                    )}
                  </div>
                </>
              )}
              <div className="pt-2">
                <Autocomplete
                  onSelectionChange={(key) => {
                    if (key) {
                      const depSelected = JSON.parse(
                        key as string
                      ) as CodigoActividadEconomica;
                      setCodActividad(depSelected);
                    }
                  }}
                  onBlur={handleBlur("Actividad")}
                  label="Actividad"
                  labelPlacement="outside"
                  placeholder={
                    props.customer?.descActividad
                      ? props.customer?.descActividad
                      : "Selecciona la actividad"
                  }
                  value={values.descActividad}
                  variant="bordered"
                  classNames={{
                    base: "font-semibold text-gray-500 text-sm",
                  }}
                  
                >
                  {cat_019_codigo_de_actividad_economica.map((dep) => (
                    <AutocompleteItem
                      value={dep.codigo}
                      key={JSON.stringify(dep)}
                    >
                      {dep.valores}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                {errors.descActividad && touched.descActividad && (
                  <span className="text-sm font-semibold text-red-500">
                    {errors.descActividad}
                  </span>
                )}
              </div>
              {props.selectedSale?.tipoDte === "01" && (
                <>
                  <div className="pt-2">
                    <Autocomplete
                      onSelectionChange={(key) => {
                        if (key) {
                          const depSelected = JSON.parse(
                            key as string
                          ) as ITipoDocumento;
                          setTipoDocument(depSelected);
                        }
                      }}
                      onBlur={handleBlur("tipoDocument")}
                      label="Tipo documento"
                      labelPlacement="outside"
                      placeholder={
                        object?.valores
                          ? object?.valores
                          : "Selecciona el tipo documento"
                      }
                      value={values.tipoDocument}
                      variant="bordered"
                      classNames={{
                        base: "font-semibold text-gray-500 text-sm",
                      }}
                      
                    >
                      {cay_002_tipo_de_documento.map((dep) => (
                        <AutocompleteItem
                          value={dep.codigo}
                          key={JSON.stringify(dep)}
                        >
                          {dep.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                    {errors.tipoDocument && touched.tipoDocument && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.tipoDocument}
                      </span>
                    )}
                  </div>

                  <div className="pt-2">
                    <Input
                      label="Numero de documento"
                      defaultValue={props.customer?.numDocumento}
                      onChange={handleChange("numDocumento")}
                      onBlur={handleBlur("numDocumento")}
                      value={values.numDocumento}
                      labelPlacement="outside"
                      
                      placeholder="Ingresa el numero de documento"
                      type="text"
                      classNames={{
                        label: "text-gray-500 text-base",
                      }}
                      variant="bordered"
                    />
                    {errors.numDocumento && touched.numDocumento && (
                      <span className="text-sm font-semibold text-red-500">
                        {errors.numDocumento}
                      </span>
                    )}
                  </div>
                </>
              )}
              <div className="pt-2">
                <div>
                  <Autocomplete
                    onSelectionChange={(key) => {
                      if (key) {
                        const depSelected = JSON.parse(
                          key as string
                        ) as Departamento;
                        setSelectedCodeDep(depSelected.codigo);
                        setSeletedDep(depSelected);
                      }
                    }}
                    onChange={handleChange("nombreDepartamento")}
                    onBlur={handleBlur("nombreDepartamento")}
                    label="Departamento"
                    labelPlacement="outside"
                    placeholder={
                      props.customer?.direccion.nombreDepartamento
                        ? props.customer?.direccion.nombreDepartamento
                        : "Selecciona el departamento"
                    }
                    variant="bordered"
                    classNames={{
                      base: "font-semibold text-gray-500 text-sm",
                    }}
                    value={values.nombreDepartamento}
                    
                  >
                    {cat_012_departamento.map((dep) => (
                      <AutocompleteItem
                        value={dep.codigo}
                        key={JSON.stringify(dep)}
                      >
                        {dep.valores}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  {errors.nombreDepartamento && touched.nombreDepartamento && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.nombreDepartamento}
                    </span>
                  )}
                </div>
              </div>
              <div className="pt-2">
                {selectedCodeDep ? (
                  <div>
                    <Autocomplete
                      onSelectionChange={(key) => {
                        if (key) {
                          const depSelected = JSON.parse(
                            key as string
                          ) as Municipio;
                          setSeletedMunicipio(depSelected);
                        }
                      }}
                      label="Municipio"
                      labelPlacement="outside"
                      placeholder={
                        props.customer?.direccion.nombreMunicipio
                          ? props.customer?.direccion.nombreMunicipio
                          : "Selecciona el municipio"
                      }
                      onChange={handleChange("nombreMunicipio")}
                      onBlur={handleBlur("nombreMunicipio")}
                      variant="bordered"
                      classNames={{
                        base: "font-semibold text-gray-500 text-sm",
                      }}
                      
                      value={values.nombreMunicipio}
                    >
                      {cat_013_municipios!.map((dep) => (
                        <AutocompleteItem
                          value={dep.codigo}
                          key={JSON.stringify(dep)}
                        >
                          {dep.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                    {errors.nombreDepartamento &&
                      touched.nombreDepartamento && (
                        <span className="text-sm font-semibold text-red-500">
                          {errors.nombreDepartamento}
                        </span>
                      )}
                  </div>
                ) : (
                  <div className="pt-2">
                    <Autocomplete
                      isDisabled
                      onSelectionChange={(key) => {
                        if (key) {
                          const depSelected = JSON.parse(
                            key as string
                          ) as Municipio;
                          setSeletedMunicipio(depSelected);
                        }
                      }}
                      label="Municipio"
                      labelPlacement="outside"
                      placeholder={
                        props.customer?.direccion.nombreMunicipio
                          ? props.customer?.direccion.nombreMunicipio
                          : "Selecciona el municipio"
                      }
                      variant="bordered"
                      classNames={{
                        base: "font-semibold text-gray-500 text-sm",
                      }}
                      
                      value={values.nombreMunicipio}
                    >
                      {cat_013_municipios!.map((dep) => (
                        <AutocompleteItem
                          value={dep.codigo}
                          key={JSON.stringify(dep)}
                        >
                          {dep.valores}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </div>
                )}
              </div>
            </div>
            <div className="text-grey-500 font-semibold">Producto</div>
            <div className="grid grid-cols-2 gap-3 p-3  border  ">
              <div className="mt-2">
                <Autocomplete
                  onSelectionChange={(key) => {
                    if (key) {
                      const depSelected = JSON.parse(
                        key as string
                      ) as TipoDeItem;
                      setSelectedTipeItem(depSelected);
                    }
                  }}
                  onChange={handleChange("tipoItem")}
                  onBlur={handleBlur("tipoItem")}
                  variant="bordered"
                  label="Tipo de item"
                  labelPlacement="outside"
                  placeholder={"Bienes"}
                  
                  value={values.tipoItem}
                >
                  {cat_011_tipo_de_item.map((item) => (
                    <AutocompleteItem
                      key={JSON.stringify(item)}
                      value={item.codigo}
                    >
                      {item.valores}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                {errors.tipoItem && touched.tipoItem && (
                  <span className="text-sm font-semibold text-red-500">
                    {errors.tipoItem}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <Autocomplete
                  onSelectionChange={(key) => {
                    if (key) {
                      const depSelected = JSON.parse(
                        key as string
                      ) as IUnitOfMeasurement;
                      setSelectedUnidadMedi(depSelected);
                    }
                  }}
                  onChange={handleChange("uniMedida")}
                  onBlur={handleBlur("uniMedida")}
                  variant="bordered"
                  name="unidaDeMedida"
                  label="Unidad de medida"
                  labelPlacement="outside"
                  placeholder={"Mililitro"}
                  
                  value={values.uniMedida}
                >
                  {unidadDeMedidaList.map((item) => (
                    <AutocompleteItem
                      key={JSON.stringify(item)}
                      value={item.valores}
                    >
                      {item.valores}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                {errors.uniMedida && touched.uniMedida && (
                  <span className="text-sm font-semibold text-red-500">
                    {errors.uniMedida}
                  </span>
                )}
              </div>
            </div>
            <Button
              
              onClick={() => handleSubmit()}
              className="w-full mt-4 text-sm font-semibold"
              style={{
                backgroundColor: theme.colors.third,
                color: theme.colors.primary,
              }}
            >
              Guardar
            </Button>
          </>
        )}
      </Formik>
    </>
  );
};
export default UpdateCustomerSales;
