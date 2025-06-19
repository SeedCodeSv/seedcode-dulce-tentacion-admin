import ListDebitNoteComponent from "@/components/notas/notes-list/ListDebitNoteComponent";
import Layout from "@/layout/Layout";

export default function DebitNotePage () {
    return(
        <Layout title="Notas de débito">
            <ListDebitNoteComponent/>
        </Layout>
    )
}