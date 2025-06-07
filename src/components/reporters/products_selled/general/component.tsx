import { Input } from "@heroui/react";
import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";

import { useProductsStore } from "@/store/products.store";

interface Product {
    id: number;
    name: string;
}

interface Props {
    selectedProducts: Product[];
    onChange: (selected: Product[]) => void;
}

export default function MultiSelectProductAutocomplete({ selectedProducts, onChange }: Props) {
    const { productsFilteredList, getProductsFilteredList } = useProductsStore();

    const [inputValue, setInputValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (inputValue.trim().length > 1) {
            getProductsFilteredList({ productName: inputValue });
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    }, [inputValue]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleProduct = (product: Product) => {
        if (selectedProducts.find((p) => p.id === product.id)) {
            onChange(selectedProducts.filter((p) => p.id !== product.id));
        } else {
            setInputValue('')
            onChange([...selectedProducts, product]);
        }
    };


    return (
        <div ref={containerRef} className="relative rounded-xl border-2 w-full shadow-sm">
            <div className={`flex gap-2 max-h-9 overflow-x-auto scrollbar-hide pb-0 ${selectedProducts.length > 0 ? 'p-2': 'p-0'}`}>
                {selectedProducts.map((product) => (
                    <span
                        key={product.id}
                        className="bg-blue-600 text-white rounded-full px-3 py-1 text-sm flex items-center max-w-full"
                        title={product.name}
                    >
                        <span className="truncate max-w-[200px]">{product.name}</span>
                        <button
                            aria-label={`Quitar ${product.name}`}
                            className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                            onClick={() => toggleProduct(product)}
                        >
                            &times;
                        </button>
                    </span>
                ))}
            </div>

            <Input
                aria-autocomplete="list"
                aria-expanded={showDropdown}
                aria-haspopup="listbox"
                className="px-2 dark:text-white"
                classNames={{
                    inputWrapper: 'border-b-0 shadow-none after:h-0',
                    innerWrapper: 'pb-0'
                }}
                placeholder="Busca productos..."
                type="text"
                value={inputValue}
                variant="underlined"
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => {
                    if (inputValue.trim().length > 1) setShowDropdown(true);
                }}
            />


            {/* Selected tags */}


            {showDropdown && productsFilteredList.length > 0 && (
                <ul
                    className="absolute w-full z-50 max-h-48 p-2 scrollbar-hide flex flex-col gap-0.5 overflow-auto bg-white rounded-lg shadow"
                    role="listbox"
                >
                    {productsFilteredList.map((product) => (
                        <li key={product.id}>
                            <button
                                className='w-full text-left p-2 hover:bg-gray-200 hover rounded-lg'
                                type="button"
                                onClick={() => toggleProduct(product)}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                {selectedProducts.find((p) => p.id === product.id)
                                    ?
                                    <span className="flex w-full justify-between">
                                        {product.name}
                                        <Check className="text-gray-800" size={15} />
                                    </span>
                                    : product.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
