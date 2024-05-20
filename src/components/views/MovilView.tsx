import { DataView } from "primereact/dataview";
import { useViewsStore } from "../../store/views.store";
import { IView } from "../../types/view.types";
import { classNames } from "primereact/utils";
import { FolderOpen } from "lucide-react";

interface Props {
    layout: "grid" | "list";
    deletePopover: ({ view }: { view: IView }) => JSX.Element;
}

function MobileView({
    layout,
}: Props) {
    const {views_list} = useViewsStore();

    return (
        <div className="w-full pb-10">
            <DataView
                value={views_list}
                gutter
                layout={layout}
                pt={{
                    grid: () => ({
                        className:
                        "grid dark:bg-slate-800 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-nogutter gap-5 mt-5",
                    })
                }}
                color="surface"
                itemTemplate={(view) => 
                    gridItem(view, layout)
                }
                emptyMessage="Modulos no encontradas"
            />
        </div>
    )
}

const gridItem = (
    views: IView,
    layout: "grid" | "list",
) => {
    return (
        <>
            {layout === "grid" ? (
                <div
                    className={classNames(
                        "w-full shadow-sm hover:shadow-lg p-8 dark:border dark:border-gray-600 rounded-2xl"
                    )}
                    key={views.id}
                >
                    <div className="flex w-full gap-2">
                        <FolderOpen color={"#274c77"} size={35}/>
                        {views.name}
                    </div>
                </div>
            ) : (
                <ListItem
                    view={views}
                />
            )}
        </>
    )
};

const ListItem = ({
    view,
} : {
    view: IView;
}) => {
    return (
        <>
            <div className="flex w-full col-span-1 p-5 border-b shadow md:col-span-2 lg:col-span-3 xl:col-span-4">
                <div  className="w-full">
                <div className="flex w-full gap-2">
                        <FolderOpen color={"#274c77"} size={35}/>
                        {view.name}
                    </div>
                </div>
            </div>
        </>
    )
};

export default MobileView;