import { Cliente, MetricasPerfil } from '../types/cliente';

const API_URL = 'https://suggest-eclair-unpack.ngrok-free.dev/api/v1/Client';
let clientesCacheLista: { datos: Cliente[]; tiempoFetch: number } | null = null;
let bundleSizeCache: number | null = null;

function getBundleSize(): number {
  if (bundleSizeCache !== null) {
    return bundleSizeCache;
  }

  const resources = performance.getEntriesByType('resource');
  let totalSize = 0;

  for (const resource of resources) {
    const name = resource.name.toLowerCase();
    if (name.includes('.js')) {
      const perfResource = resource as PerformanceResourceTiming;
      totalSize += perfResource.transferSize || 0;
    }
  }

  bundleSizeCache = totalSize;
  return totalSize;
}

export async function obtenerClientes(): Promise<{
  clientes: Cliente[];
  metricas: MetricasPerfil;
}> {
  const metricas: MetricasPerfil = {
    scriptingTime: 0,
    transformacionDatos: 0,
    renderingPainting: 0,
    bundleSize: 0,
    cacheStatus: 'miss',
    tiempoCache: 0,
    tiempoNoCache: 0,
    timestamp: Date.now(),
  };

  const startScripting = performance.now();
  let tiempoFetchActual = 0;
  let clientesObtenidos: Cliente[] = [];

  // Verificar si está en caché
  if (clientesCacheLista) {
    clientesObtenidos = clientesCacheLista.datos;
    tiempoFetchActual = clientesCacheLista.tiempoFetch;
    metricas.cacheStatus = 'hit';
    metricas.tiempoCache = tiempoFetchActual;
  } else {
    const startFetch = performance.now();

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    const endFetch = performance.now();
    tiempoFetchActual = endFetch - startFetch;

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    const startTransformacion = performance.now();
    const data = await response.json();
    const endTransformacion = performance.now();

    metricas.transformacionDatos = endTransformacion - startTransformacion;
    metricas.cacheStatus = 'miss';
    metricas.tiempoNoCache = tiempoFetchActual;

    if (Array.isArray(data)) {
      clientesObtenidos = data;
    } else {
      throw new Error('Respuesta inesperada de la API');
    }

    if (clientesObtenidos.length > 0) {
      clientesCacheLista = {
        datos: clientesObtenidos,
        tiempoFetch: tiempoFetchActual,
      };
    }
  }

  if (clientesObtenidos.length === 0) {
    throw new Error('No hay clientes disponibles');
  }

  metricas.scriptingTime = performance.now() - startScripting;
  metricas.bundleSize = getBundleSize();

  await new Promise((resolve) => setTimeout(resolve, 0));

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (
        entry.entryType === 'paint' ||
        entry.entryType === 'largest-contentful-paint'
      ) {
        metricas.renderingPainting = entry.duration || 0;
      }
    }
  });

  observer.observe({
    entryTypes: ['paint', 'largest-contentful-paint'],
    buffered: true,
  });

  await new Promise((resolve) => setTimeout(resolve, 50));
  observer.disconnect();

  return { clientes: clientesObtenidos, metricas };
}

export function limpiarCache(): void {
  clientesCacheLista = null;
}
