import React, { useState } from 'react';
import { useApplication } from './ApplicationContext';
import './Step5RefereesDeclaration.css';

const Step5RefereesDeclaration: React.FC = () => {
  const { data, setData, addReferee, removeReferee } = useApplication();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'refereeName':
      case 'refereePosition':
      case 'refereeInstitution':
      case 'refereeAddress':
      case 'refereeEmail':
        if (!value) return 'This field is required';
        if (name === 'refereeEmail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';
      case 'declarationAgreed':
        if (!value) return 'You must agree to the declaration';
        return '';
      case 'fullName':
        if (!value) return 'Full name is required';
        return '';
      case 'allSectionsCompleted':
      case 'allDocumentsUploaded':
      case 'depositSlipAttached':
        if (!value) return 'This item must be completed';
        return '';
      default:
        return '';
    }
  };

  const handleRefereeChange = (index: number, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      step5: {
        ...prev.step5,
        referees: prev.step5.referees.map((ref, i) => 
          i === index ? { ...ref, [field]: value } : ref
        )
      }
    }));

    // Clear error when user starts typing
    const errorKey = `referee${index}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const handleDeclarationChange = (field: string, value: any) => {
    setData(prev => ({
      ...prev,
      step5: {
        ...prev.step5,
        declaration: {
          ...prev.step5.declaration,
          [field]: value
        }
      }
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBlur = (field: string, index?: number) => {
    let value;
    if (index !== undefined) {
      value = data.step5.referees[index][field as keyof typeof data.step5.referees[0]];
    } else {
      value = data.step5.declaration[field as keyof typeof data.step5.declaration];
    }
    
    const error = validateField(field, value);
    const errorKey = index !== undefined ? `referee${index}${field.charAt(0).toUpperCase() + field.slice(1)}` : field;
    
    setErrors(prev => ({
      ...prev,
      [errorKey]: error
    }));
  };

  const getValidRefereesCount = () => {
    return data.step5.referees.filter(ref => 
      ref.name && ref.position && ref.institution && ref.address && ref.email
    ).length;
  };

  return (
    <div className="step5-container">
      {/* Section A: Referees */}
      <div className="form-section">
        <h3>Section A: Referees</h3>
        <p className="section-description">
          Please provide details of at least 2 referees who can provide academic or professional references. 
          You may add up to 3 referees.
        </p>

        {data.step5.referees.map((referee, index) => (
          <div key={index} className="referee-card">
            <div className="card-header">
              <h4>Referee #{index + 1}</h4>
              {data.step5.referees.length > 2 && (
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeReferee(index)}
                >
                  ✕ Remove
                </button>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`refereeName-${index}`}>Full Name *</label>
                <input
                  type="text"
                  id={`refereeName-${index}`}
                  value={referee.name}
                  onChange={(e) => handleRefereeChange(index, 'name', e.target.value)}
                  onBlur={() => handleBlur('refereeName', index)}
                  className={errors[`referee${index}Name`] ? 'error' : ''}
                />
                {errors[`referee${index}Name`] && (
                  <span className="error-message">{errors[`referee${index}Name`]}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor={`refereePosition-${index}`}>Position *</label>
                <input
                  type="text"
                  id={`refereePosition-${index}`}
                  value={referee.position}
                  onChange={(e) => handleRefereeChange(index, 'position', e.target.value)}
                  onBlur={() => handleBlur('refereePosition', index)}
                  className={errors[`referee${index}Position`] ? 'error' : ''}
                />
                {errors[`referee${index}Position`] && (
                  <span className="error-message">{errors[`referee${index}Position`]}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor={`refereeInstitution-${index}`}>Institution / Company *</label>
              <input
                type="text"
                id={`refereeInstitution-${index}`}
                value={referee.institution}
                onChange={(e) => handleRefereeChange(index, 'institution', e.target.value)}
                onBlur={() => handleBlur('refereeInstitution', index)}
                className={errors[`referee${index}Institution`] ? 'error' : ''}
              />
              {errors[`referee${index}Institution`] && (
                <span className="error-message">{errors[`referee${index}Institution`]}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor={`refereeAddress-${index}`}>Address *</label>
              <textarea
                id={`refereeAddress-${index}`}
                value={referee.address}
                onChange={(e) => handleRefereeChange(index, 'address', e.target.value)}
                onBlur={() => handleBlur('refereeAddress', index)}
                className={errors[`referee${index}Address`] ? 'error' : ''}
                rows={3}
              />
              {errors[`referee${index}Address`] && (
                <span className="error-message">{errors[`referee${index}Address`]}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor={`refereeEmail-${index}`}>Email Address *</label>
              <input
                type="email"
                id={`refereeEmail-${index}`}
                value={referee.email}
                onChange={(e) => handleRefereeChange(index, 'email', e.target.value)}
                onBlur={() => handleBlur('refereeEmail', index)}
                className={errors[`referee${index}Email`] ? 'error' : ''}
              />
              {errors[`referee${index}Email`] && (
                <span className="error-message">{errors[`referee${index}Email`]}</span>
              )}
            </div>
          </div>
        ))}

        <div className="referee-status">
          <p>
            Valid referees: <span className={getValidRefereesCount() >= 2 ? 'success' : 'error'}>
              {getValidRefereesCount()}
            </span> / 2 minimum
          </p>
        </div>

        {data.step5.referees.length < 3 && (
          <button
            type="button"
            className="btn-add"
            onClick={addReferee}
          >
            + Add Referee
          </button>
        )}
      </div>

      {/* Section B: Declaration */}
      <div className="form-section">
        <h3>Section B: Declaration & Final Checklist</h3>
        
        <div className="declaration-box">
          <h4>Declaration</h4>
          <p>
            I hereby declare that all the information provided in this application is true, accurate, and complete to the best of my knowledge. 
            I understand that any false or misleading information may result in the rejection of my application or dismissal from the university if discovered later.
          </p>
          
          <div className="form-group">
            <div className="checkbox-option">
              <input
                type="checkbox"
                id="declarationAgreed"
                checked={data.step5.declaration.declarationAgreed}
                onChange={(e) => handleDeclarationChange('declarationAgreed', e.target.checked)}
                onBlur={() => handleBlur('declarationAgreed')}
              />
              <label htmlFor="declarationAgreed">I agree to the above declaration *</label>
            </div>
            {errors.declarationAgreed && (
              <span className="error-message">{errors.declarationAgreed}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name (as it appears on your documents) *</label>
            <input
              type="text"
              id="fullName"
              value={data.step5.declaration.fullName}
              onChange={(e) => handleDeclarationChange('fullName', e.target.value)}
              onBlur={() => handleBlur('fullName')}
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              value={data.step5.declaration.date}
              onChange={(e) => handleDeclarationChange('date', e.target.value)}
              readOnly
            />
          </div>
        </div>

        <div className="checklist-box">
          <h4>Final Checklist</h4>
          <p>Please confirm that you have completed all the following items:</p>
          
          <div className="checklist-items">
            <div className="checklist-item">
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="allSectionsCompleted"
                  checked={data.step5.declaration.allSectionsCompleted}
                  onChange={(e) => handleDeclarationChange('allSectionsCompleted', e.target.checked)}
                  onBlur={() => handleBlur('allSectionsCompleted')}
                />
                <label htmlFor="allSectionsCompleted">All sections of the application form are completed *</label>
              </div>
              {errors.allSectionsCompleted && (
                <span className="error-message">{errors.allSectionsCompleted}</span>
              )}
            </div>

            <div className="checklist-item">
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="allDocumentsUploaded"
                  checked={data.step5.declaration.allDocumentsUploaded}
                  onChange={(e) => handleDeclarationChange('allDocumentsUploaded', e.target.checked)}
                  onBlur={() => handleBlur('allDocumentsUploaded')}
                />
                <label htmlFor="allDocumentsUploaded">All required documents have been uploaded *</label>
              </div>
              {errors.allDocumentsUploaded && (
                <span className="error-message">{errors.allDocumentsUploaded}</span>
              )}
            </div>

            <div className="checklist-item">
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="depositSlipAttached"
                  checked={data.step5.declaration.depositSlipAttached}
                  onChange={(e) => handleDeclarationChange('depositSlipAttached', e.target.checked)}
                  onBlur={() => handleBlur('depositSlipAttached')}
                />
                <label htmlFor="depositSlipAttached">Application fee deposit slip has been attached *</label>
              </div>
              {errors.depositSlipAttached && (
                <span className="error-message">{errors.depositSlipAttached}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5RefereesDeclaration; 