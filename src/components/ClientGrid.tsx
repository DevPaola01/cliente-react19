import { Cliente } from '../types/cliente';

interface ClientGridProps {
  clientes: Cliente[] | null;
  isLoading: boolean;
  error: string | null;
}

export default function ClientGrid({
  clientes,
  isLoading,
  error,
}: ClientGridProps) {
  if (isLoading) {
    return (
      <div
        style={{
          padding: '20px',
          textAlign: 'center',
          fontSize: '18px',
          color: '#666',
        }}
      >
        Consultando datos...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24',
        }}
      >
        Error: {error}
      </div>
    );
  }

  if (!clientes || clientes.length === 0) {
    return (
      <div
        style={{
          padding: '20px',
          textAlign: 'center',
          color: '#999',
        }}
      >
        Haga clic en "Obtener Clientes" para ver la lista
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '20px', overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ddd',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                border: '1px solid #ddd',
                fontWeight: 'bold',
              }}
            >
              Nombre
            </th>
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                border: '1px solid #ddd',
                fontWeight: 'bold',
              }}
            >
              Identificación
            </th>
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                border: '1px solid #ddd',
                fontWeight: 'bold',
              }}
            >
              Celular
            </th>
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                border: '1px solid #ddd',
                fontWeight: 'bold',
              }}
            >
              Dirección
            </th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fafafa' : 'white' }}>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                {cliente.name}
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                {cliente.identificationNumber}
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                {cliente.phone}
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                {cliente.address}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
