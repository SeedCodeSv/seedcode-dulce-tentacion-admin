
interface Props {
    onClose: () => void
}

export default function DetailBranchProduct ({onClose}: Props) {
    return (
        <div>
            <h1 className="text-lg">stock actual</h1>
            <span>90</span>
            <h1 className="text-lg">cantidad reservada</h1>
            <span>90</span>
        </div>
    )
}