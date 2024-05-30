import { useBranchesStore } from "../../store/branches.store";
import { DataView } from "primereact/dataview";
import {
  BadgeCheck,
  BoxIcon,
  Edit,
  MapPin,
  Phone,
  Scroll,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@nextui-org/react";
import { classNames } from "primereact/utils";
import { global_styles } from "../../styles/global.styles";
import { GridProps, MobileViewProps } from "./types/mobile_view.types";

function MobileView(props: MobileViewProps) {
  const {
    layout,
    deletePopover,
    handleEdit,
    handleBranchProduct,
    handleBox,
    handleActive,
  } = props;
  const { branches_paginated } = useBranchesStore();

  return (
    <div className="w-full pb-10">
      <DataView
        value={branches_paginated.branches}
        gutter
        layout={layout}
        pt={{
          grid: () => ({
            className:
              "grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5",
          }),
        }}
        color="surface"
        itemTemplate={(item) => (
          <GridItem
            branch={item}
            layout={layout}
            deletePopover={deletePopover}
            handleEdit={handleEdit}
            handleBranchProduct={handleBranchProduct}
            handleBox={handleBox}
            handleActive={handleActive}
          />
        )}
        emptyMessage="No users found"
      />
    </div>
  );
}

export default MobileView;

const GridItem = (props: GridProps) => {
  const {
    layout,
    deletePopover,
    handleEdit,
    handleBranchProduct,
    handleBox,
    handleActive,
    branch,
  } = props;

  return (
    <>
      {layout === "grid" ? (
        <div
          className={classNames(
            "w-full shadow-sm hover:shadow-lg p-8 dark:border dark:border-gray-600 rounded-2xl"
          )}
          key={branch.id}
        >
          <div className="flex w-full gap-2">
            <Scroll className="text-[#274c77] dark:text-gray-400" size={35} />
            {branch.name}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <div>
              <MapPin className="text-[#00bbf9] dark:text-gray-400" size={35} />
            </div>
            {branch.address}
          </div>
          <div className="flex w-full gap-2 mt-3">
            <Phone className="text-[#00bbf9] dark:text-gray-400" size={35} />
            {branch.phone}
          </div>
          <div className="flex justify-between mt-5 w-ful">
            <Button
              onClick={() => handleEdit(branch)}
              isIconOnly
              style={global_styles().secondaryStyle}
            >
              <Edit />
            </Button>
            <Button
              onClick={() => handleBox(branch)}
              isIconOnly
              style={global_styles().darkStyle}
            >
              <BoxIcon />
            </Button>
            <Button
              onClick={() => {
                handleBranchProduct(branch.id);
              }}
              isIconOnly
              style={global_styles().thirdStyle}
            >
              <ShoppingBag />
            </Button>
            {branch.isActive === false && (
              <Button
                size="lg"
                onClick={() => {
                  handleActive(branch.id);
                }}
                isIconOnly
                style={global_styles().thirdStyle}
              >
                <BadgeCheck
                  onClick={() => {
                    handleActive(branch.id);
                  }}
                  size={20}
                />
              </Button>
            )}
            {deletePopover({ branch })}
          </div>
        </div>
      ) : (
        <ListItem
          handleActive={handleActive}
          branch={branch}
          layout="list"
          deletePopover={deletePopover}
          handleEdit={handleEdit}
          handleBranchProduct={handleBranchProduct}
          handleBox={handleBox}
        />
      )}
    </>
  );
};
const ListItem = (props: GridProps) => {
  const {
    branch,
    deletePopover,
    handleEdit,
    handleActive,
    handleBox,
    handleBranchProduct,
  } = props;
  return (
    <>
      <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
        <div className="w-full">
          <div className="flex items-center w-full gap-2">
            <Scroll className="text-[#274c77] dark:text-gray-400" size={35} />
            {branch.name}
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <MapPin className="text-[#00bbf9] dark:text-gray-400" size={35} />
            <div className="w-full">
              <p>{branch.address}</p>
            </div>
          </div>
          <div className="flex items-center w-full gap-2 mt-3">
            <Phone className="text-[#00bbf9] dark:text-gray-400" size={35} />
            {branch.phone}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between w-full gap-4">
          <Button
            onClick={() => handleEdit(branch)}
            isIconOnly
            style={global_styles().secondaryStyle}
          >
            <Edit />
          </Button>
          <Button
            onClick={() => handleBox(branch)}
            isIconOnly
            style={global_styles().darkStyle}
          >
            <BoxIcon />
          </Button>
          <Button
            onClick={() => {
              handleBranchProduct(branch.id);
            }}
            isIconOnly
            style={global_styles().thirdStyle}
          >
            <ShoppingBag />
          </Button>
          {branch.isActive === false && (
            <Button
              size="lg"
              onClick={() => {
                handleActive(branch.id);
              }}
              isIconOnly
              style={global_styles().thirdStyle}
            >
              <BadgeCheck
                onClick={() => {
                  handleActive(branch.id);
                }}
                size={20}
              />
            </Button>
          )}
          {deletePopover({ branch })}
        </div>
      </div>
    </>
  );
};
