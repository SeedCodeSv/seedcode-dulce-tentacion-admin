export interface IPropSaveShippingNote {
  json_url: string;
  closeModal: () => void;
  setCurrentState: (slep: string) => void;
  OnClearProductSelectedAll: () => void;
  pointOfSaleId: number;
  employeeId: number;
  handleDownload: () => void;
  customerId?: number;
  receivingBranchId?: number;
  receivingEmployeeId?: number;
}
