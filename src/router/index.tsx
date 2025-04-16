import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { lazy } from 'react';
import { IRoleAction } from '@/types/role-actions.types';
import AnimatedRoute from './animated-route';
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

export const router = ({ roleActions }: { roleActions: IRoleAction }) => {
  const handleCheckPermission = (name: string) => {
    const find_view = roleActions?.views.find((r) => r.view.name === name);
    if (find_view) return true;
    return false;
  };

  const mainRoutes = createRoutesFromElements(
    <>
      <Route
        path="/"
        element={
          <AnimatedRoute>
            <Home />
          </AnimatedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Productos') ? <Product /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/add-product"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Productos') ? <AddProduct /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/add-account-catalog"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Catalogos de Cuentas') ? <AddAccountCatalogs /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Categorias de Productos') ? <ProductsCategories /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/sub-categories"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Sub Categorias') ? <SubCategories /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/shopping"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Compras') ? <Shopping /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/create-shopping"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Compras') ? <CreateShopping /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <AnimatedRoute>{handleCheckPermission('Usuarios') ? <Users /> : <Home />}</AnimatedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Empleados') ? <Employees /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/add-employee"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Empleados') ? <AddEmployee /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/suppliers"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Proveedores') ? <Supplier /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/add-supplier-normal"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Proveedores') ? <AddNormalSupplier /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/update-supplier-normal/:id"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Proveedores') ? <UpdateNormalSupplier /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/add-supplier-tribute"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Proveedores') ? <AddTributeSupplier /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/update-supplier-tribute/:id"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Proveedores') ? <UpdateTributeSupplier /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/branches"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Sucursales') ? <Branch /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Clientes') ? <Customers /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/points-of-sales"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Puntos de Venta') ? <PointOfSales /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/action-rol"
        element={
          <AnimatedRoute>
            <ActionRol />
          </AnimatedRoute>
        }
      />
      <Route
        path="/birthday-calendar"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Empleados') ? <BirthdayCalendar /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/sales-by-period"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Ventas por Periodo') ? <VentasPorPeriodo /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/sales-by-product"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Ventas por Productos') ? <VentasPorProducto /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/study-level"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Nivel de Estudio') ? <StudyLevel /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/contract-types"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Tipo de Contratacion') ? <ContratType /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/status-employee"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Estados del Empleado') ? <StatusEmployee /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/correlative"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Correlativos') ? <CorrelativePage /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/charges"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Cargos de Empleados') ? <Charges /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/discounts"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Descuentos') ? <Discount /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/configuration"
        element={
          <AnimatedRoute>
            <Configuration />
          </AnimatedRoute>
        }
      />
      <Route
        path="/add-client-contributor/:id"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Clientes') ? <AddClientContributor /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/add-client"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Clientes') ? <AddClientNormal /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/add-customer/:id/:type"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Clientes') ? <AddCustomer /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/add-client-contributor"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Proveedores') ? <AddClientContributor /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/update-client-contributor/:id"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Proveedores') ? <UpdateClientContributor /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/add-promotions"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Descuentos') ? <AddPromotions /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/add-action-rol"
        element={
          <AnimatedRoute>
            <AddActionRol />
          </AnimatedRoute>
        }
      />
      <Route
        path="/cash-cuts-big-z"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Corte Gran Z') ? <CushCatsBigZ /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/account-catalogs"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Catalogos de Cuentas') ? <AccountCatalogs /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/cash-cuts-x"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Corte X') ? <CashCutsX /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/cash-cuts-z"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Corte Z') ? <CushCatsZ /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/iva/shopping-book"
        element={
          <AnimatedRoute>
            {handleCheckPermission('IVA de Compras') ? <ShoppingBookIVA /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/iva/ccf-book"
        element={
          <AnimatedRoute>
            {handleCheckPermission('IVA de CCF') ? <CFFBookIVA /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/iva/fe-book"
        element={
          <AnimatedRoute>
            {handleCheckPermission('IVA de FE') ? <FEBookIVA /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="*"
        element={
          <AnimatedRoute>
            <Error404 />
          </AnimatedRoute>
        }
      />
      <Route
        path="/add-theme"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Configuración') ? <CreateTheme /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/sales"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Ventas') ? <SalesPage /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/sales-ticket"
        element={
          <AnimatedRoute>
            {handleCheckPermission('Ventas Ticket') ? <TicketSales /> : <Home />}
          </AnimatedRoute>
        }
      />
      <Route
        path="/get-debit-note/:id"
        element={
          <AnimatedRoute>
            <NotesDebitBySale />
          </AnimatedRoute>
        }
      />
      <Route
        path="/get-credit-note/:id"
        element={
          <AnimatedRoute>
            <NotesCreditBySale />
          </AnimatedRoute>
        }
      />
      <Route
        path="/contingence-section"
        element={
          <AnimatedRoute>
            <ContingenceSection />
          </AnimatedRoute>
        }
      />
      <Route
        path="/annulation/:tipoDte/:id"
        element={
          <AnimatedRoute>
            <Annulation />
          </AnimatedRoute>
        }
      />
      <Route
        path="/edit-shopping/:id/:controlNumber"
        element={
          <AnimatedRoute>
            <EditShopping />
          </AnimatedRoute>
        }
      />
      <Route
        path="/update-account-catalog/:id"
        element={
          <AnimatedRoute>
            <UpdateAccountCatalogs />
          </AnimatedRoute>
        }
      />
      <Route
        path="/edit-transmitter-info"
        element={
          <AnimatedRoute>
            <EditTransmitterInfo />
          </AnimatedRoute>
        }
      />
      {/* Reportes contables */}
      <Route
        path="/accounting-items"
        element={
          <AnimatedRoute>
            <AccountingItems />
          </AnimatedRoute>
        }
      />
      <Route
        path="/add-accounting-items"
        element={
          <AnimatedRoute>
            <AddAccountingItems />
          </AnimatedRoute>
        }
      />
      <Route
        path="/add-item-by-sales"
        element={
          <AnimatedRoute>
            <AddItemsBySales />
          </AnimatedRoute>
        }
      />
      <Route
        path="/edit-accounting-items/:id"
        element={
          <AnimatedRoute>
            <EditAccountingItems />
          </AnimatedRoute>
        }
      />
      <Route
        path="/type-accounting"
        element={
          <AnimatedRoute>
            <TypeAccountingItem />
          </AnimatedRoute>
        }
      />
      <Route
        path="/report-accounting"
        element={
          <AnimatedRoute>
            <Reports />
          </AnimatedRoute>
        }
      />
      {/* Anexos de IVA */}
      <Route
        path="/anexos-iva-compras"
        element={
          <AnimatedRoute>
            <AnexosCompras />
          </AnimatedRoute>
        }
      />
      <Route
        path="/anexos-fe"
        element={
          <AnimatedRoute>
            <AnexoFe />
          </AnimatedRoute>
        }
      />
      <Route
        path="/anexos-ccfe"
        element={
          <AnimatedRoute>
            <AnexoCcfe />
          </AnimatedRoute>
        }
      />
      <Route
        path="/verificar-faltantes"
        element={
          <AnimatedRoute>
            <VerificadorCorrelativos />
          </AnimatedRoute>
        }
      />
    </>
  );

  return createBrowserRouter([...mainRoutes]);
};
