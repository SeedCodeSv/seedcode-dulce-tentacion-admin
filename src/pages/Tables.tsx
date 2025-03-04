import { useContext } from 'react';
import Layout from '../layout/Layout';
import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@heroui/react";
import { ThemeContext } from '../hooks/useTheme';
import { Edit, Trash } from 'lucide-react';

function Tables() {
  const { theme } = useContext(ThemeContext);

  const users = [
    {
      id: 1,
      name: 'Juan Perez',
      email: 'juanperez@gmail.com',
    },
    {
      id: 2,
      name: 'Juan Perez',
      email: 'juanperez@gmail.com',
    },
    {
      id: 3,
      name: 'Juan Perez',
      email: 'juanperez@gmail.com',
    },
  ];

  const columns = [
    { uuid: 'id', name: 'ID' },
    { uuid: 'name', name: 'Name' },
    { uuid: 'email', name: 'Email' },
    { uuid: 'actions', name: 'Acciones' },
  ];

  return (
    <Layout title="Inicio">
      <div className="p-10 w-full h-full">
        <h1>Tables</h1>
        <div className="w-full hidden lg:flex">
          <Table aria-label="Example table with dynamic content">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uuid}
                  style={{
                    backgroundColor: theme.colors.dark,
                    color: theme.colors.primary,
                  }}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={users}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>
                      {columnKey === 'actions' ? (
                        <div className="flex gap-2">
                          <Button
                            color="primary"
                            style={{ backgroundColor: theme.colors.secondary }}
                            isIconOnly
                          >
                            <Edit color={theme.colors.primary} />
                          </Button>
                          <Button
                            color="primary"
                            style={{ backgroundColor: theme.colors.danger }}
                            isIconOnly
                          >
                            <Trash color={theme.colors.primary} />
                          </Button>
                        </div>
                      ) : (
                        getKeyValue(item, columnKey)
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:hidden gap-5">
          {users.map((user) => (
            <Card key={user.id} className="p-5" isPressable>
              <p>{user.name}</p>
              <p>{user.email}</p>
              <div className="w-full flex gap-5 mt-4">
                <Button
                  color="primary"
                  style={{ backgroundColor: theme.colors.secondary }}
                  isIconOnly
                >
                  <Edit color={theme.colors.primary} />
                </Button>
                <Button color="primary" style={{ backgroundColor: theme.colors.danger }} isIconOnly>
                  <Trash color={theme.colors.primary} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Tables;
