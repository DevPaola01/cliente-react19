import { EstadoMetricas } from '../types/cliente';

interface MetricsPanelProps {
  metricas: EstadoMetricas | null;
}

export default function MetricsPanel({ metricas }: MetricsPanelProps) {
  if (!metricas) {
    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          textAlign: 'center',
          color: '#999',
        }}
      >
        Las métricas aparecerán después de realizar una búsqueda
      </div>
    );
  }

  const formatMetrica = (valor: number) => valor.toFixed(2);

  return (
    <div
      style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '4px',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>
        Métricas de Rendimiento
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        <div
          style={{
            padding: '15px',
            backgroundColor: 'white',
            border: '1px solid #eee',
            borderRadius: '4px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
            Scripting Time
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            {formatMetrica(metricas.scriptingTime)}
            <span style={{ fontSize: '14px', color: '#999' }}> ms</span>
          </div>
        </div>

        <div
          style={{
            padding: '15px',
            backgroundColor: 'white',
            border: '1px solid #eee',
            borderRadius: '4px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
            Transformación de Datos
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {formatMetrica(metricas.transformacionDatos)}
            <span style={{ fontSize: '14px', color: '#999' }}> ms</span>
          </div>
        </div>

        <div
          style={{
            padding: '15px',
            backgroundColor: 'white',
            border: '1px solid #eee',
            borderRadius: '4px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
            Rendering & Painting
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
            {formatMetrica(metricas.renderingPainting)}
            <span style={{ fontSize: '14px', color: '#999' }}> ms</span>
          </div>
        </div>

        <div
          style={{
            padding: '15px',
            backgroundColor: 'white',
            border: '1px solid #eee',
            borderRadius: '4px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
            Bundle Size
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
            {(metricas.bundleSize / 1024).toFixed(2)}
            <span style={{ fontSize: '14px', color: '#999' }}> KB</span>
          </div>
        </div>

        <div
          style={{
            padding: '15px',
            backgroundColor: 'white',
            border: '1px solid #eee',
            borderRadius: '4px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
            Estado Caché
          </div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color:
                metricas.cacheStatus === 'hit'
                  ? '#28a745'
                  : '#dc3545',
            }}
          >
            {metricas.cacheStatus === 'hit' ? '✓ HIT' : '✗ MISS'}
          </div>
        </div>

        {metricas.tiempoCache > 0 && (
          <div
            style={{
              padding: '15px',
              backgroundColor: 'white',
              border: '1px solid #eee',
              borderRadius: '4px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
              Tiempo Caché (HIT)
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>
              {formatMetrica(metricas.tiempoCache)}
              <span style={{ fontSize: '14px', color: '#999' }}> ms</span>
            </div>
          </div>
        )}

        {metricas.tiempoNoCache > 0 && (
          <div
            style={{
              padding: '15px',
              backgroundColor: 'white',
              border: '1px solid #eee',
              borderRadius: '4px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
              Tiempo Fetch (MISS)
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6c757d' }}>
              {formatMetrica(metricas.tiempoNoCache)}
              <span style={{ fontSize: '14px', color: '#999' }}> ms</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
