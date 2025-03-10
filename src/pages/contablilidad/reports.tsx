import AuxiliarBook from '@/components/accounting-items/auxiliar-book';
import DailyBook from '@/components/accounting-items/daily-book';
import DailyMajorBook from '@/components/accounting-items/daily-major-book';
import MajorBook from '@/components/accounting-items/major-book';
import Layout from '@/layout/Layout';
import { Button, Card, CardFooter, CardHeader, useDisclosure } from '@heroui/react';
import { ArrowRight, Book } from 'lucide-react';

function Reports() {
  const modalDailyBook = useDisclosure();
  const modalMajorBook = useDisclosure();
  const modalDailyMajorBook = useDisclosure();
  const modalAuxiliarBook = useDisclosure();

  const reports = [
    {
      name: 'Libro Diario',
      icon: <Book size={20} className="text-blue-500" />,
      route: '/contablilidad/reports',
      onPress: () => {
        modalDailyBook.onOpen();
      },
    },
    {
      name: 'Libro Mayor',
      icon: <Book size={20} className="text-blue-500" />,
      route: '/contablilidad/reports',
      onPress: () => {
        modalMajorBook.onOpen();
      },
    },
    {
      name: 'Libro Diario Mayor',
      icon: <Book size={20} className="text-blue-500" />,
      onPress: () => {
        modalDailyMajorBook.onOpen();
      },
    },
    {
      name: 'Libro Auxiliar',
      icon: <Book size={20} className="text-blue-500" />,
      onPress: () => {
        modalAuxiliarBook.onOpen();
      },
    },
    {
      name: 'Balance General',
      icon: <Book size={20} className="text-blue-500" />,
      onPress: () => {},
    },
    {
      name: 'Estado de resultados',
      icon: <Book size={20} className="text-blue-500" />,
      onPress: () => {},
    },
  ];

  return (
    <Layout title="Reportes contables">
      <div className=" w-full h-full p-3 pt-6 flex flex-col bg-white dark:bg-gray-900 dark:border-gray-500">
        <div className="w-full h-full flex flex-col border border-white p-5 overflow-y-auto bg-white shadow rounded-xl dark:bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
            {reports.map((r) => (
              <Card key={r.name} isPressable onPress={r.onPress}>
                <CardHeader className="flex justify-between text-lg font-semibold dark:text-white">
                  {r.name}
                  {r.icon}
                </CardHeader>
                <CardFooter className="flex justify-end">
                  <Button variant="light" color="primary" onPress={r.onPress}>
                    <ArrowRight size={15} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        <DailyBook disclosure={modalDailyBook} />
        <MajorBook disclosure={modalMajorBook} />
        <DailyMajorBook disclosure={modalDailyMajorBook} />
        <AuxiliarBook disclosure={modalAuxiliarBook} />
      </div>
    </Layout>
  );
}

export default Reports;
