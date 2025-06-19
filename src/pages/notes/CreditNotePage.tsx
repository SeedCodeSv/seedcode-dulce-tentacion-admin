import ListCreditNoteComponent from "@/components/notas/notes-list/ListCreditNoteComponent";
import Layout from "@/layout/Layout";

export default function CreditNotePage () {
    return(
        <Layout title="Notas de crédito">
            <ListCreditNoteComponent/>
        </Layout>
    )
}