import React, { useEffect } from "react";
import Rutas from "../Routes";
import { AuthProvider } from "../AuthContext";
import { fijarHeader } from "./comun";
import { Provider } from "react-redux";
import store from "../redux/Store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import AnimatedCursor from "react-animated-cursor";

function App() {
  useEffect(() => {
    fijarHeader();
  }, []);

  const persistor = persistStore(store);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AuthProvider>
            <AnimatedCursor
              zIndex={9999}
              innerSize={20}
              outerSize={35}
              innerScale={1}
              outerScale={2}
              outerAlpha={0}
              hasBlendMode={true}
              innerStyle={{
                backgroundColor: "var(--Lavander)",
                border: "1px solid white",
                zIndex: "9999",
              }}
              outerStyle={{
                border: "2px solid var(--Azul-petroleo)",
                zIndex: "9999",
              }}
            />
            <Rutas />
          </AuthProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
}
export default App;
