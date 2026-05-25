import { useCallback } from 'react';

interface SearchBarProps {
  onBuscar: () => void;
  isLoading: boolean;
}

export default function SearchBar({ onBuscar, isLoading }: SearchBarProps) {
  const handleClick = useCallback(() => {
    onBuscar();
  }, [onBuscar]);

  return (
    <div style={{ marginBottom: '20px' }}>
      <button
        onClick={handleClick}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: isLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? 'Cargando...' : 'Obtener Clientes'}
      </button>
    </div>
  );
}
