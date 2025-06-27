import React, { useEffect, useState } from 'react';
import { ApplicationProvider, useApplication } from './ApplicationContext';
import Step1PersonalInfo from './Step1PersonalInfo';
import Step2ProgramEducation from './Step2ProgramEducation';
import Step3WorkMotivation from './Step3WorkMotivation';
import Step4SpecialNeeds from './Step4SpecialNeeds';
import Step5RefereesDeclaration from './Step5RefereesDeclaration';
import './ApplicationForm.css';

const steps = [
  'Personal & Contact Details',
  'Programme & Education History',
  'Work Experience & Motivation',
  'Special Needs & Financial Info',
  'Referees & Final Declaration'
];

const ProgressBar: React.FC = () => {
  const { getStepProgress, data } = useApplication();
  const progress = getStepProgress();

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h2>Application Progress</h2>
        <div className="progress-percentage">{Math.round(progress)}% Complete</div>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="progress-steps">
        {steps.map((step, index) => (
          <div 
            key={step} 
            className={`progress-step ${index <= data.currentStep ? 'active' : ''} ${index < data.currentStep ? 'completed' : ''}`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ApplicationFormInner: React.FC = () => {
  const { 
    data, 
    updateStep, 
    saveDraft, 
    loadDraft, 
    isStepValid /*, getStepProgress */
  } = useApplication();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const initializeForm = async () => {
      try {
        await loadDraft();
      } catch (error) {
        console.error('Failed to load draft:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeForm();
  }, [loadDraft]);

  const handleNext = () => {
    if (isStepValid(data.currentStep)) {
      updateStep(Math.min(data.currentStep + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    updateStep(Math.max(data.currentStep - 1, 0));
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow navigation to completed steps or current step
    if (stepIndex <= data.currentStep || isStepValid(stepIndex)) {
      updateStep(stepIndex);
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await saveDraft();
      alert('Draft saved successfully!');
    } catch (error) {
      alert('Error saving draft. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid(4)) {
      alert('Please complete all required fields before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/application/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Application submitted successfully!');
        // Redirect to dashboard or confirmation page
        window.location.href = '/dashboard';
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      alert('Error submitting application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your application...</p>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (data.currentStep) {
      case 0:
        return <Step1PersonalInfo />;
      case 1:
        return <Step2ProgramEducation />;
      case 2:
        return <Step3WorkMotivation />;
      case 3:
        return <Step4SpecialNeeds />;
      case 4:
        return <Step5RefereesDeclaration />;
      default:
        return <Step1PersonalInfo />;
    }
  };

  return (
    <div className="application-form-container">
      <div className="application-header">
        <h1>University Application Form</h1>
        <p>Complete all sections to submit your application</p>
      </div>

      <ProgressBar />

      <div className="form-content">
        <div className="step-content">
          <div className="step-header">
            <h2>Step {data.currentStep + 1}: {steps[data.currentStep]}</h2>
            <div className="step-status">
              {isStepValid(data.currentStep) ? (
                <span className="status-complete">✓ Complete</span>
              ) : (
                <span className="status-incomplete">⚠ Incomplete</span>
              )}
            </div>
          </div>

          {renderCurrentStep()}

          <div className="form-actions">
            <div className="action-left">
              <button 
                className="btn btn-secondary" 
                onClick={handleBack} 
                disabled={data.currentStep === 0}
              >
                ← Back
              </button>
              <button 
                className="btn btn-outline" 
                onClick={handleSaveDraft}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save & Exit'}
              </button>
            </div>

            <div className="action-right">
              {data.currentStep < steps.length - 1 ? (
                <button 
                  className="btn btn-primary" 
                  onClick={handleNext}
                  disabled={!isStepValid(data.currentStep)}
                >
                  Next Step →
                </button>
              ) : (
                <button 
                  className="btn btn-success" 
                  onClick={handleSubmit}
                  disabled={!isStepValid(data.currentStep) || submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {data.lastSaved && (
        <div className="save-status">
          Last saved: {new Date(data.lastSaved).toLocaleString()}
        </div>
      )}
    </div>
  );
};

const ApplicationForm: React.FC = () => (
  <ApplicationProvider>
    <ApplicationFormInner />
  </ApplicationProvider>
);

export default ApplicationForm; 