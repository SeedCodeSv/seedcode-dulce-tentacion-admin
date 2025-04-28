import { Dispatch, SetStateAction } from 'react';
import { Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";
import { PlusIcon } from 'lucide-react';

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function App(props: Props) {
  return (
    <Popover backdrop="blur" isOpen={props.isOpen} onOpenChange={(open) => props.setIsOpen(open)}>
      <PopoverTrigger>
        <Button
          className="h-10 max-w-72 bg-coffee-green text-background"
          endContent={<PlusIcon />}
          size="sm"
        >
          Agregar nuevo
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">Popover Content</div>
          <div className="text-tiny">This is the popover content</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
