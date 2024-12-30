import React, { useEffect } from "react";
import Rutas from "../Routes";
import { AuthProvider } from "../AuthContext";
import { fijarHeader } from "./comun";
import { Provider } from "react-redux";
import store from "../redux/Store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

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
            <Rutas />
          </AuthProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
}
export default App;
