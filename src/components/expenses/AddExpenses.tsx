import {
  Button,
  Input,
  Textarea,
  Autocomplete,
  AutocompleteItem,
  Image as NextImage,
  Tooltip,
} from "@heroui/react";
import { global_styles } from '../../styles/global.styles';
import * as yup from 'yup';
import { useExpenseStore } from '../../store/expenses.store.ts';
import { ICreacteExpense, IExpense } from '../../types/expenses.types.ts';
import { Formik } from 'formik';
import { CategoryExpense } from '../../types/categories_expenses.types.ts';
import { useCategoriesExpenses } from '../../store/categories_expenses.store.ts';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { get_box } from '../../storage/localStorage.ts';
import { toast } from 'sonner';
import { ThemeContext } from '../../hooks/useTheme';
import { Eye, Trash2, X } from 'lucide-react';
import ModalGlobal from '../global/ModalGlobal.tsx';
import { Dialog, Transition } from '@headlessui/react';

interface FileObject {
  url: string;
  type: string;
  name: string;
}
interface Props {
  closeModal: () => void;
  expenses?: IExpense | undefined;
  reload: () => void;
}
const AddExpenses = (props: Props) => {
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState<{ files?: FileList }>({});

  const validationSchema = yup.object().shape({
    description: yup.string().required('La descripción es requerido'),
    total: yup
      .number()
      .required('El total es requerido')
      .min(1, 'El total no puede ser cero o negativo'),
    categoryExpenseId: yup
      .number()
      .required('La categoría es requerido')
      .min(1, 'La categoría es requerida'),
  });
  const { getListCategoriesExpenses, list_categories_expenses } = useCategoriesExpenses();
  const { postExpenses } = useExpenseStore();
  useEffect(() => {
    getListCategoriesExpenses();
    get_box();
  }, []);

  const boxe = get_box();
  const boxId = Number(boxe) || 0;

  const [pdfModalStates, setPdfModalStates] = useState<{ [key: number]: boolean }>({});
  const [selectedImage, setSelectedImage] = useState<{ [key: number]: boolean }>({});

  const handleImageClick = (index: number) => {
    setSelectedImage((prevState) => ({
      ...prevState,
      [index]: true,
    }));
  };

  const handleCloseModal = (index: number) => {
    setSelectedImage((prevState) => ({
      ...prevState,
      [index]: false,
    }));
  };

  const openPdfModal = (index: number) => {
    setPdfModalStates((prevState) => ({
      ...prevState,
      [index]: true,
    }));
  };

  const closePdfModal = (index: number) => {
    setPdfModalStates((prevState) => ({
      ...prevState,
      [index]: false,
    }));
  };

  const [selectedFile, setSelectedFile] = useState<FileObject[]>([]);
  
  const handleFiles = (files: FileList | null): void => {
    if (files && files.length > 0) {
      const newFiles: FileObject[] = [];
      const totalImages = selectedFile.filter(file => file.type.startsWith('image/')).length;
      const totalPDFs = selectedFile.filter(file => file.type === 'application/pdf').length;
  
      if (totalImages + files.length > 6) {
        toast.error('Solo se pueden seleccionar máximo 6 imágenes.');
        return;
      }
  
      if (totalPDFs + files.length > 3) {
        toast.error('Solo se pueden seleccionar máximo 3 PDFs.');
        return;
      }
  
      Array.from(files).forEach((file) => {
        const fileType = file.type;
        if (
          (fileType.startsWith('image/')) ||
          (fileType === 'application/pdf' && totalPDFs < 3)
        ) {
          const fileUrl = URL.createObjectURL(file);
          newFiles.push({ url: fileUrl, name: file.name, type: fileType });
        }
      });
      setSelectedFile((prevFiles) => [...prevFiles, ...newFiles]);
      setFormData((prevFormData) => {
        if (prevFormData.files) {
          const updateFiles = new DataTransfer();
          Array.from(prevFormData.files).forEach((file) => {
            updateFiles.items.add(file);
          });
          Array.from(files).forEach((file) => {
            updateFiles.items.add(file);
          });
          if (fileInputRef.current) {
            fileInputRef.current.files = updateFiles.files;
          }
  
          return { files: updateFiles.files };
        } else {
          if (fileInputRef.current) {
            fileInputRef.current.files = files;
          }
          return { files };
        }
      });
    } else {
      if (fileInputRef.current) {
        if (formData.files) {
          fileInputRef.current.files = formData.files;
        }
      }
      if (formData.files) {
        setSelectedFile((prevFiles) => [...prevFiles]);
      }
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const existingFiles = formData.files ? Array.from(formData.files) : [];
      const allSameType = existingFiles.every(file => file.type.startsWith('image/')) &&
                          Array.from(files).every(file => file.type.startsWith('image/')) ||
                          existingFiles.every(file => file.type === 'application/pdf') &&
                          Array.from(files).every(file => file.type === 'application/pdf');
      
      if (allSameType) {
        handleFiles(files);
      } else {
        toast.error('Debes subir solo imágenes o solo PDFs');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } else {
      if (fileInputRef.current) {
        if (formData.files !== undefined) {
          fileInputRef.current.files = formData.files;
        }
      }
    }
  };
  

  const handleRemoveFile = (index: number): void => {
    const newFiles = [...selectedFile];
    newFiles.splice(index, 1);
    setSelectedFile(newFiles);
    if (formData.files) {
      const updateFiles = Array.from(formData.files);
      updateFiles.splice(index, 1);

      const dataTransfer = new DataTransfer();
      updateFiles.forEach((file) => {
        dataTransfer.items.add(file);
      });
      const updatedFileList = dataTransfer.files;
      setFormData({ files: updatedFileList });
      if (fileInputRef.current) {
        fileInputRef.current.files = updatedFileList;
      }
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (values: ICreacteExpense): Promise<void> => {
    try {
      if (!formData.files || formData.files.length === 0) {
        toast.error('Debes subir al menos un archivo');
        return;
      }
      const filesArray: File[] = Array.from(formData.files);

      await postExpenses({ ...values, files: filesArray });

      props.reload();
      props.closeModal();
    } catch (error) {
      toast.error('Ocurrió un error al guardar la información');
    }
  };

  return (
    <Formik
      initialValues={{
        description: '',
        total: 0,
        boxId: boxId,
        categoryExpenseId: 0,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting }) => (
        <>
          <div className="w-full grid grid-cols-2 gap-4 mt-2">
            <div className="justify-center  grid grid-cols-1 border-2 border-gray-400 border-dashed">
              <div className="m-4">
                <div className="w-full pt-3 mb-8">
                  <Input
                    label="Total"
                    labelPlacement="outside"
                    name="total"
                    value={values.total.toString()}
                    onChange={handleChange('total')}
                    onBlur={handleBlur('total')}
                    placeholder="00.00"
                    classNames={{
                      label: 'font-semibold text-gray-500 text-sm',
                    }}
                    variant="bordered"
                    type="number"
                    startContent="$"
                  />
                  {errors.total && touched.total && (
                    <span className="text-sm font-semibold text-red-500">{errors.total}</span>
                  )}
                </div>
                <div className="w-full mb-8">
                  <Autocomplete
                    onSelectionChange={(key) => {
                      if (key) {
                        const depSelected = JSON.parse(key as string) as CategoryExpense;
                        handleChange('categoryExpenseId')(depSelected.id.toString());
                      }
                    }}
                    onBlur={handleBlur('categoryExpenseId')}
                    label="Categoría de gastos"
                    labelPlacement="outside"
                    placeholder={
                      props.expenses?.categoryExpense.name
                        ? props.expenses?.categoryExpense.name
                        : 'Selecciona la categoría'
                    }
                    variant="bordered"
                    classNames={{
                      base: 'font-semibold text-gray-500 text-sm',
                    }}
                  >
                    {list_categories_expenses.map((dep) => (
                      <AutocompleteItem
                        value={dep.id}
                        key={JSON.stringify(dep)}
                        className="dark:text-white"
                      >
                        {dep.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                  {errors.categoryExpenseId && touched.categoryExpenseId && (
                    <span className="text-sm font-semibold text-red-500">
                      {errors.categoryExpenseId}
                    </span>
                  )}
                </div>
                <div className="w-full  mb-8">
                  <Textarea
                    label="Descripción"
                    placeholder="Descripción"
                    variant="bordered"
                    classNames={{ label: 'font-semibold' }}
                    labelPlacement="outside"
                    onChange={handleChange('description')}
                    onBlur={handleBlur('description')}
                    value={values.description}
                  />
                  {errors.description && touched.description && (
                    <span className="text-sm font-semibold text-red-500">{errors.description}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full h-full  border-2 border-gray-400 border-dashed ">
              <div className="">
                <div className="overflow-y-auto h-96">
                  {selectedFile.length > 0 && (
                    <div className=" grid grid-cols-2 gap-6 m-4  justify-center">
                      {selectedFile.map((file, index) => (
                        <div key={index} className="justify-center mt-3">
                          {file.type === 'image/png' ||
                          file.type === 'image/jpeg' ||
                          file.type === 'image/jpg' ||
                          file.type === 'image/webp' ||
                          file.type === 'image/svg' ? (
                            <div >
                              <div className="flex justify-between">
                              <Tooltip>
                                <button
                                  onClick={() => handleImageClick(index)}
                                >
                                  <Eye
                                  size={18}
                                  className="dark:text-white "
                                  
                                />
                                </button>
                              </Tooltip>
                              <Tooltip
                                showArrow
                                className="dark:text-white"
                                content="click para eliminar"
                              >
                                <button
                                  
                                  onClick={() => handleRemoveFile(index)}
                                >
                                  <Trash2 size={16} className="dark:text-white " />
                                </button>
                              </Tooltip>
                              </div>
                              <NextImage
                                src={file.url}
                                alt={`Preview ${file.name}`}
                                // fallbackSrc={DefaultImage}
                                className="w-full h-full rounded-lg  object-cover"
                              />

                              {selectedImage[index] && (
                                <ModalGlobal
                                  isOpen={selectedImage[index]}
                                  onClose={() => handleCloseModal(index)}
                                  title={file.name}
                                  size="w-full h-full"
                                >
                                  <div className="flex  justify-center items-center w-full h-full overflow-y-auto">
                                    <img
                                      src={file.url}
                                      alt={`Preview ${file.name}`}
                                      className="w-auto h-auto flex justify-center"
                                    />
                                  </div>
                                </ModalGlobal>
                              )}

                              
                            </div>
                          ) : (
                            <div>
                              <div className="flex  justify-between">
                              <Eye
                                size={18}
                                className="dark:text-white "
                                onClick={() => openPdfModal(index)}
                              />

                              <Tooltip
                                showArrow
                                className="dark:text-white"
                                content="click para eliminar"
                              >
                                <button
                                
                                  onClick={() => handleRemoveFile(index)}
                                >
                                  <Trash2 size={16} className="dark:text-white " />
                                </button>
                              </Tooltip>
                              </div>

                              <embed
                                src={file.url}
                                type="application/pdf"
                                className="h-48 w-full rounded-lg mt-1"
                              />

                              {pdfModalStates[index] && (
                                <Transition appear show={pdfModalStates[index]}>
                                  <Dialog
                                    as="div"
                                    className="relative z-[1140] focus:outline-none"
                                    onClose={() => closePdfModal(index)}
                                  >
                                    <div className="fixed inset-0 z-[1150] w-full h-screen overflow-hidden">
                                      <div className="flex min-h-full items-center justify-center">
                                        <Transition.Child
                                          enter="ease-out duration-300"
                                          enterFrom="opacity-0 transform-[scale(95%)]"
                                          enterTo="opacity-100 transform-[scale(100%)]"
                                          leave="ease-in duration-200"
                                          leaveFrom="opacity-100 transform-[scale(100%)]"
                                          leaveTo="opacity-0 transform-[scale(95%)]"
                                        >
                                          <Dialog.Panel className="w-screen h-screen overflow-y-auto bg-white dark:bg-gray-800 backdrop-blur-2xl">
                                            <iframe
                                              src={file.url}
                                              title="PDF Viewer"
                                              className="w-screen h-screen"
                                            />
                                            <Button
                                              style={{ backgroundColor: theme.colors.danger, }}
                                              isIconOnly
                                              onClick={() => closePdfModal(index)}
                                              className="fixed bottom-10 left-10"
                                            >
                                              <X/>
                                            </Button>
                                          </Dialog.Panel>
                                        </Transition.Child>
                                      </div>
                                    </div>
                                  </Dialog>
                                </Transition>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={() => handleSubmit()}
                style={global_styles().thirdStyle}
                className="w-full font-semibold"
              >
                Guardar
              </Button>
            </div>
            <div className="flex justify-center">
              <label htmlFor="fileInput">
                <Button
                  className="text-white font-semibold px-5"
                  onClick={handleButtonClick}
                  style={{
                    backgroundColor: theme.colors.dark,
                    color: theme.colors.primary,
                  }}
                >
                  Selecciona un archivo
                </Button>
              </label>
              <input
                type="file"
                id="file-upload"
                accept=".jpg, jpeg, .png, .webp, .svg, .pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                ref={fileInputRef}
                multiple
              />
            </div>
          </div>
        </>
      )}
    </Formik>
  );
};

export default AddExpenses;
