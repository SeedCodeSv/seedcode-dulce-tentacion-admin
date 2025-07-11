import { Button, Card, CardFooter, CardHeader, useDisclosure } from '@heroui/react';
import { ArrowRight, Book } from 'lucide-react';

import AuxiliarBook from '@/components/accounting-items/auxiliar-book';
import DailyBook from '@/components/accounting-items/daily-book';
import DailyMajorBook from '@/components/accounting-items/daily-major-book';
import MajorBook from '@/components/accounting-items/major-book';
import TrialBalance from '@/components/accounting-items/trial-balance';
import DivGlobal from '@/themes/ui/div-global';

function Reports() {
  const modalDailyBook = useDisclosure();
  const modalMajorBook = useDisclosure();
  const modalDailyMajorBook = useDisclosure();
  const modalAuxiliarBook = useDisclosure();
  const modalTrialBalance = useDisclosure();

  const reports = [
    {
      name: 'Libro Diario',
      icon: <Book className="text-blue-500" size={20} />,
      route: '/contablilidad/reports',
      onPress: () => {
        modalDailyBook.onOpen();
      },
    },
    {
      name: 'Libro Mayor',
      icon: <Book className="text-blue-500" size={20} />,
      route: '/contablilidad/reports',
      onPress: () => {
        modalMajorBook.onOpen();
      },
    },
    {
      name: 'Libro Diario Mayor',
      icon: <Book className="text-blue-500" size={20} />,
      onPress: () => {
        modalDailyMajorBook.onOpen();
      },
    },
    {
      name: 'Libro Auxiliar de cuenta',
      icon: <Book className="text-blue-500" size={20} />,
      onPress: () => {
        modalAuxiliarBook.onOpen();
      },
    },
    {
      name: 'Balance de comprobación',
      icon: <Book className="text-blue-500" size={20} />,
      onPress: () => {
        modalTrialBalance.onOpen();
      },
    },
    {
      name: 'Estado de resultados',
      icon: <Book className="text-blue-500" size={20} />,
      onPress: () => {},
    },
  ];

  return (
    <DivGlobal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-2">
        {reports.map((r) => (
          <Card key={r.name} isPressable onPress={r.onPress}>
            <CardHeader className="flex justify-between text-lg font-semibold dark:text-white">
              {r.name}
              {r.icon}
            </CardHeader>
            <CardFooter className="flex justify-end">
              <Button color="primary" variant="light" onPress={r.onPress}>
                <ArrowRight size={15} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <DailyBook disclosure={modalDailyBook} />
      <MajorBook disclosure={modalMajorBook} />
      <DailyMajorBook disclosure={modalDailyMajorBook} />
      <AuxiliarBook disclosure={modalAuxiliarBook} />
      <TrialBalance disclosure={modalTrialBalance} />
    </DivGlobal>
  );
}

export default Reports;
