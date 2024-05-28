// import React from 'react'
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';
// import { useProductsStore } from '../../store/products.store';

function AddPurchaseOrders() {
  return (
    <div>
      <Autocomplete variant='bordered'>
        <AutocompleteItem key={0} value=''></AutocompleteItem>
      </Autocomplete>
    </div>
  )
}

export default AddPurchaseOrders
