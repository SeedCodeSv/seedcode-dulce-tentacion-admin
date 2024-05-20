import { useEffect, useState } from "react";
import { useViewsStore } from "../../store/views.store";
import { toast } from "sonner";
import { messages } from "../../utils/constants";
import { Button, Checkbox } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";

interface Props {
    onClose: () => void;
}

function AddViews(props: Props) {
    const { OnCreateView, getViews, founds } = useViewsStore();
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchViews = async () => {
            setLoading(true);
            await getViews();
            setLoading(false);
        };
        fetchViews();
    }, [getViews]);

    const selectName = (name: string, state: boolean) => {
        if (state) {
            setSelected([...selected, name]);
        } else {
            setSelected(selected.filter((n) => n !== name));
        }
    };

    const [saving, setSaving] = useState(false);

    const complete_save = () => {
        if (saving) return;
        setSaving(true);
        OnCreateView(selected.map((sel) => ({ name: sel })))
            .then(() => {
                toast.success(messages.success);
                props.onClose();
                getViews();
                setSelected([]);
            })
            .catch(() => {
                toast.warning(messages.error);
            })
            .finally(() => {
                setSaving(false);
            });
    };

    return (
        <div className="w-full">
            {loading ? (
                <div className="flex justify-center">
                    <CircularProgress size="lg" aria-label="Cargando..." />
                </div>
            ) : (
                <>
                    {founds.length > 0 ? (
                        founds.map((view) => (
                            <div key={view} className="mb-2 grid-cols-2">
                                <Checkbox
                                    size="lg"
                                    checked={selected.includes(view)}
                                    onChange={(e) => selectName(view, e.target.checked)}
                                >
                                    {view}
                                </Checkbox>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center">
                            <p>Ya han sido añadidos todos los módulos.</p>
                        </div>
                    )}

                    {selected.length > 0 && (
                        <div className="flex w-full justify-center mt-10">
                            <Button disabled={saving} onClick={complete_save}>
                                Guardar
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AddViews;
