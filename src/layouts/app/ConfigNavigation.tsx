import { useMemo } from 'react';
import { useLocales } from '@locales';
import { pathKeys } from 'shared/routes';
import { IconsElement } from 'shared/ui/iconify/icons';

// ----------------------------------------------------------------------

export function useNavData(isBilling?: boolean) {
  const { t } = useLocales();

  const admin = useMemo(
    () => [
      {
        subheader: '',
        items: [
          {
            title: t('products'),
            path: pathKeys.products,
            icon: IconsElement.product,
          },

          {
            title: t('staffs'),
            path: pathKeys.staff.root,
            icon: IconsElement.employee,
          },
          {
            title: t('suppliers'),
            path: pathKeys.supplier.root,
            icon: IconsElement.supplier,
          },
          {
            title: 'Sales Report',
            path: pathKeys.reports.sales,
            icon: IconsElement.billing,
          },
          {
            title: 'Purchase Report',
            path: pathKeys.reports.purchases,
            icon: IconsElement.product,
          },
        ],
      },
    ],
    [t]
  );

  const billing = useMemo(
    () => [
      {
        subheader: '',
        items: [
          {
            title: t('sales'),
            path: pathKeys.billing.customer,
            icon: IconsElement.employee,
          },
          {
            title: t('purchase'),
            path: pathKeys.billing.supplierFP,
            icon: IconsElement.supplier,
          },
          {
            title: 'Sales Report',
            path: pathKeys.billing.salesReport,
            icon: IconsElement.billing,
          },
          {
            title: 'Purchase Report',
            path: pathKeys.billing.purchaseReport,
            icon: IconsElement.product,
          },
        ],
      },
    ],
    [t]
  );

  return isBilling ? billing : admin;
}
