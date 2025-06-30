import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ApplicationProvider, useApplication } from './ApplicationContext';
import ApplicationTypeSelection from './ApplicationTypeSelection';
import Step1PersonalInfo from './Step1PersonalInfo';
import Step2UndergraduateEducation from './Step2UndergraduateEducation';
import Step2PostgraduateEducation from './Step2PostgraduateEducation';

import Step3PostgraduateWorkMotivation from './Step3PostgraduateWorkMotivation';
import Step4SpecialNeeds from './Step4SpecialNeeds';
import Step5RefereesDeclaration from './Step5RefereesDeclaration';
import './ApplicationForm.css';
import './FormStyles.css';

const ProgressBar: React.FC = () => {
  const { data, getStepTitle, getApplicationType, getTotalSteps } = useApplication();
  const applicationType = getApplicationType();

  // Don't show progress bar if no application type is selected
  if (!applicationType) {
    return null;
  }

  const totalSteps = getTotalSteps();
  const stepNumbers = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h2>Please fill in your information</h2>
        <p className="application-type-badge">
          {applicationType === 'undergraduate' ? 'Undergraduate Application' : 'Postgraduate Application'}
        </p>
      </div>
      <div className="progress-steps">
        {stepNumbers.map((stepNumber) => (
          <div 
            key={stepNumber} 
            className={`progress-step ${stepNumber <= data.currentStep ? 'active' : ''} ${stepNumber < data.currentStep ? 'completed' : ''}`}
          >
            <div className="step-number">{stepNumber}</div>
            <div className="step-label">{getStepTitle(stepNumber)}</div>
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
    isStepValid,
    getApplicationType,
    setData
  } = useApplication();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showStartNewOption, setShowStartNewOption] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get application type at component level
  const applicationType = getApplicationType();

  useEffect(() => {
    const initializeForm = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const startNew = urlParams.get('new') === 'true';
        
        if (startNew) {
          // User explicitly wants to start new - don't load draft
          setLoading(false);
          return;
        }
        
        await loadDraft();
        
        // Check if we loaded draft data with an application type
        // but user might want to start fresh
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          const user = JSON.parse(currentUser);
          const userId = user.uid || user.email;
          const existingDrafts = JSON.parse(localStorage.getItem('applicationDrafts') || '[]');
          const userDraft = existingDrafts.find((draft: any) => draft.userId === userId);
          
          if (userDraft && userDraft.step1?.applicationType) {
            setShowStartNewOption(true);
          }
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeForm();
  }, [loadDraft, location.search]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [data.currentStep, applicationType]);

  const handleStartNewApplication = () => {
    // Reset all data to default state
    setData({
      step1: {
        applicationType: '',
        title: '',
        surname: '',
        firstName: '',
        maritalStatus: '',
        maidenName: '',
        dateOfBirth: '',
        placeOfBirth: '',
        nationality: '',
        countryOfResidence: '',
        gender: '',
        passportPhoto: null,
        correspondenceAddress: '',
        telephoneNumbers: '',
        emailAddress: '',
        permanentAddress: '',
        showPermanentAddress: false,
      },
      step2: {
        programInfo: {
          levelOfStudy: '',
          firstChoice: '',
          secondChoice: '',
          thirdChoice: '',
          fourthChoice: '',
          methodOfStudy: '',
        },
        educationHistory: {
          schoolName: '',
          schoolFromDate: '',
          schoolToDate: '',
          subjectsStudied: '',
          examinationYear: '',
          resultsYear: '',
          gradesAchieved: '',
          universityCollege: '',
          uniFromDate: '',
          uniToDate: '',
          programme: '',
          qualification: '',
          dateOfAward: '',
          classOfAward: '',
        },
      },
      step3: {
        workExperience: [],
        motivation: {
          motivationEssay: '',
          uploadMotivationNote: false,
          motivationFile: null,
        },
      },
      step4: {
        hasDisability: false,
        disabilityDescription: '',
      },
      step5: {
        referees: [
          { name: '', position: '', institution: '', address: '', email: '' },
          { name: '', position: '', institution: '', address: '', email: '' },
        ],
        declaration: {
          declarationAgreed: false,
          fullName: '',
          date: new Date().toISOString().split('T')[0],
          allSectionsCompleted: false,
          allDocumentsUploaded: false,
          depositSlipAttached: false,
        },
      },
      currentStep: 0, // Set to 0 to force showing type selection
      lastSaved: '',
    });
    setShowStartNewOption(false);
  };

  const handleNext = () => {
    if (!applicationType) return; // Can't proceed without application type
    
    const maxSteps = applicationType === 'undergraduate' ? 4 : 5;
    if (isStepValid(data.currentStep)) {
      updateStep(Math.min(data.currentStep + 1, maxSteps));
    }
  };

  const handleBack = () => {
    if (!applicationType) return; // Can't go back from type selection
    
    updateStep(Math.max(data.currentStep - 1, 1));
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await saveDraft();
      // Show a temporary success message instead of alert
      const successMsg = document.createElement('div');
      successMsg.textContent = 'Draft saved successfully!';
      successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      document.body.appendChild(successMsg);
      setTimeout(() => {
        document.body.removeChild(successMsg);
      }, 3000);
    } catch (error) {
      alert('Error saving draft. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    const maxSteps = applicationType === 'undergraduate' ? 4 : 5;
    if (!isStepValid(maxSteps)) {
      alert('Please complete all required fields before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        alert('Please log in to submit your application.');
        return;
      }

      const user = JSON.parse(currentUser);
      const userId = user.uid || user.email;
      
      // Create application submission data
      const submissionData = {
        id: `app_${userId}_${Date.now()}`,
        userId: userId,
        ...data,
        programTitle: data.step2.programInfo.firstChoice,
        faculty: getFacultyFromProgram(data.step2.programInfo.firstChoice),
        submittedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        status: 'submitted',
        applicationId: `MUST-APP-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`
      };

      // Save to submitted applications in localStorage
      const existingSubmitted = JSON.parse(localStorage.getItem('submittedApplications') || '[]');
      existingSubmitted.push(submissionData);
      localStorage.setItem('submittedApplications', JSON.stringify(existingSubmitted));

      // Remove draft after successful submission
      const existingDrafts = JSON.parse(localStorage.getItem('applicationDrafts') || '[]');
      const filteredDrafts = existingDrafts.filter((draft: any) => draft.userId !== userId);
      localStorage.setItem('applicationDrafts', JSON.stringify(filteredDrafts));

      alert('Application submitted successfully!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      alert('Error submitting application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getFacultyFromProgram = (programName: string): string => {
    // Map program names to faculties - this should match your actual program structure
    if (programName.includes('Computer Science') || programName.includes('Information Technology')) {
      return 'Malawi Institute of Technology';
    } else if (programName.includes('Environmental') || programName.includes('Climate') || programName.includes('Earth')) {
      return 'Ndata School of Climate and Earth Sciences';
    } else if (programName.includes('Cultural') || programName.includes('Heritage')) {
      return 'Bingu School of Culture and Heritage';
    } else if (programName.includes('Medicine') || programName.includes('Medical') || programName.includes('Biomedical')) {
      return 'Academy of Medical Sciences';
    }
    return 'Not specified';
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
    // Show application type selection if no type is selected OR currentStep is 0
    if (!applicationType || data.currentStep === 0) {
      return <ApplicationTypeSelection />;
    }

    switch (data.currentStep) {
      case 1:
        return <Step1PersonalInfo />;
      case 2:
        return applicationType === 'undergraduate' ? 
          <Step2UndergraduateEducation /> : 
          <Step2PostgraduateEducation />;
      case 3:
        // Undergraduate skips motivation step, goes to Special Needs
        if (applicationType === 'undergraduate') {
          return <Step4SpecialNeeds />;
        } else {
          return <Step3PostgraduateWorkMotivation />;
        }
      case 4:
        // Step 4 for undergraduate is Referees, for postgraduate is Special Needs
        if (applicationType === 'undergraduate') {
          return <Step5RefereesDeclaration />;
        } else {
          return <Step4SpecialNeeds />;
        }
      case 5:
        // Only postgraduate reaches step 5 (Referees)
        return <Step5RefereesDeclaration />;
      default:
        return <Step1PersonalInfo />;
    }
  };

  return (
    <div className="application-form-container">
      {applicationType && (
        <div className="application-header">
          <h1>University Application Form</h1>
          <p>Complete all sections to submit your application</p>
        </div>
      )}

      {showStartNewOption && !applicationType && (
        <div className="start-new-banner">
          <div className="banner-content">
            <h3>Continue Previous Application or Start New?</h3>
            <p>We found a previous application draft. You can continue where you left off or start a completely new application.</p>
            <div className="banner-actions">
              <button 
                className="btn btn-outline" 
                onClick={() => setShowStartNewOption(false)}
              >
                Continue Previous
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleStartNewApplication}
              >
                Start New Application
              </button>
            </div>
          </div>
        </div>
      )}

      <ProgressBar />

      <div className="form-content">
        <div className="step-content">
          {renderCurrentStep()}

          {applicationType && (
            <div className="form-actions">
              <div className="action-left">
                <button 
                  className="btn btn-secondary" 
                  onClick={handleBack} 
                  disabled={data.currentStep === 1}
                >
                  Back
                </button>
              </div>

              <div className="action-center">
                <button 
                  className="btn btn-outline" 
                  onClick={handleSaveDraft}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
              </div>

              <div className="action-right">
                {(() => {
                  const maxSteps = applicationType === 'undergraduate' ? 4 : 5;
                  return data.currentStep < maxSteps ? (
                    <button 
                      className="btn btn-primary" 
                      onClick={handleNext}
                      disabled={!isStepValid(data.currentStep)}
                    >
                      Next
                    </button>
                  ) : (
                    <button 
                      className="btn btn-submit" 
                      onClick={handleSubmit}
                      disabled={!isStepValid(data.currentStep) || submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  );
                })()}
              </div>
            </div>
          )}
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