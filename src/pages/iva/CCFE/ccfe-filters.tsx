import { Select, SelectItem } from "@heroui/react"
import { Dispatch, SetStateAction } from "react"

import { months } from "@/utils/constants"

interface Props {
  monthSelected: number
  setMonthSelected: Dispatch<SetStateAction<number>>
  year: string
  setYear: Dispatch<SetStateAction<string>>
}
function CcfeFilters({ monthSelected, setMonthSelected, year, setYear }: Props) {
  const years = [new Date().getFullYear().toString(), (new Date().getFullYear() - 1).toString()]

  return (
    <div className="flex justify-between gap-5">
      <Select
        className="w-full"
        classNames={{ label: "font-semibold" }}
        label="Meses"
        labelPlacement="outside"
        selectedKeys={[`${monthSelected}`]}
        variant="bordered"
        onSelectionChange={(key) => {
          if (key) {
            setMonthSelected(Number(new Set(key).values().next().value))
          }
        }}
      >
        {months.map((month) => (
          <SelectItem key={month.value}>
            {month.name}
          </SelectItem>
        ))}
      </Select>
      <Select
        className="w-full"
        classNames={{ label: "font-semibold" }}
        label="Año"
        labelPlacement="outside"
        selectedKeys={[`${year}`]}
        variant="bordered"
        onSelectionChange={(key) => {
          if (key) {
            setYear(String(key.currentKey))
          }
        }}
      >
        {years.map((month) => (
          <SelectItem key={month}>
            {month}
          </SelectItem>
        ))}
      </Select>
    </div>
  )
}

export default CcfeFilters
