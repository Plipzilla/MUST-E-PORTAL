import React from 'react';
import { useApplication } from './ApplicationContext';
import './ApplicationTypeSelection.css';
import './FormStyles.css';

const ApplicationTypeSelection: React.FC = () => {
  const { setData } = useApplication();

  const handleApplicationTypeSelect = (type: 'undergraduate' | 'postgraduate') => {
    setData(prev => ({
      ...prev,
      step1: {
        ...prev.step1,
        applicationType: type
      },
      step2: {
        ...prev.step2,
        programInfo: {
          ...prev.step2.programInfo,
          levelOfStudy: type
        }
      },
      currentStep: 1 // Move to first actual form step
    }));
  };

  return (
    <div className="application-type-container">
      <div className="application-type-header">
        <h1>MUST University Application</h1>
        <p>Please select your application type to begin</p>
      </div>

      <div className="application-type-cards">
        <div 
          className="application-type-card"
          onClick={() => handleApplicationTypeSelect('undergraduate')}
        >
          <div className="card-icon">
            🎓
          </div>
          <h2>Undergraduate Application</h2>
          <p>For students applying for Bachelor's degree programmes</p>
          <div className="card-details">
            <h3>Requirements:</h3>
            <ul>
              <li>Secondary school completion (MSCE/IGCSE)</li>
              <li>Academic transcripts and certificates</li>
              <li>Application fee: MWK 10,000 / USD 100</li>
            </ul>
            <h3>Programme Categories:</h3>
            <ul>
              <li>Economic Fee Paying</li>
              <li>ODeL (Distance Learning)</li>
              <li>Mature Entry</li>
              <li>Weekend Classes</li>
            </ul>
          </div>
          <button className="btn btn-primary">
            Apply for Undergraduate
          </button>
        </div>

        <div 
          className="application-type-card"
          onClick={() => handleApplicationTypeSelect('postgraduate')}
        >
          <div className="card-icon">
            🎯
          </div>
          <h2>Postgraduate Application</h2>
          <p>For students applying for Master's or PhD programmes</p>
          <div className="card-details">
            <h3>Requirements:</h3>
            <ul>
              <li>Bachelor's degree or equivalent</li>
              <li>Academic transcripts and certificates</li>
              <li>Work experience documentation</li>
              <li>Motivation statement and research concept</li>
              <li>Application fee: MWK 10,000 / USD 50</li>
            </ul>
            <h3>Study Methods:</h3>
            <ul>
              <li>Full-time</li>
              <li>Part-time</li>
            </ul>
          </div>
          <button className="btn btn-primary">
            Apply for Postgraduate
          </button>
        </div>
      </div>

      <div className="application-type-info">
        <div className="info-card">
          <h3>📋 Application Process</h3>
          <p>Once you select your application type, you'll be guided through a step-by-step form tailored specifically for your chosen programme level.</p>
        </div>
        
        <div className="info-card">
          <h3>💰 Fee Payment</h3>
          <p>Application fees must be paid before submission. You'll need to upload your deposit slip as part of the application process.</p>
        </div>
        
        <div className="info-card">
          <h3>📞 Need Help?</h3>
          <p>If you're unsure which application type to choose, contact the MUST admissions office for guidance.</p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationTypeSelection; 