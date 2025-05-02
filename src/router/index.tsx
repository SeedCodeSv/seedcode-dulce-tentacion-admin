import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { lazy } from 'react';

import AnimatedRoute from './animated-route';

import { IRoleAction } from '@/types/role-actions.types';
import VerificadorCorrelativos from '@/pages/verificar-faltantes';

const AccountingItems = lazy(() => import('@/pages/contablilidad/accounting-items'));
const AddAccountingItems = lazy(() => import('@/pages/contablilidad/add-accounting-items'));
const AddItemsBySales = lazy(() => import('@/pages/contablilidad/add-items-by-sales'));
const EditAccountingItems = lazy(() => import('@/pages/contablilidad/edit-accounting-items'));
const TypeAccountingItem = lazy(() => import('@/pages/contablilidad/type-accounting-item'));
const Reports = lazy(() => import('@/pages/contablilidad/reports'));
const AnexosCompras = lazy(() => import('@/pages/anexos_iva/anexos_compras'));
const AnexoFe = lazy(() => import('@/pages/anexos_iva/anexo_fe'));
const AnexoCcfe = lazy(() => import('@/pages/anexos_iva/anexo_ccfe'));

const Supplier = lazy(() => import('../pages/Supplier'));
const Discount = lazy(() => import('../pages/Promotions'));
const AddPromotions = lazy(() => import('../components/discounts/AddPromotions'));
const StatusEmployee = lazy(() => import('../pages/statusEmployee'));
const ContratType = lazy(() => import('../pages/ContratType'));
const AddEmployee = lazy(() => import('../components/employee/AddEmployee'));
const VentasPorPeriodo = lazy(() => import('../pages/reports/VentasPorPeriodo'));
const StudyLevel = lazy(() => import('../pages/StudyLevel'));
const AddActionRol = lazy(() => import('../components/Action_rol/AddActionRol'));
const AddProduct = lazy(() => import('../pages/add-product'));
const VentasPorProducto = lazy(() => import('../pages/reports/VentasPorProducto'));
const CushCatsBigZ = lazy(() => import('../pages/CashCutsBigZ'));
const CashCutsX = lazy(() => import('../pages/CashCutsX'));
const CushCatsZ = lazy(() => import('../pages/CashCutsZ'));
const ShoppingBookIVA = lazy(() => import('../pages/iva/shopping-iva'));
const Shopping = lazy(() => import('../pages/shopping'));
const CreateShopping = lazy(() => import('../components/shopping/create-shopping-json'));
const CFFBookIVA = lazy(() => import('../pages/iva/CFFBookIVA'));
const FEBookIVA = lazy(() => import('../pages/iva/FEBookIVA'));
const CreateTheme = lazy(() => import('../components/configuration/CreateTheme'));
const AddClientContributor = lazy(() => import('../components/clients/AddClientContributor'));
const AddClientNormal = lazy(() => import('../components/clients/AddClientNormal'));
const AddNormalSupplier = lazy(() => import('../components/supplier/AddNormalSupplier'));
const AddTributeSupplier = lazy(() => import('../components/supplier/AddTributeSupplier'));
const UpdateNormalSupplier = lazy(() => import('../components/supplier/UpdateNormalSupplier'));
const CorrelativePage = lazy(() => import('../pages/CorrelativePage'));
const UpdateTributeSupplier = lazy(() => import('../components/supplier/UpdateTributeSupplier'));
const UpdateClientContributor = lazy(() => import('../components/clients/UpdateClientContributor'));
const AddCustomer = lazy(() => import('../pages/AddCustomer'));
const BirthdayCalendar = lazy(() => import('../components/employee/BirthdayCalendar'));
const PointOfSales = lazy(() => import('../pages/PointOfSales'));
const SalesPage = lazy(() => import('../pages/Sales'));
const NotesDebitBySale = lazy(() => import('../components/notas/DebitNoteBySale'));
const NotesCreditBySale = lazy(() => import('../components/notas/CreditNoteBySale'));
const ContingenceSection = lazy(() => import('../pages/ContingenceSection'));
const Annulation = lazy(() => import('../pages/Annulation'));
const EditShopping = lazy(() => import('../components/shopping/edit-shopping'));
const AccountCatalogs = lazy(() => import('../pages/account-catalog'));
const AddAccountCatalogs = lazy(() => import('../components/account-catalogs/add-account-catalog'));
const UpdateAccountCatalogs = lazy(
  () => import('../components/account-catalogs/update-account-catalog')
);
const TicketSales = lazy(() => import('../pages/ticket-sales'));
const EditTransmitterInfo = lazy(() => import('../pages/edit-transmitter-info'));
const Home = lazy(() => import('../pages/home'));
const ProductsCategories = lazy(() => import('../pages/ProductsCategories'));
const Users = lazy(() => import('../pages/Users'));
const Employees = lazy(() => import('../pages/Employees'));
const Customers = lazy(() => import('../pages/Customers'));
const Branch = lazy(() => import('../pages/Branch'));
const Error404 = lazy(() => import('../pages/Error404'));
const Product = lazy(() => import('../pages/Product'));
const ActionRol = lazy(() => import('../pages/ActionRol'));
const Charges = lazy(() => import('../pages/Charges'));
const SubCategories = lazy(() => import('../pages/SubCategories'));
const Configuration = lazy(() => import('../pages/Configuration'));
const AddProductRecipe = lazy(() => import('../pages/add-product-recipe'));

