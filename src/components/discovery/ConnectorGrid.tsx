import ConnectorCard from './ConnectorCard';
import { useDiscovery } from '../../hooks/useDiscovery';

export default function ConnectorGrid() {
  const { state, connectConnector, disconnectConnector, connectedCount } = useDiscovery();
  const totalDevices = state.connectors.reduce((sum, c) => sum + c.devicesDiscovered, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Platform Connectors</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {connectedCount} of {state.connectors.length} connected
            {totalDevices > 0 && <span className="text-emerald-400"> — {totalDevices} devices available</span>}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {state.connectors.map((connector) => (
          <ConnectorCard
            key={connector.id}
            connector={connector}
            onConnect={connectConnector}
            onDisconnect={disconnectConnector}
          />
        ))}
      </div>
    </div>
  );
}
