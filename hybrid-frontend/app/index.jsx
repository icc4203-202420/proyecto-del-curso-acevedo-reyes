import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router'; // Importa ExpoRoot para la navegación
import { StyleSheet } from 'react-native';

// probablemente esta mal hecho esto...

// Función para iniciar la aplicación con Expo Router
function App() {
  const ctx = require.context('./', true, /.*/); // Carga todas las rutas automáticamente
  return <ExpoRoot context={ctx} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

registerRootComponent(App); // Registra App como el componente raíz
