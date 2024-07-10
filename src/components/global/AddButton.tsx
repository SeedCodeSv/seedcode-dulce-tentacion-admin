import { Button } from "@nextui-org/react";
import { Plus } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../../hooks/useTheme";
import TooltipGlobal from "./TooltipGlobal";

interface Props {
  onClick: () => void;
}

function AddButton(props: Props) {
  const { theme } = useContext(ThemeContext);
  const { colors } = theme;

  const style = {
    backgroundColor: colors.third,
    color: colors.primary,
  };

  return (
    <>
      <Button
        onClick={props.onClick}
        endContent={<Plus size={20} />}
        style={style}
        className="hidden font-semibold md:flex"
        type="button"
      >
        Agregar nuevo
      </Button>
      <TooltipGlobal text="Agregar nuevo" color="primary">
        <Button
          type="button"
          onClick={props.onClick}
          style={style}
          className="flex font-semibold md:hidden"
          isIconOnly
        >
          <Plus />
        </Button>
      </TooltipGlobal>
    </>
  );
}

export default AddButton;
