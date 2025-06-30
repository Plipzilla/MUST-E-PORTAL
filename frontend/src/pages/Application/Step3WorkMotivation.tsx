import React, { useState, useRef } from 'react';
import { useApplication } from './ApplicationContext';
import './Step3WorkMotivation.css';

const Step3WorkMotivation: React.FC = () => {
  const { data, setData, addWorkExperience, removeWorkExperience } = useApplication();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const motivationFileRef = useRef<HTMLInputElement>(null);

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'motivationEssay':
        if (!value) return 'Motivation essay is required';
        const wordCount = value.split(/\s+/).filter((word: string) => word.length > 0).length;
        if (wordCount < 300) return `Essay must be at least 300 words (currently ${wordCount})`;
        if (wordCount > 500) return `Essay must be no more than 500 words (currently ${wordCount})`;
        return '';
      case 'motivationFile':
        if (data.step3.motivation.uploadMotivationNote && !value) {
          return 'Please upload your motivation note';
        }
        return '';
      default:
        return '';
    }
  };

  const handleMotivationChange = (field: string, value: any) => {
    setData(prev => ({
      ...prev,
      step3: {
        ...prev.step3,
        motivation: {
          ...prev.step3.motivation,
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

  const handleWorkExperienceChange = (index: number, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      step3: {
        ...prev.step3,
        workExperience: prev.step3.workExperience.map((exp, i) => 
          i === index ? { ...exp, [field]: value } : exp
        )
      }
    }));
  };

  const handleMotivationFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          motivationFile: 'Please upload a PDF or DOCX file'
        }));
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          motivationFile: 'File size must be less than 5MB'
        }));
        return;
      }

      handleMotivationChange('motivationFile', file);
      setErrors(prev => ({
        ...prev,
        motivationFile: ''
      }));
    }
  };

  const handleBlur = (field: string) => {
    let value;
    if (field === 'motivationEssay') {
      value = data.step3.motivation.motivationEssay;
    } else if (field === 'motivationFile') {
      value = data.step3.motivation.motivationFile;
    }
    
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const getWordCount = () => {
    const text = data.step3.motivation.motivationEssay;
    return text.split(/\s+/).filter((word: string) => word.length > 0).length;
  };

  const renderMotivationFilePreview = () => {
    if (!data.step3.motivation.motivationFile) return null;

    return (
      <div className="file-preview">
        <div className="file-icon">📄</div>
        <div className="file-info">
          <span className="file-name">{data.step3.motivation.motivationFile.name}</span>
          <span className="file-size">
            {(data.step3.motivation.motivationFile.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="step3-container">
      {/* Section A: Work Experience (Postgraduate Only) */}
      <div className="form-section">
        <h3>Section A: Work Experience</h3>
        <p className="section-description">
          Please provide details of your work experience. This section is particularly important for postgraduate applications.
        </p>

        {data.step3.workExperience.map((experience, index) => (
          <div key={index} className="work-experience-card">
            <div className="card-header">
              <h4>Work Experience #{index + 1}</h4>
              {data.step3.workExperience.length > 1 && (
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeWorkExperience(index)}
                >
                  ✕ Remove
                </button>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`fromDate-${index}`}>From Date *</label>
                <input
                  type="date"
                  id={`fromDate-${index}`}
                  value={experience.fromDate}
                  onChange={(e) => handleWorkExperienceChange(index, 'fromDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor={`toDate-${index}`}>To Date *</label>
                <input
                  type="date"
                  id={`toDate-${index}`}
                  value={experience.toDate}
                  onChange={(e) => handleWorkExperienceChange(index, 'toDate', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`organization-${index}`}>Organization *</label>
                <input
                  type="text"
                  id={`organization-${index}`}
                  value={experience.organization}
                  onChange={(e) => handleWorkExperienceChange(index, 'organization', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor={`position-${index}`}>Position / Nature of Work *</label>
                <input
                  type="text"
                  id={`position-${index}`}
                  value={experience.position}
                  onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn-add"
          onClick={addWorkExperience}
        >
          + Add Work Experience
        </button>
      </div>

      {/* Section B: Motivation */}
      <div className="form-section">
        <h3>Section B: Motivation</h3>
        
        <div className="form-group">
          <label htmlFor="motivationEssay">Motivation Essay *</label>
          <div className="essay-container">
            <textarea
              id="motivationEssay"
              value={data.step3.motivation.motivationEssay}
              onChange={(e) => handleMotivationChange('motivationEssay', e.target.value)}
              onBlur={() => handleBlur('motivationEssay')}
              className={`essay-textarea ${errors.motivationEssay ? 'error' : ''}`}
              rows={12}
              placeholder="Please write a motivation essay explaining why you want to study this programme, your career goals, and how this degree will help you achieve them. (300-500 words)"
            />
            <div className="word-count">
              Word count: <span className={getWordCount() < 300 || getWordCount() > 500 ? 'error' : 'success'}>{getWordCount()}</span> / 500
            </div>
          </div>
          {errors.motivationEssay && <span className="error-message">{errors.motivationEssay}</span>}
        </div>

        <div className="form-group">
          <div className="checkbox-option">
            <input
              type="checkbox"
              id="uploadMotivationNote"
              checked={data.step3.motivation.uploadMotivationNote}
              onChange={(e) => handleMotivationChange('uploadMotivationNote', e.target.checked)}
            />
            <label htmlFor="uploadMotivationNote">Upload additional motivation note (Optional)</label>
          </div>
        </div>

        {data.step3.motivation.uploadMotivationNote && (
          <div className="form-group">
            <label htmlFor="motivationFile">Upload Motivation Note</label>
            <input
              ref={motivationFileRef}
              type="file"
              id="motivationFile"
              accept=".pdf,.docx"
              onChange={handleMotivationFileUpload}
              className="file-input"
            />
            <button
              type="button"
              className="btn-upload"
              onClick={() => motivationFileRef.current?.click()}
            >
              Choose File (PDF/DOCX, max 5MB)
            </button>
            {errors.motivationFile && <span className="error-message">{errors.motivationFile}</span>}
            {renderMotivationFilePreview()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3WorkMotivation; 