export const router = ({ roleActions }: { roleActions: IRoleAction }) => {
  const handleCheckPermission = (name: string) => {
    const find_view = roleActions?.views.find((r) => r.view.name === name);

    if (find_view) return true;

    return false;
  };

  const mainRoutes = createRoutesFromElements(
    <>
      <Route
        element={
          <AnimatedRoute>
            <Home />
          </AnimatedRoute>
        }
        path="/"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Productos') ? <Product /> : <Home />}
          </AnimatedRoute>
        }
        path="/products"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Productos') ? <AddProduct /> : <Home />}
          </AnimatedRoute>
        }
        path="/add-product"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Catalogos de Cuentas') ? <AddAccountCatalogs /> : <Home />}
          </AnimatedRoute>
        }
        path="/add-account-catalog"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Categorias de Productos') ? <ProductsCategories /> : <Home />}
          </AnimatedRoute>
        }
        path="/categories"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Sub Categorias') ? <SubCategories /> : <Home />}
          </AnimatedRoute>
        }
        path="/sub-categories"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Compras') ? <Shopping /> : <Home />}
          </AnimatedRoute>
        }
        path="/shopping"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Compras') ? <CreateShopping /> : <Home />}
          </AnimatedRoute>
        }
        path="/create-shopping"
      />
      <Route
        element={
          <AnimatedRoute>{handleCheckPermission('Usuarios') ? <Users /> : <Home />}</AnimatedRoute>
        }
        path="/users"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Empleados') ? <Employees /> : <Home />}
          </AnimatedRoute>
        }
        path="/employees"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Empleados') ? <AddEmployee /> : <Home />}
          </AnimatedRoute>
        }
        path="/add-employee"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Proveedores') ? <Supplier /> : <Home />}
          </AnimatedRoute>
        }
        path="/suppliers"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Proveedores') ? <AddNormalSupplier /> : <Home />}
          </AnimatedRoute>
        }
        path="/add-supplier-normal"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Proveedores') ? <UpdateNormalSupplier /> : <Home />}
          </AnimatedRoute>
        }
        path="/update-supplier-normal/:id"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Proveedores') ? <AddTributeSupplier /> : <Home />}
          </AnimatedRoute>
        }
        path="/add-supplier-tribute"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Proveedores') ? <UpdateTributeSupplier /> : <Home />}
          </AnimatedRoute>
        }
        path="/update-supplier-tribute/:id"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Sucursales') ? <Branch /> : <Home />}
          </AnimatedRoute>
        }
        path="/branches"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Clientes') ? <Customers /> : <Home />}
          </AnimatedRoute>
        }
        path="/clients"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Puntos de Venta') ? <PointOfSales /> : <Home />}
          </AnimatedRoute>
        }
        path="/points-of-sales"
      />
      <Route
        element={
          <AnimatedRoute>
            <ActionRol />
          </AnimatedRoute>
        }
        path="/action-rol"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Empleados') ? <BirthdayCalendar /> : <Home />}
          </AnimatedRoute>
        }
        path="/birthday-calendar"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Ventas por Periodo') ? <VentasPorPeriodo /> : <Home />}
          </AnimatedRoute>
        }
        path="/sales-by-period"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Ventas por Productos') ? <VentasPorProducto /> : <Home />}
          </AnimatedRoute>
        }
        path="/sales-by-product"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Nivel de Estudio') ? <StudyLevel /> : <Home />}
          </AnimatedRoute>
        }
        path="/study-level"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Tipo de Contratacion') ? <ContratType /> : <Home />}
          </AnimatedRoute>
        }
        path="/contract-types"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Estados del Empleado') ? <StatusEmployee /> : <Home />}
          </AnimatedRoute>
        }
        path="/status-employee"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Correlativos') ? <CorrelativePage /> : <Home />}
          </AnimatedRoute>
        }
        path="/correlative"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Cargos de Empleados') ? <Charges /> : <Home />}
          </AnimatedRoute>
        }
        path="/charges"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Descuentos') ? <Discount /> : <Home />}
          </AnimatedRoute>
        }
        path="/discounts"
      />
      <Route
        element={
          <AnimatedRoute>
            <Configuration />
          </AnimatedRoute>
        }
        path="/configuration"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Clientes') ? <AddClientContributor /> : <Home />}
          </AnimatedRoute>
        }
        path="/add-client-contributor/:id"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Clientes') ? <AddClientNormal /> : <Home />}
          </AnimatedRoute>
        }
        path="/add-client"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Clientes') ? <AddCustomer /> : <Home />}
          </AnimatedRoute>
        }
        path="/add-customer/:id/:type"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Proveedores') ? <AddClientContributor /> : <Home />}
          </AnimatedRoute>
        }
        path="/add-client-contributor"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Proveedores') ? <UpdateClientContributor /> : <Home />}
          </AnimatedRoute>
        }
        path="/update-client-contributor/:id"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Descuentos') ? <AddPromotions /> : <Home />}
          </AnimatedRoute>
        }
        path="/add-promotions"
      />
      <Route
        element={
          <AnimatedRoute>
            <AddActionRol />
          </AnimatedRoute>
        }
        path="/add-action-rol"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Corte Gran Z') ? <CushCatsBigZ /> : <Home />}
          </AnimatedRoute>
        }
        path="/cash-cuts-big-z"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Catalogos de Cuentas') ? <AccountCatalogs /> : <Home />}
          </AnimatedRoute>
        }
        path="/account-catalogs"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Corte X') ? <CashCutsX /> : <Home />}
          </AnimatedRoute>
        }
        path="/cash-cuts-x"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Corte Z') ? <CushCatsZ /> : <Home />}
          </AnimatedRoute>
        }
        path="/cash-cuts-z"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('IVA de Compras') ? <ShoppingBookIVA /> : <Home />}
          </AnimatedRoute>
        }
        path="/iva/shopping-book"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('IVA de CCF') ? <CFFBookIVA /> : <Home />}
          </AnimatedRoute>
        }
        path="/iva/ccf-book"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('IVA de FE') ? <FEBookIVA /> : <Home />}
          </AnimatedRoute>
        }
        path="/iva/fe-book"
      />
      <Route
        element={
          <AnimatedRoute>
            <Error404 />
          </AnimatedRoute>
        }
        path="*"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Configuración') ? <CreateTheme /> : <Home />}
          </AnimatedRoute>
        }
        path="/add-theme"
      />
       <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Productos') ? <AddProductRecipe /> : <Home />}
          </AnimatedRoute>
        }
        path="/add-product-recipe/:id/:recipe"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Ventas') ? <SalesPage /> : <Home />}
          </AnimatedRoute>
        }
        path="/sales"
      />
      <Route
        element={
          <AnimatedRoute>
            {handleCheckPermission('Ventas Ticket') ? <TicketSales /> : <Home />}
          </AnimatedRoute>
        }
        path="/sales-ticket"
      />
      <Route
        element={
          <AnimatedRoute>
            <NotesDebitBySale />
          </AnimatedRoute>
        }
        path="/get-debit-note/:id"
      />
      <Route
        element={
          <AnimatedRoute>
            <NotesCreditBySale />
          </AnimatedRoute>
        }
        path="/get-credit-note/:id"
      />
      <Route
        element={
          <AnimatedRoute>
            <ContingenceSection />
          </AnimatedRoute>
        }
        path="/contingence-section"
      />
      <Route
        element={
          <AnimatedRoute>
            <Annulation />
          </AnimatedRoute>
        }
        path="/annulation/:tipoDte/:id"
      />
      <Route
        element={
          <AnimatedRoute>
            <EditShopping />
          </AnimatedRoute>
        }
        path="/edit-shopping/:id/:controlNumber"
      />
      <Route
        element={
          <AnimatedRoute>
            <UpdateAccountCatalogs />
          </AnimatedRoute>
        }
        path="/update-account-catalog/:id"
      />
      <Route
        element={
          <AnimatedRoute>
            <EditTransmitterInfo />
          </AnimatedRoute>
        }
        path="/edit-transmitter-info"
      />
      {/* Reportes contables */}
      <Route
        element={
          <AnimatedRoute>
            <AccountingItems />
          </AnimatedRoute>
        }
        path="/accounting-items"
      />
      <Route
        element={
          <AnimatedRoute>
            <AddAccountingItems />
          </AnimatedRoute>
        }
        path="/add-accounting-items"
      />
      <Route
        element={
          <AnimatedRoute>
            <AddItemsBySales />
          </AnimatedRoute>
        }
        path="/add-item-by-sales"
      />
      <Route
        element={
          <AnimatedRoute>
            <EditAccountingItems />
          </AnimatedRoute>
        }
        path="/edit-accounting-items/:id"
      />
      <Route
        element={
          <AnimatedRoute>
            <TypeAccountingItem />
          </AnimatedRoute>
        }
        path="/type-accounting"
      />
      <Route
        element={
          <AnimatedRoute>
            <Reports />
          </AnimatedRoute>
        }
        path="/report-accounting"
      />
      {/* Anexos de IVA */}
      <Route
        element={
          <AnimatedRoute>
            <AnexosCompras />
          </AnimatedRoute>
        }
        path="/anexos-iva-compras"
      />
      <Route
        element={
          <AnimatedRoute>
            <AnexoFe />
          </AnimatedRoute>
        }
        path="/anexos-fe"
      />
      <Route
        element={
          <AnimatedRoute>
            <AnexoCcfe />
          </AnimatedRoute>
        }
        path="/anexos-ccfe"
      />
      <Route
        element={
          <AnimatedRoute>
            <VerificadorCorrelativos />
          </AnimatedRoute>
        }
        path="/verificar-faltantes"
      />
    </>
  );

  return createBrowserRouter([...mainRoutes]);
};
