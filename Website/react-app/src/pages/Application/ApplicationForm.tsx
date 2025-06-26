import React, { useEffect, useState } from 'react';
import { ApplicationProvider, useApplication, ApplicationData } from './ApplicationContext';
import PersonalInfo from './PersonalInfo';
import ContactDetails from './ContactDetails';
import AcademicBackground from './AcademicBackground';
import ProgramSelection from './ProgramSelection';
import Declaration from './Declaration';
import { useAuth } from '../../firebase/AuthContext';
import './ApplicationForm.css'; // Add a CSS file for custom styles

const steps = [
  'Personal Information',
  'Contact Details',
  'Academic Background',
  'Program Selection',
  'Declaration & Submission'
];

// Placeholder API functions
async function saveDraft(data: ApplicationData, step: number) {
  // TODO: Implement API call to POST /api/application/save-draft
  // For now, just log
  console.log('Saving draft', { data, step });
}
async function loadDraft(): Promise<{ data: ApplicationData; step: number } | null> {
  // TODO: Implement API call to GET /api/application/load-draft
  // For now, return null
  return null;
}

const Stepper: React.FC<{ current: number }> = ({ current }) => (
  <div className="stepper-container">
    <div className="stepper-bar">
      {steps.map((label, idx) => (
        <div key={label} className={`stepper-step${idx === current ? ' active' : ''}${idx < current ? ' completed' : ''}`}> 
          <div className="stepper-circle">{idx + 1}</div>
          <div className="stepper-label">{label}</div>
        </div>
      ))}
    </div>
    <div className="stepper-progress">
      <div className="stepper-progress-bar" style={{ width: `${((current + 1) / steps.length) * 100}%` }} />
    </div>
    <div className="stepper-step-label">Step {current + 1} of {steps.length}: {steps[current]}</div>
  </div>
);

const ApplicationFormInner: React.FC = () => {
  const { data, setData } = useApplication();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load draft on mount (placeholder)
    setLoading(false);
  }, []);

  const handleNext = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setStep(s => Math.max(s - 1, 0));

  const handleSaveDraft = async () => {
    if (!user) {
      alert('You must be logged in to save a draft.');
      return;
    }
    setSaving(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/application/save-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.uid,
          data,
          step
        })
      });
      if (!res.ok) throw new Error('Failed to save draft');
      alert('Draft saved successfully!');
    } catch (err) {
      alert('Error saving draft. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = () => {
    alert('Application submitted! (Submission logic to be implemented)');
  };

  if (loading) return <div>Loading draft...</div>;

  return (
    <div className="application-form">
      <Stepper current={step} />
      <div className="form-content">
        {step === 0 && <PersonalInfo onNext={handleNext} />}
        {step === 1 && <ContactDetails onNext={handleNext} />}
        {step === 2 && <AcademicBackground onNext={handleNext} />}
        {step === 3 && <ProgramSelection onNext={handleNext} />}
        {step === 4 && <Declaration onSubmit={handleSubmit} />}
      </div>
      <div className="form-navigation">
        <button className="btn-back" onClick={handleBack} disabled={step === 0}>Back</button>
        <button className="btn btn-primary" onClick={handleSaveDraft} disabled={saving}>{saving ? 'Saving...' : 'Save Draft'}</button>
        <button className="btn btn-primary" onClick={handleNext} disabled={step === steps.length - 1}>Next</button>
      </div>
    </div>
  );
};

const ApplicationForm: React.FC = () => (
  <ApplicationProvider>
    <ApplicationFormInner />
  </ApplicationProvider>
);

export default ApplicationForm; 