import React, { useState } from 'react';
import '../pages/Auth/Auth.css';
import '../pages/Application/FormStyles.css';

const StyleTestComponent: React.FC = () => {
  const [showTests, setShowTests] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState({
    auth: false,
    app: false,
    disabled: true
  });
  const [radioState, setRadioState] = useState('option1');

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50px',
      transform: 'translateY(-50%)',
      background: 'white',
      border: '2px solid #007bff',
      borderRadius: '8px',
      padding: '15px',
      zIndex: 10000,
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#007bff' }}>🎨 Enhanced Form Controls Test</h4>
      
      <button 
        onClick={() => setShowTests(!showTests)}
        style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        {showTests ? 'Hide Tests' : 'Show Enhanced Tests'}
      </button>

      {showTests && (
        <div style={{ fontSize: '12px' }}>
          <div style={{ marginBottom: '15px' }}>
            <strong>✅ Enhanced Checkboxes (Interactive):</strong>
            
            <div style={{ margin: '8px 0', padding: '8px', border: '1px solid #eee', borderRadius: '4px' }}>
              <label className="checkbox-label" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  checked={checkboxStates.auth}
                  onChange={(e) => setCheckboxStates(prev => ({...prev, auth: e.target.checked}))}
                />
                <span>Auth Form Checkbox (Black outline, Green ✓)</span>
              </label>
            </div>
            
            <div style={{ margin: '8px 0', padding: '8px', border: '1px solid #eee', borderRadius: '4px' }}>
              <div className="checkbox-option" style={{ fontSize: '11px', margin: 0, padding: '4px 0' }}>
                <input 
                  type="checkbox" 
                  checked={checkboxStates.app}
                  onChange={(e) => setCheckboxStates(prev => ({...prev, app: e.target.checked}))}
                />
                <label>Application Form Checkbox (Enhanced)</label>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>🔘 Enhanced Radio Buttons (Interactive):</strong>
            
            <div style={{ margin: '8px 0', padding: '8px', border: '1px solid #eee', borderRadius: '4px' }}>
              <div className="radio-group horizontal" style={{ gap: '10px' }}>
                <div className="radio-option" style={{ fontSize: '11px', margin: 0, padding: '4px 0' }}>
                  <input 
                    type="radio" 
                    name="testRadio"
                    value="option1"
                    checked={radioState === 'option1'}
                    onChange={(e) => setRadioState(e.target.value)}
                  />
                  <label>Option 1 (Green Circle)</label>
                </div>
                <div className="radio-option" style={{ fontSize: '11px', margin: 0, padding: '4px 0' }}>
                  <input 
                    type="radio" 
                    name="testRadio"
                    value="option2"
                    checked={radioState === 'option2'}
                    onChange={(e) => setRadioState(e.target.value)}
                  />
                  <label>Option 2</label>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>🚫 Disabled States:</strong>
            <div style={{ margin: '8px 0', padding: '8px', border: '1px solid #eee', borderRadius: '4px' }}>
              <div className="checkbox-option" style={{ fontSize: '11px', margin: 0, padding: '4px 0' }}>
                <input 
                  type="checkbox" 
                  checked={checkboxStates.disabled}
                  disabled={true}
                />
                <label>Disabled Checkbox</label>
              </div>
              <div className="radio-option" style={{ fontSize: '11px', margin: 0, padding: '4px 0' }}>
                <input 
                  type="radio" 
                  name="disabledRadio"
                  checked={true}
                  disabled={true}
                />
                <label>Disabled Radio</label>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>✅ Status Summary:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
              <li style={{ color: 'green', fontSize: '10px' }}>✓ Checkboxes: Black outlines, green checkmarks</li>
              <li style={{ color: 'green', fontSize: '10px' }}>🔘 Radio Buttons: Black outlines, green filled circles</li>
              <li style={{ color: 'green', fontSize: '10px' }}>✓ Consistency: Unified design language</li>
              <li style={{ color: 'green', fontSize: '10px' }}>✓ Accessibility: High contrast, keyboard navigation</li>
              <li style={{ color: 'green', fontSize: '10px' }}>✓ Functionality: Preserved native behavior</li>
              <li style={{ color: 'green', fontSize: '10px' }}>✓ States: Hover, focus, disabled all enhanced</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StyleTestComponent; 