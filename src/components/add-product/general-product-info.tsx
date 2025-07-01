import {
  AutocompleteItem,
  Input,
  Select,
  SelectItem,
  Autocomplete,
  Switch,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Checkbox,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import { useFormikContext } from 'formik';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { SeedcodeCatalogosMhService } from 'seedcode-catalogos-mh';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import classNames from 'classnames';

import RecipeBookProduct from './recipe-book-product';

import { Product, ProductPayloadForm } from '@/types/products.types';
import { verify_code_product } from '@/services/products.service';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';
import { useCategoriesStore } from '@/store/categories.store';
import { useProductsStore } from '@/store/products.store';
import { preventLetters } from '@/utils';
import { typesProduct } from '@/utils/constants';
import { useSubCategoryStore } from '@/store/sub-category';

type ProductOrder = Product & {
  quantity: number;
  performanceQuantity: string;
  cost: number;
  MOP: number;
  CIF: number;
};

interface Props {
  selectedProducts: ProductOrder[];
  setSelectedProducts: Dispatch<SetStateAction<ProductOrder[]>>;
  performance: string;
  mop: number;
  cif: number;
  setPerformance: Dispatch<SetStateAction<string>>;
  setMop: Dispatch<SetStateAction<number>>;
  setCif: Dispatch<SetStateAction<number>>;
}

function GeneralProductInfo({
  selectedProducts,
  setSelectedProducts,
  performance,
  mop,
  cif,
  setPerformance,
  setMop,
  setCif,
}: Props) {
  const formik = useFormikContext<ProductPayloadForm>();

  const typeSearch = ['NOMBRE', 'CODIGO'];
  const [selectedTypeSearch, setSelectedTypeSearch] = useState<'NOMBRE' | 'CODIGO'>('NOMBRE');

  const [name, setName] = useState('');

  const modalAddProducts = useDisclosure();

  const { paginated_products, getPaginatedProducts } = useProductsStore();

  const [includeReceipt, setIncludeReceipt] = useState(false);

  const { list_categories } = useCategoriesStore();
  const { getSubcategories, subcategories } = useSubCategoryStore();

  const services = useMemo(() => new SeedcodeCatalogosMhService(), []);

  const [codigo, setCodigoGenerado] = useState('');

  const generarCodigo = async (name: string) => {
    if (!name) {
      toast.error('Necesitas ingresar el nombre del producto para generar el código.');

      return '';
    }

    const productNameInitials = name.slice(0, 4).toUpperCase();
    const makeid = (length: number) => {
      let result = '';
      const characters = '0123456789';
      const charactersLength = characters.length;
      let counter = 0;

      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }

      return result;
    };

    const randomNumber = makeid(4);
    const codigoGenerado = `${productNameInitials}${randomNumber}`;
    const verify = await verifyCode(codigoGenerado);

    if (verify) {
    } else {
      formik.setErrors({ ...formik.errors, code: '**El código ya existe' });
    }

    return codigoGenerado;
  };

  const verifyCode = async (codigo: string) => {
    try {
      if (codigo !== 'N/A') {
        const data = await verify_code_product(codigo);

        if (data.data.ok === true) {
          toast.success('Este código esta disponible');

          return true;
        }
        toast.error('Este código esta en uso');

        return data.data.ok;
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  const handleSearch = (page = 1) => {
    getPaginatedProducts(
      page,
      20,
      0,
      0,
      selectedTypeSearch === 'NOMBRE' ? name : '',
      selectedTypeSearch === 'CODIGO' ? name : '',
      1
    );
  };

  const handleAddSupplier = (prd: Product) => {
    const list_suppliers = [...selectedProducts];

    const checkIfExist = list_suppliers.findIndex((lsP) => lsP.id === prd.id);

    if (checkIfExist === -1) {
      const quantity = 1;
      const performanceQuantity = quantity / (Number(performance || 1) || 1);

      list_suppliers.push({
        ...prd,
        performanceQuantity: performanceQuantity.toFixed(4),
        cost: 0,
        quantity: quantity,
        MOP: 0,
        CIF: 0,
      });
    } else {
      list_suppliers.splice(checkIfExist, 1);
    }

    setSelectedProducts(list_suppliers);
  };

  const checkIsSelectedSupplier = (id: number) => {
    return selectedProducts.some((ssp) => ssp.id === id);
  };

  return (
    <div className="w-full border shadow rounded-[12px] p-5 mt-3">
      <p className="text-sm font-semibold">Información general del producto</p>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-5 mt-3">
        <Input
          isRequired
          classNames={{ label: 'font-semibold' }}
          label="Nombre"
          labelPlacement="outside"
          placeholder="Ingresa el nombre del producto"
          variant="bordered"
          {...formik.getFieldProps('name')}
          errorMessage={formik.errors.name}
          isInvalid={!!formik.errors.name && !!formik.touched.name}
        />
        <Select
          isRequired
          classNames={{ label: 'font-semibold' }}
          label="Tipo de item"
          labelPlacement="outside"
          placeholder="Selecciona el tipo de producto"
          selectedKeys={[formik.values.tipoItem]}
          variant="bordered"
          onSelectionChange={(key) => {
            if (key) {
              const type = services.get011TipoDeItem().find((ttp) => ttp.codigo === key.currentKey);

              formik.setFieldValue('tipoDeItem', type?.valores ?? '');
              formik.setFieldValue('tipoItem', type?.codigo ?? '');

              return;
            }
            formik.setFieldValue('tipoDeItem', '');
            formik.setFieldValue('tipoItem', '');
          }}
        >
          {services.get011TipoDeItem().map((type) => (
            <SelectItem key={type.codigo}>{type.valores}</SelectItem>
          ))}
        </Select>
        <Autocomplete
          isRequired
          classNames={{ base: 'font-semibold' }}
          label="Unidad de medida"
          labelPlacement="outside"
          placeholder="Selecciona la unidad de medida del producto"
          selectedKey={formik.values.uniMedida}
          variant="bordered"
          onSelectionChange={(key) => {
            if (key) {
              const type = services
                .get014UnidadDeMedida()
                .find((ttp) => ttp.codigo === key.toString());

              formik.setFieldValue('unidaDeMedida', type?.valores ?? '');
              formik.setFieldValue('uniMedida', type?.codigo ?? '');

              return;
            }
          }}
        >
          {services.get014UnidadDeMedida().map((uni) => (
            <AutocompleteItem key={uni.codigo}>{uni.valores}</AutocompleteItem>
          ))}
        </Autocomplete>
        <Input
          className="dark:text-white font-semibold"
          classNames={{
            label: 'font-semibold text-sm text-gray-600',
          }}
          errorMessage={formik.errors.code}
          isInvalid={!!formik.errors.code && !!formik.touched.code}
          label="Código de producto"
          labelPlacement="outside"
          name="code"
          placeholder="Ingresa el código"
          value={codigo || formik.values.code}
          variant="bordered"
          onBlur={formik.handleBlur('code')}
          onChange={(e) => {
            formik.handleChange('code')(e);
            setCodigoGenerado(e.target.value);
          }}
        />
        <div className="flex gap-1 md:gap-5 items-end">
          <ButtonUi
            className="w-full"
            theme={Colors.Info}
            onPress={async () => {
              const code = await generarCodigo(formik.values.name);

              if (code) {
                formik.handleChange('code')(code);
              }
            }}
          >
            Generar
          </ButtonUi>
          <ButtonUi
            className="w-full"
            theme={Colors.Error}
            onPress={() => verifyCode(formik.values.code)}
          >
            Validar
          </ButtonUi>
        </div>
        <Select
          isRequired
          classNames={{ label: 'font-semibold' }}
          label="Categoría del producto"
          labelPlacement="outside"
          placeholder="Selecciona la categoría del producto"
          variant="bordered"
          onSelectionChange={(key) => {
            if (key) {
              const type = list_categories.find((ttp) => ttp.id === Number(key.currentKey));

              getSubcategories(type?.id ?? 0);
            }
          }}
        >
          {list_categories.map((type) => (
            <SelectItem key={type.id}>{type.name}</SelectItem>
          ))}
        </Select>
        <Select
          isRequired
          classNames={{ label: 'font-semibold' }}
          label="Categoría del producto"
          labelPlacement="outside"
          placeholder="Selecciona la categoría del producto"
          variant="bordered"
          onSelectionChange={(key) => {
            if (key) {
              const type = subcategories.find((ttp) => ttp.id === Number(key.currentKey));

              formik.setFieldValue('subCategoryId', type?.id ?? 0);

              return;
            }
            formik.setFieldValue('subCategoryId', '');
          }}
        >
          {subcategories.map((type) => (
            <SelectItem key={type.id}>{type.name}</SelectItem>
          ))}
        </Select>
        <Input
          isRequired
          className="col-span"
          classNames={{ label: 'font-semibold' }}
          label="Descripción"
          labelPlacement="outside"
          placeholder="Ingresa la descripción del producto"
          variant="bordered"
          {...formik.getFieldProps('description')}
          errorMessage={formik.errors.description}
          isInvalid={!!formik.errors.description && !!formik.touched.description}
        />
        <Select
          classNames={{ label: 'font-semibold' }}
          label="Tipo de producto"
          labelPlacement="outside"
          placeholder="Selecciona el tipo de producto"
          variant="bordered"
          {...formik.getFieldProps('productType')}
          defaultSelectedKeys={[formik.values.productType]}
          onSelectionChange={(key) => {
            formik.setFieldValue('productType', key);
          }}
        >
          {typesProduct.map((typ) => (
            <SelectItem key={typ}>{typ}</SelectItem>
          ))}
        </Select>
      </div>

      <div className="mt-5">
        <div className=" flex justify-between">
          <Switch
            checked={includeReceipt}
            isSelected={includeReceipt}
            onValueChange={(value) => {
              setIncludeReceipt(value);
              if (value === false) setSelectedProducts([]);
            }}
          >
            <span className="font-semibold">Incluir receta de preparación</span>
          </Switch>
          {includeReceipt && (
            <ButtonUi isIconOnly theme={Colors.Success} onPress={modalAddProducts.onOpen}>
              <Plus />
            </ButtonUi>
          )}
        </div>
        {includeReceipt && (
          <div className="pt-5 flex flex-col gap-4 md:flex-row">
            <Input
              className="dark:text-white font-semibold max-w-72"
              classNames={{ label: 'font-semibold' }}
              label="Rendimiento"
              labelPlacement="outside"
              placeholder="Ingresa la receta de preparación"
              value={performance}
              variant="bordered"
              onKeyDown={preventLetters}
              onValueChange={(value) => setPerformance(value)}
            />

            <Input
              className="w-full"
              classNames={{
                label: 'font-semibold',
              }}
              label="Mano de obra directa MOD"
              placeholder="Ingresa la mano de obra directa MOD"
              type="string"
              value={mop.toString()}
              variant="bordered"
              onKeyDown={preventLetters}
              onValueChange={(value) => {
                setMop(Number(value));
              }}
            />
            <Input
              className="w-full"
              classNames={{
                label: 'font-semibold',
              }}
              label="Costo indirecto de fabricación CIF"
              placeholder="Ingresa el costo indirecto de fabricación CIF"
              type="string"
              value={cif.toString()}
              variant="bordered"
              onKeyDown={preventLetters}
              onValueChange={(value) => {
                setCif(Number(value));
              }}
            />
          </div>
        )}
        <RecipeBookProduct
          performance={performance}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      </div>

      <Modal {...modalAddProducts} scrollBehavior="inside" size="2xl">
        <ModalContent>
          <ModalHeader>Selecciona los productos de la receta</ModalHeader>
          <ModalBody>
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
                value={name}
                variant="bordered"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(1);
                  }
                }}
                onValueChange={setName}
              />
              <ButtonUi theme={Colors.Primary} onPress={() => handleSearch(1)}>
                Buscar
              </ButtonUi>
            </div>
            <div className="flex flex-col overflow-y-auto h-full w-full gap-3">
              {paginated_products.products.map((bpr) => (
                <button
                  key={bpr.id}
                  className={classNames(
                    checkIsSelectedSupplier(bpr.id)
                      ? 'shadow-green-100 dark:shadow-gray-500 border-green-400 dark:border-gray-800 bg-green-50 dark:bg-gray-950'
                      : '',
                    'shadow border dark:border-gray-600 w-full flex flex-col justify-start rounded-[12px] p-4'
                  )}
                  onClick={() => handleAddSupplier(bpr)}
                >
                  <div className="flex justify-between gap-5 w-full">
                    <p className="text-sm font-semibold dark:text-white">{bpr.name}</p>
                    <Checkbox
                      checked={checkIsSelectedSupplier(bpr.id)}
                      isSelected={checkIsSelectedSupplier(bpr.id)}
                      onValueChange={() => {
                        handleAddSupplier(bpr);
                      }}
                    />
                  </div>
                  <div className="w-full dark:text-white flex flex-col justify-start text-left mt-2">
                    <p className="w-full dark:text-white">Código: {bpr.code}</p>
                    <p className="w-full dark:text-white">Subcategoría: {bpr.subCategory.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </ModalBody>
          <ModalFooter className="w-full flex justify-between">
            <ButtonUi
              isIconOnly
              theme={Colors.Primary}
              onPress={() => {
                handleSearch(paginated_products.prevPag);
              }}
            >
              <ChevronLeft />
            </ButtonUi>
            <span className="text-sm font-semibold dark:text-white">
              {paginated_products.currentPag} / {paginated_products.totalPag}
            </span>
            <ButtonUi
              isIconOnly
              theme={Colors.Primary}
              onPress={() => {
                handleSearch(paginated_products.nextPag);
              }}
            >
              <ChevronRight />
            </ButtonUi>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default GeneralProductInfo;
