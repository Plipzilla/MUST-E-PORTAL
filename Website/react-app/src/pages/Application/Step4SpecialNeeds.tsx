import React, { useState } from 'react';
import { useApplication } from './ApplicationContext';
import './Step4SpecialNeeds.css';

const Step4SpecialNeeds: React.FC = () => {
  const { data, setData } = useApplication();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'disabilityDescription':
        if (data.step4.hasDisability && !value) {
          return 'Please describe your disability or condition';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (field: string, value: any) => {
    setData(prev => ({
      ...prev,
      step4: {
        ...prev.step4,
        [field]: value
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

  const handleBlur = (field: string) => {
    const value = data.step4[field as keyof typeof data.step4];
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  return (
    <div className="step4-container">
      <div className="form-section">
        <h3>Special Requirements & Support</h3>
        <p className="section-description">
          The university is committed to providing equal opportunities for all students. 
          Please let us know if you have any special requirements or need additional support.
        </p>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={data.step4.hasDisability}
              onChange={(e) => handleChange('hasDisability', e.target.checked)}
            />
            <span>Do you have a disability or condition that may require special support?</span>
          </label>
        </div>

        {data.step4.hasDisability && (
          <div className="disability-section">
            <div className="form-group">
              <label htmlFor="disabilityDescription">Please describe your disability or condition *</label>
              <textarea
                id="disabilityDescription"
                value={data.step4.disabilityDescription}
                onChange={(e) => handleChange('disabilityDescription', e.target.value)}
                onBlur={() => handleBlur('disabilityDescription')}
                className={errors.disabilityDescription ? 'error' : ''}
                rows={6}
                placeholder="Please provide details about your disability or condition, including any specific support requirements you may need during your studies. This information will help us provide appropriate accommodations and support services."
              />
              {errors.disabilityDescription && (
                <span className="error-message">{errors.disabilityDescription}</span>
              )}
            </div>

            <div className="support-info">
              <h4>Support Services Available</h4>
              <ul>
                <li>Accessible learning materials and formats</li>
                <li>Assistive technology and equipment</li>
                <li>Note-taking and transcription services</li>
                <li>Extended time for examinations</li>
                <li>Accessible campus facilities</li>
                <li>Specialized academic support</li>
                <li>Counseling and mental health services</li>
              </ul>
              <p className="support-note">
                <strong>Note:</strong> Your information will be kept confidential and will only be shared with relevant support staff to ensure you receive appropriate accommodations.
              </p>
            </div>
          </div>
        )}

        {!data.step4.hasDisability && (
          <div className="no-disability-message">
            <div className="info-box">
              <h4>No Special Requirements</h4>
              <p>
                You have indicated that you do not have any special requirements. 
                If your circumstances change during your studies, you can always contact 
                the Student Support Services to discuss any accommodations you may need.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step4SpecialNeeds; 