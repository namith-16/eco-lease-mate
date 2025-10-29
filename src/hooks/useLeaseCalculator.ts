import { useState, useEffect } from 'react';

export interface LeaseCalculatorInputs {
  months: number;
  monthlyPrice: number;
  promoCode: string;
  tradeInCredit: number;
  deposit: number;
  maintenanceAddOn: boolean;
  taxRate: number;
}

export interface LeaseCalculatorOutputs {
  total: number;
  netTotal: number;
  upfrontDue: number;
  monthlyDue: number;
  monthlyTax: number;
  totalTax: number;
  promoDiscount: number;
}

const PROMO_CODES: Record<string, number> = {
  'FIRST10': 0.10,
  'ECO15': 0.15,
  'LULU5': 0.05,
};

const MAINTENANCE_ADD_ON_COST = 499;

export const useLeaseCalculator = (initialInputs?: Partial<LeaseCalculatorInputs>) => {
  const [inputs, setInputs] = useState<LeaseCalculatorInputs>({
    months: initialInputs?.months || 12,
    monthlyPrice: initialInputs?.monthlyPrice || 7599,
    promoCode: initialInputs?.promoCode || '',
    tradeInCredit: initialInputs?.tradeInCredit || 0,
    deposit: initialInputs?.deposit || 0,
    maintenanceAddOn: initialInputs?.maintenanceAddOn || false,
    taxRate: initialInputs?.taxRate || 0.18,
  });

  const [outputs, setOutputs] = useState<LeaseCalculatorOutputs>({
    total: 0,
    netTotal: 0,
    upfrontDue: 0,
    monthlyDue: 0,
    monthlyTax: 0,
    totalTax: 0,
    promoDiscount: 0,
  });

  useEffect(() => {
    calculateLease();
  }, [inputs]);

  const calculateLease = () => {
    const { months, monthlyPrice, promoCode, tradeInCredit, deposit, maintenanceAddOn, taxRate } = inputs;

    // Calculate base total
    let total = monthlyPrice * months;

    // Apply promo code discount
    const promoDiscountRate = PROMO_CODES[promoCode.toUpperCase()] || 0;
    const promoDiscount = total * promoDiscountRate;
    total -= promoDiscount;

    // Add maintenance add-on
    if (maintenanceAddOn) {
      total += MAINTENANCE_ADD_ON_COST * months;
    }

    // Calculate tax
    const totalTax = total * taxRate;

    // Calculate net total
    const netTotal = total + totalTax - tradeInCredit + deposit;

    // Calculate monthly due
    const monthlyDue = netTotal / months;
    const monthlyTax = totalTax / months;

    // Upfront due is the deposit
    const upfrontDue = deposit;

    setOutputs({
      total: Math.round(total * 100) / 100,
      netTotal: Math.round(netTotal * 100) / 100,
      upfrontDue: Math.round(upfrontDue * 100) / 100,
      monthlyDue: Math.round(monthlyDue * 100) / 100,
      monthlyTax: Math.round(monthlyTax * 100) / 100,
      totalTax: Math.round(totalTax * 100) / 100,
      promoDiscount: Math.round(promoDiscount * 100) / 100,
    });
  };

  const updateInput = <K extends keyof LeaseCalculatorInputs>(
    key: K,
    value: LeaseCalculatorInputs[K]
  ) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const resetCalculator = () => {
    setInputs({
      months: 12,
      monthlyPrice: 7599,
      promoCode: '',
      tradeInCredit: 0,
      deposit: 0,
      maintenanceAddOn: false,
      taxRate: 0.18,
    });
  };

  return {
    inputs,
    outputs,
    updateInput,
    resetCalculator,
    validPromoCodes: Object.keys(PROMO_CODES),
  };
};
