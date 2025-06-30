import React, { useState, useRef } from 'react';
import { useApplication } from './ApplicationContext';
import './FormStyles.css';

const Step3PostgraduateWorkMotivation: React.FC = () => {
  const { data, setData, addWorkExperience, removeWorkExperience } = useApplication();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const motivationFileRef = useRef<HTMLInputElement>(null);

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'motivationEssay':
        if (!value) return 'Motivation essay is required';
        const wordCount = value.split(/\s+/).filter((word: string) => word.length > 0).length;
        if (wordCount < 500) return `Essay must be at least 500 words (currently ${wordCount})`;
        if (wordCount > 1000) return `Essay must be no more than 1000 words (currently ${wordCount})`;
        return '';
      case 'motivationFile':
        if (data.step3.motivation.uploadMotivationNote && !value) {
          return 'Please upload your research concept note';
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

  const getWordCountColor = () => {
    const count = getWordCount();
    if (count < 500) return '#dc3545'; // Red
    if (count > 1000) return '#dc3545'; // Red
    return '#28a745'; // Green
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
    <div className="form-step">
      <div className="step-header">
        <h2>Work Experience & Motivation</h2>
        <p>Provide your professional experience and detailed motivation for postgraduate study</p>
      </div>

      {/* Work Experience Section */}
      <div className="form-section">
        <h3>Professional Work Experience</h3>
        <p className="section-description">
          Please provide details of your relevant work experience. Include all professional positions, 
          internships, and volunteer work that demonstrates your qualifications for postgraduate study.
        </p>

        {data.step3.workExperience.map((experience, index) => (
          <div key={index} className="experience-card">
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
                <label htmlFor={`fromDate-${index}`} className="required">From Date</label>
                <input
                  type="date"
                  id={`fromDate-${index}`}
                  value={experience.fromDate}
                  onChange={(e) => handleWorkExperienceChange(index, 'fromDate', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`toDate-${index}`} className="required">To Date</label>
                <input
                  type="date"
                  id={`toDate-${index}`}
                  value={experience.toDate}
                  onChange={(e) => handleWorkExperienceChange(index, 'toDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`organization-${index}`} className="required">Organization/Company</label>
                <input
                  type="text"
                  id={`organization-${index}`}
                  value={experience.organization}
                  onChange={(e) => handleWorkExperienceChange(index, 'organization', e.target.value)}
                  placeholder="Enter organization name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`position-${index}`} className="required">Position/Job Title</label>
                <input
                  type="text"
                  id={`position-${index}`}
                  value={experience.position}
                  onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                  placeholder="Enter your job title"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-outline"
          onClick={addWorkExperience}
        >
          + Add Another Work Experience
        </button>
      </div>

      {/* Motivation Statement Section */}
      <div className="form-section">
        <h3>Motivation Statement</h3>
        <p className="section-description">
          Write a comprehensive motivation statement (500-1000 words) explaining your motivation for postgraduate study. 
          Include your research interests, career goals, and how this programme aligns with your professional development.
        </p>

        <div className="form-group">
          <label htmlFor="motivationEssay" className="required">
            Motivation Statement
          </label>
          <div className="textarea-container">
            <textarea
              id="motivationEssay"
              value={data.step3.motivation.motivationEssay}
              onChange={(e) => handleMotivationChange('motivationEssay', e.target.value)}
              onBlur={() => handleBlur('motivationEssay')}
              placeholder="Write your detailed motivation statement here. Include your research interests, career goals, how your work experience has prepared you for postgraduate study, and how this programme aligns with your professional development..."
              rows={15}
              className={errors.motivationEssay ? 'error' : ''}
              required
            />
            <div className="word-count" style={{ color: getWordCountColor() }}>
              {getWordCount()}/1000 words
              {getWordCount() < 500 && (
                <span className="word-count-note"> (minimum 500 words required)</span>
              )}
              {getWordCount() > 1000 && (
                <span className="word-count-note"> (maximum 1000 words exceeded)</span>
              )}
            </div>
          </div>
          {errors.motivationEssay && (
            <div className="error-message">{errors.motivationEssay}</div>
          )}
        </div>

        <div className="motivation-guidelines">
          <h4>Guidelines for Your Postgraduate Motivation Statement:</h4>
          <ul>
            <li><strong>Academic Background:</strong> Detail your undergraduate education and relevant coursework</li>
            <li><strong>Professional Experience:</strong> Explain how your work experience has prepared you for postgraduate study</li>
            <li><strong>Research Interests:</strong> Describe specific areas of research that interest you</li>
            <li><strong>Programme Alignment:</strong> Explain why this specific programme matches your goals</li>
            <li><strong>Career Objectives:</strong> Outline your long-term career aspirations</li>
            <li><strong>Research Contribution:</strong> Describe how you plan to contribute to research in your field</li>
            <li><strong>Professional Impact:</strong> Explain how this qualification will advance your career</li>
          </ul>
        </div>
      </div>

      {/* Research Concept Note Section */}
      <div className="form-section">
        <h3>Research Concept Note (Optional)</h3>
        <p className="section-description">
          For research-based programmes, you may upload a research concept note outlining your proposed research area.
        </p>

        <div className="form-group">
          <div className="checkbox-option">
            <input
              type="checkbox"
              id="uploadMotivationNote"
              checked={data.step3.motivation.uploadMotivationNote}
              onChange={(e) => handleMotivationChange('uploadMotivationNote', e.target.checked)}
            />
            <label htmlFor="uploadMotivationNote">
              I want to upload a research concept note
            </label>
          </div>
        </div>

        {data.step3.motivation.uploadMotivationNote && (
          <div className="form-group">
            <label htmlFor="motivationFile" className="required">
              Research Concept Note
            </label>
            <div className="file-upload-area">
              <input
                type="file"
                id="motivationFile"
                ref={motivationFileRef}
                onChange={handleMotivationFileUpload}
                onBlur={() => handleBlur('motivationFile')}
                accept=".pdf,.docx"
                className="file-input"
                required={data.step3.motivation.uploadMotivationNote}
              />
              <div className="file-upload-content">
                <div className="upload-icon">📎</div>
                <div className="upload-text">
                  <p>Click to upload your research concept note</p>
                  <p className="upload-hint">PDF or DOCX format, max 5MB</p>
                </div>
              </div>
            </div>
            {renderMotivationFilePreview()}
            {errors.motivationFile && (
              <div className="error-message">{errors.motivationFile}</div>
            )}
          </div>
        )}
      </div>

      <div className="form-note">
        <p><strong>Important:</strong> Your motivation statement and work experience details are crucial for postgraduate applications. 
        Ensure all information is accurate and demonstrates your readiness for advanced study.</p>
      </div>
    </div>
  );
};

export default Step3PostgraduateWorkMotivation; 