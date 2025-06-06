import { ReactNode } from "react";

import ThGlobal from "./th-global";

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
  onThClick?: (header:string) => void
  renderHeader?:(header:string) => ReactNode
}

export const TableComponent: React.FC<TableProps> = ({ headers, children, className, onThClick, renderHeader}) => {

  return (
    <div
      className={`overflow-y-auto h-full custom-scrollbar mt-4 ${className || ''}`}
    >
      <table className="w-full">
        <thead className="sticky top-0 z-20">
          <tr>
            {headers.map((header, index) => (
              <ThGlobal key={index} className="text-left p-3" onClick={() =>{onThClick!(header)}}>
                 {renderHeader ? renderHeader(header) : header}
              </ThGlobal>
            ))}
          </tr>
        </thead>
        <tbody >
          {children}
        </tbody>
        
      </table>
    </div>
  );
};

