// utils/TaxUtils.js
import React, { useEffect, useState } from 'react';

export const calculateTaxedPrice = (price, taxRate) => {
    const taxAmount = (parseFloat(price) * parseFloat(taxRate)) / 100;
    const taxedPrice = parseFloat(price) + taxAmount;
    return taxedPrice.toFixed(2); // Round to 2 decimal places
  }
  