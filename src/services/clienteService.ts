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
    let data = await response.json();
    
    // Procesamiento real de datos
    if (Array.isArray(data)) {
      // Validar y procesar cada cliente
      data = data.map((item: any) => ({
        ...item,
        processed: true,
      }));
    }
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

  // Obtener paint entries que ya ocurrieron
  const paintEntries = performance.getEntriesByType('paint');
  if (paintEntries.length > 0) {
    const lastPaint = paintEntries[paintEntries.length - 1];
    metricas.renderingPainting = lastPaint.duration || 0;
  }

  // También buscar el LCP (Largest Contentful Paint)
  const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
  if (lcpEntries.length > 0) {
    const lastLCP = lcpEntries[lcpEntries.length - 1] as any;
    metricas.renderingPainting = Math.max(
      metricas.renderingPainting,
      lastLCP.startTime || 0
    );
  }

  return { clientes: clientesObtenidos, metricas };
}

export function limpiarCache(): void {
  clientesCacheLista = null;
}
