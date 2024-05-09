import { useContext } from "react";
import Button from "../components/Button";
import { Theme, ThemeContext } from "../hooks/useTheme";
import THEME from "../themes.json";
import Layout from "../layout/Layout";
import { Card } from "@nextui-org/react";
import { Check } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { MyDocument } from "./Invoice";

function Home() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleSaveToPC = async () => {
    const blob = await pdf(<MyDocument />).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "filename.pdf";
    link.href = url;
    link.click();

    // const fileData = JSON.stringify(THEME);
    // const blob = new Blob([fileData], {type: "text/plain"});
    // console.log(blob)
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.download = 'filename.json';
    // link.href = url;
    // link.click();
  };

  return (
    <Layout title="Home">
      <>
        <div className="w-full h-full p-5 bg-gray-50 dark:bg-gray-800">
          <div className="grid grid-cols-4 gap-10">
            {THEME.themes.map((themeS, index) => (
              <Card
                key={index}
                className="grid w-full grid-cols-6 border shadow"
                isPressable
                onClick={() => toggleTheme(themeS as Theme)}
              >
                <div className="absolute top-5 right-5">
                  {themeS.name === theme.name && (
                    <Check size={30} color="#fff" />
                  )}
                </div>
                <span
                  className="w-full h-44"
                  style={{ backgroundColor: themeS.colors.danger }}
                ></span>
                <span
                  className="w-full h-44"
                  style={{ backgroundColor: themeS.colors.warning }}
                ></span>
                <span
                  className="w-full h-44"
                  style={{ backgroundColor: themeS.colors.primary }}
                ></span>
                <span
                  className="w-full h-44"
                  style={{ backgroundColor: themeS.colors.secondary }}
                ></span>
                <span
                  className="w-full h-44"
                  style={{ backgroundColor: themeS.colors.third }}
                ></span>
                <span
                  className="w-full h-44"
                  style={{ backgroundColor: themeS.colors.dark }}
                ></span>
              </Card>
            ))}
          </div>

          <div className="flex gap-5 mt-10">
            <Button />
          </div>
          <button onClick={handleSaveToPC}>Guardar</button>
        </div>
      </>
    </Layout>
  );
}

export default Home;
