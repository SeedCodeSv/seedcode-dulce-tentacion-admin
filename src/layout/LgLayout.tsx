interface Props {
    items: () => JSX.Element;
  }
  
  export const LgLayout = ({ items }: Props) => {
    return (
      <div className="fixed z-50 w-64 h-screen bg-white shadow-2xl">
        {items()}
      </div>
    );
  };
  