import { IExpense } from "../../types/expenses.types";

interface Props {
    expense: IExpense;
}
const Description = (props: Props) => {
    return (
        <>
            <div className="grid grid-cols-1 justify-items-center justify-center gap-4 md:mt-4 lg:mt-0 border-2 border-gray-300 p-4 rounded-md">

                <div>
                    <p>{props.expense?.description}</p>
                </div>
            </div>
        </>
    )
}
export default Description