import React from 'react';
import { useApplication } from './ApplicationContext';
import './FormStyles.css';

const Step2UndergraduateEducation: React.FC = () => {
  const { data, setData } = useApplication();

  const handleProgramChange = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      step2: {
        ...prev.step2,
        programInfo: {
          ...prev.step2.programInfo,
          [field]: value
        }
      }
    }));
  };

  const handleEducationChange = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      step2: {
        ...prev.step2,
        educationHistory: {
          ...prev.step2.educationHistory,
          [field]: value
        }
      }
    }));
  };

  // Undergraduate programme options
  const undergraduateProgrammes = [
    'Bachelor of Science in Computer Science',
    'Bachelor of Science in Information Technology',
    'Bachelor of Science in Software Engineering',
    'Bachelor of Business Administration',
    'Bachelor of Commerce',
    'Bachelor of Education',
    'Bachelor of Arts in English',
    'Bachelor of Science in Mathematics',
    'Bachelor of Science in Physics',
    'Bachelor of Science in Chemistry',
    'Bachelor of Science in Biology',
    'Bachelor of Science in Environmental Science',
    'Bachelor of Science in Agriculture',
    'Bachelor of Science in Civil Engineering',
    'Bachelor of Science in Electrical Engineering',
    'Bachelor of Science in Mechanical Engineering',
    'Bachelor of Science in Nursing'
  ];

  const applicationCategories = [
    'Economic Fee Paying',
    'ODeL (Open Distance and Electronic Learning)',
    'Mature Entry',
    'Weekend Classes'
  ];

  return (
    <div className="form-step">
      <div className="step-header">
        <h2>Programme Selection & Secondary Education</h2>
        <p>Select your preferred programmes and provide your secondary education details</p>
      </div>

      {/* Programme Selection */}
      <div className="form-section">
        <h3>Programme Selection</h3>
        <p className="section-description">
          Choose up to 4 programmes in order of preference. You must select at least your first choice.
        </p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstChoice" className="required">
              First Choice Programme
            </label>
            <select
              id="firstChoice"
              value={data.step2.programInfo.firstChoice}
              onChange={(e) => handleProgramChange('firstChoice', e.target.value)}
              required
            >
              <option value="">Select your first choice</option>
              {undergraduateProgrammes.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="secondChoice">Second Choice Programme</label>
            <select
              id="secondChoice"
              value={data.step2.programInfo.secondChoice}
              onChange={(e) => handleProgramChange('secondChoice', e.target.value)}
            >
              <option value="">Select your second choice (optional)</option>
              {undergraduateProgrammes.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="thirdChoice">Third Choice Programme</label>
            <select
              id="thirdChoice"
              value={data.step2.programInfo.thirdChoice}
              onChange={(e) => handleProgramChange('thirdChoice', e.target.value)}
            >
              <option value="">Select your third choice (optional)</option>
              {undergraduateProgrammes.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fourthChoice">Fourth Choice Programme</label>
            <select
              id="fourthChoice"
              value={data.step2.programInfo.fourthChoice}
              onChange={(e) => handleProgramChange('fourthChoice', e.target.value)}
            >
              <option value="">Select your fourth choice (optional)</option>
              {undergraduateProgrammes.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="applicationCategory" className="required">
              Application Category
            </label>
            <select
              id="applicationCategory"
              value={data.step2.programInfo.methodOfStudy}
              onChange={(e) => handleProgramChange('methodOfStudy', e.target.value)}
              required
            >
              <option value="">Select application category</option>
              {applicationCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Secondary Education History */}
      <div className="form-section">
        <h3>Secondary Education History</h3>
        <p className="section-description">
          Provide details about your secondary school education and examination results.
        </p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="schoolName" className="required">
              Name of Secondary School
            </label>
            <input
              type="text"
              id="schoolName"
              value={data.step2.educationHistory.schoolName}
              onChange={(e) => handleEducationChange('schoolName', e.target.value)}
              placeholder="Enter your secondary school name"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="schoolFromDate" className="required">
              From Date
            </label>
            <input
              type="date"
              id="schoolFromDate"
              value={data.step2.educationHistory.schoolFromDate}
              onChange={(e) => handleEducationChange('schoolFromDate', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="schoolToDate" className="required">
              To Date
            </label>
            <input
              type="date"
              id="schoolToDate"
              value={data.step2.educationHistory.schoolToDate}
              onChange={(e) => handleEducationChange('schoolToDate', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="subjectsStudied" className="required">
              Subjects Studied
            </label>
            <textarea
              id="subjectsStudied"
              value={data.step2.educationHistory.subjectsStudied}
              onChange={(e) => handleEducationChange('subjectsStudied', e.target.value)}
              placeholder="List all subjects studied (e.g., Mathematics, English, Physics, Chemistry, Biology, etc.)"
              rows={3}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="examinationYear" className="required">
              Year of Examination
            </label>
            <input
              type="number"
              id="examinationYear"
              value={data.step2.educationHistory.examinationYear}
              onChange={(e) => handleEducationChange('examinationYear', e.target.value)}
              placeholder="e.g., 2023"
              min="1980"
              max={new Date().getFullYear()}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="resultsYear" className="required">
              Year Results Received
            </label>
            <input
              type="number"
              id="resultsYear"
              value={data.step2.educationHistory.resultsYear}
              onChange={(e) => handleEducationChange('resultsYear', e.target.value)}
              placeholder="e.g., 2023"
              min="1980"
              max={new Date().getFullYear()}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gradesAchieved" className="required">
              Grades Achieved
            </label>
            <textarea
              id="gradesAchieved"
              value={data.step2.educationHistory.gradesAchieved}
              onChange={(e) => handleEducationChange('gradesAchieved', e.target.value)}
              placeholder="List your grades for each subject (e.g., Mathematics: A, English: B, Physics: A, etc.)"
              rows={4}
              required
            />
          </div>
        </div>
      </div>

      <div className="form-note">
        <p><strong>Note:</strong> You will need to upload certified copies of your academic certificates and transcripts in the final step.</p>
      </div>
    </div>
  );
};

export default Step2UndergraduateEducation; 