import { useState, useCallback } from 'react';
import { Cliente, EstadoMetricas } from './types/cliente';
import { obtenerClientes } from './services/clienteService';
import SearchBar from './components/SearchBar';
import ClientGrid from './components/ClientGrid';
import MetricsPanel from './components/MetricsPanel';

function App() {
  const [clientes, setClientes] = useState<Cliente[] | null>(null);
  const [metricas, setMetricas] = useState<EstadoMetricas | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuscar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setClientes(null);
    setMetricas(null);

    try {
      const { clientes: clientesData, metricas: metricasData } =
        await obtenerClientes();

      setClientes(clientesData);
      setMetricas({
        scriptingTime: metricasData.scriptingTime,
        transformacionDatos: metricasData.transformacionDatos,
        renderingPainting: metricasData.renderingPainting,
        bundleSize: metricasData.bundleSize,
        cacheStatus: metricasData.cacheStatus,
        tiempoCache: metricasData.tiempoCache,
        tiempoNoCache: metricasData.tiempoNoCache,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setClientes(null);
      setMetricas(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <h1 style={{ marginBottom: '10px', color: '#333' }}>
        Búsqueda de Clientes
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Sistema de benchmarking React 19 vs Angular 19
      </p>

      <SearchBar onBuscar={handleBuscar} isLoading={isLoading} />

      <ClientGrid clientes={clientes} isLoading={isLoading} error={error} />

      <MetricsPanel metricas={metricas} />
    </div>
  );
}

export default App;
