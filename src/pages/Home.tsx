import { useContext, useState } from "react";
import Button from "../components/Button";
import { ThemeContext } from "../hooks/useTheme";
import THEME from "../themes.json";
import Layout from "../layout/Layout";
import { Card } from "@nextui-org/react";
import { Check } from "lucide-react";
import NavBar from "../layout/NavBar";

function Home() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Layout>
      <>
        <div className="p-10">
          <div className="grid grid-cols-4 gap-10">
            {THEME.themes.map((themeS, index) => (
              <Card
                key={index}
                className="w-full grid grid-cols-6 shadow border"
                isPressable
                onClick={() => toggleTheme(themeS)}
              >
                <div className="absolute top-5 right-5">
                  {themeS.name === theme.name && (
                    <Check size={30} color="#fff" />
                  )}
                </div>
                <span
                  className="h-44 w-full"
                  style={{ backgroundColor: themeS.colors.danger }}
                ></span>
                <span
                  className="h-44 w-full"
                  style={{ backgroundColor: themeS.colors.warning }}
                ></span>
                <span
                  className="h-44 w-full"
                  style={{ backgroundColor: themeS.colors.primary }}
                ></span>
                <span
                  className="h-44 w-full"
                  style={{ backgroundColor: themeS.colors.secondary }}
                ></span>
                <span
                  className="h-44 w-full"
                  style={{ backgroundColor: themeS.colors.third }}
                ></span>
                <span
                  className="h-44 w-full"
                  style={{ backgroundColor: themeS.colors.dark }}
                ></span>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex gap-5">
            <Button />
          </div>
        </div>
      </>
    </Layout>
  );
}

export default Home;
