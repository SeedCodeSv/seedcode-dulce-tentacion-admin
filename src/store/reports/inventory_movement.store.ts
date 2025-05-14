
import { create } from 'zustand';

import { IInventoryMovementStore } from '../../types/reports/inventory_movement';

import { get_inventory_movement, get_inventory_movement_graphic } from '@/services/reports/inventory_movement.service';

export const useInventoryMovement = create<IInventoryMovementStore>((set) => ({
  pagination_inventory_movement: {
    total: 0,
    totalPag: 0,
    currentPag: 0,
    nextPag: 0,
    prevPag: 0,
  },
  inventoryMoments: [],
  inventoyMovement: [],
  totalEntry: 0,
  totalExit: 0,

  OnGetInventoryMovement(id,page,limit,startDate,endDate,branch,typeOfInventory,typeOfMovement) {
  get_inventory_movement( id, page, limit, startDate, endDate, branch, typeOfInventory, typeOfMovement)
      .then(({ data }) =>
        set({
          inventoryMoments: data.inventoryMoments,
          pagination_inventory_movement: {
            total: data.total,
            totalPag: data.totalPag,
            currentPag: data.currentPag,
            nextPag: data.nextPag,
            prevPag: data.prevPag,
          },
        })
      )
      .catch(() => {
        set({
        inventoryMoments: [],
        pagination_inventory_movement: {
            total: 0,
          totalPag: 0,
          currentPag: 0,
          nextPag: 0,
          prevPag: 0,
        }
      })
      });
  },
  OnGetGraphicInventoryMovement(id: number, startDate: string, endDate: string, branch: string) {
    get_inventory_movement_graphic(id, startDate, endDate, branch).then(({ data }) => {
      set({
        inventoyMovement: data.inventoyMovement,
        totalEntry: data.totalEntry,
        totalExit: data.totalExit,
      });
    }).catch(() => {
      set({
        inventoyMovement: []
      })
     
    });
  },
}));
