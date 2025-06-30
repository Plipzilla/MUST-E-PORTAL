import React, { useEffect, useState } from 'react';
import { AuthDebugService } from '../services/AuthDebugService';
import { history } from '../services/history';

interface RefreshEvent {
  timestamp: string;
  type: 'beforeunload' | 'unload' | 'popstate' | 'hashchange' | 'navigation';
  details: string;
  stackTrace?: string;
}

// The main debug component for API testing
const AuthDebugComponent: React.FC = () => {
  const [debugResults, setDebugResults] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const runDebugTest = async () => {
    setTesting(true);
    try {
      console.log('🚀 Starting Authentication Debug Test...');
      const results = await AuthDebugService.testConnection();
      setDebugResults(results);
      console.log('📋 Debug Results:', results);
    } catch (error: any) {
      setDebugResults({ error: error.message });
      console.error('📋 Debug Error:', error);
    } finally {
      setTesting(false);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      left: '10px', 
      background: 'white', 
      border: '2px solid #007bff', 
      borderRadius: '8px', 
      padding: '15px', 
      zIndex: 9999,
      maxWidth: '300px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>🔧 Auth Debug</h4>
      
      <button 
        onClick={runDebugTest}
        disabled={testing}
        style={{
          background: testing ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: testing ? 'not-allowed' : 'pointer'
        }}
      >
        {testing ? 'Testing...' : 'Test API Connection'}
      </button>
      
      {debugResults && (
        <div style={{ marginTop: '10px', fontSize: '12px' }}>
          <strong>Results:</strong><br/>
          {debugResults.error ? (
            <span style={{ color: 'red' }}>❌ Error: {debugResults.error}</span>
          ) : (
            <>
              <div>Health: {debugResults.health === 200 ? '✅' : '❌'} {debugResults.health}</div>
              <div>Register: {debugResults.registration === 201 ? '✅' : '❌'} {debugResults.registration}</div>
              <div>Login: {debugResults.login === 200 ? '✅' : '❌'} {debugResults.login}</div>
            </>
          )}
          <div style={{ marginTop: '5px', fontSize: '10px', color: '#666' }}>
            Check browser console for details
          </div>
        </div>
      )}
    </div>
  );
};

// Page refresh monitor component
const PageRefreshMonitor: React.FC = () => {
  const [refreshEvents, setRefreshEvents] = useState<RefreshEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (!isMonitoring) return;

    console.log('🔍 REFRESH MONITOR - Starting comprehensive page refresh monitoring...');

    const addEvent = (type: RefreshEvent['type'], details: string, includeStack = true) => {
      const event: RefreshEvent = {
        timestamp: new Date().toISOString(),
        type,
        details,
        stackTrace: includeStack ? new Error().stack : undefined
      };
      
      console.warn(`🚨 REFRESH DETECTED - ${type}: ${details}`);
      if (includeStack) {
        console.trace(`🚨 REFRESH STACK TRACE - ${type}:`);
      }
      
      setRefreshEvents(prev => [...prev, event]);
    };

    // Monitor beforeunload (page refresh/close)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      addEvent('beforeunload', 'Page is about to refresh/close');
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      console.log('🔍 REFRESH MONITOR - Stopped monitoring');
    };
  }, [isMonitoring]);

  const clearEvents = () => {
    setRefreshEvents([]);
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: 10,
      borderRadius: 5,
      fontSize: 12,
      maxWidth: 400,
      maxHeight: 300,
      overflow: 'auto',
      zIndex: 9998,
      fontFamily: 'monospace'
    }}>
      <div style={{ marginBottom: 10 }}>
        <strong>🔍 Page Refresh Monitor</strong>
        <br />
        <button 
          onClick={() => setIsMonitoring(!isMonitoring)}
          style={{ 
            background: isMonitoring ? 'red' : 'green', 
            color: 'white', 
            border: 'none', 
            padding: 5, 
            marginRight: 5,
            cursor: 'pointer'
          }}
        >
          {isMonitoring ? 'Stop' : 'Start'} Monitoring
        </button>
        <button 
          onClick={clearEvents}
          style={{ 
            background: 'blue', 
            color: 'white', 
            border: 'none', 
            padding: 5,
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      </div>
      
      {refreshEvents.length > 0 && (
        <div>
          <strong>Events Detected: {refreshEvents.length}</strong>
          {refreshEvents.slice(-3).map((event, index) => (
            <div key={index} style={{ 
              margin: 5, 
              padding: 5, 
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 3 
            }}>
              <div><strong>{event.type}</strong> at {new Date(event.timestamp).toLocaleTimeString()}</div>
              <div>{event.details}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Navigation status checker
const HistoryStatus: React.FC = () => {
  const [historyStatus, setHistoryStatus] = useState('Checking...');

  useEffect(() => {
    const checkHistory = () => {
      if (history.navigate && history.location) {
        setHistoryStatus('✅ History helper initialized and ready');
      } else {
        setHistoryStatus('❌ History helper not yet initialized');
      }
    };

    checkHistory();
    const interval = setInterval(checkHistory, 1000);

    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: 10,
      borderRadius: 5,
      fontSize: 12,
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <strong>🔧 Navigation Status:</strong><br />
      {historyStatus}<br />
      <small>Location: {history.location?.pathname || 'N/A'}</small>
    </div>
  );
};

// Export components
export default AuthDebugComponent;
export { PageRefreshMonitor, HistoryStatus }; 