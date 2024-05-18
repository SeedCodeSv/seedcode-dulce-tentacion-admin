import { useEffect, useState } from "react";
import { useViewsStore } from "../../store/views.store";
import { toast } from "sonner";
import { messages } from "../../utils/constants";
import { Button, Checkbox } from "@nextui-org/react";

interface Props {
    onClose: () => void
}

function AddViews(props: Props) {
    const {OnCreateView, getViews, found} = useViewsStore();
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        getViews();
    }, [])

    const selectName = (name: string, state: boolean) => {
        if (state) {
            setSelected([...selected, name]);
        } else {
            setSelected(selected.filter((n) => n !== name));
        }
    }

    const [saving, setSaving] = useState(false);

    const complete_save = () => {
        if (saving) return;
        setSaving(true);
        OnCreateView(selected.map((sel) => ({name: sel})))
        .then(() => {
            toast.success(messages.success)
            props.onClose();
            getViews()
            setSelected([]);
        })
        .catch(() => {
            toast.warning(messages.error)
        })
        .finally(() => {
            setSaving(false);
        })
    }

    return (
        <>
            <div className="w-full mt-4">
                {found.length > 0 ? (
                    found.map((view) => (
                        <div className="mb-6">
                            <Checkbox
                                size="lg"
                                checked={false}
                                onClick={() =>
                                  selectName(view, true)
                                }
                            >
                                {view}
                            </Checkbox>

                        </div>
                    ))
                ) : (
                    <>
                    
                    </>
                )}

                {selected.length > 0 && (
                    <div className="flex w-full justify-center mt-10">
                        <Button disabled={saving} onClick={() => complete_save()}>Guardar</Button>
                    </div>
                )}

            </div>
        </>
    )
}

export default AddViews;