import React, { useState } from 'react';
import { useApplication } from './ApplicationContext';
import './Step2ProgramEducation.css';

const Step2ProgramEducation: React.FC = () => {
  const { data, setData } = useApplication();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'levelOfStudy':
        return !value ? 'Level of study is required' : '';
      case 'firstChoice':
        return !value ? 'First programme choice is required' : '';
      case 'methodOfStudy':
        if (data.step2.programInfo.levelOfStudy === 'postgraduate' && !value) {
          return 'Method of study is required for postgraduate applications';
        }
        return '';
      case 'schoolName':
        if (data.step2.programInfo.levelOfStudy === 'undergraduate' && !value) {
          return 'School name is required for undergraduate applications';
        }
        return '';
      case 'schoolFromDate':
        if (data.step2.programInfo.levelOfStudy === 'undergraduate' && !value) {
          return 'From date is required';
        }
        return '';
      case 'schoolToDate':
        if (data.step2.programInfo.levelOfStudy === 'undergraduate' && !value) {
          return 'To date is required';
        }
        return '';
      case 'subjectsStudied':
        if (data.step2.programInfo.levelOfStudy === 'undergraduate' && !value) {
          return 'Subjects studied is required';
        }
        return '';
      case 'examinationYear':
        if (data.step2.programInfo.levelOfStudy === 'undergraduate' && !value) {
          return 'Examination year is required';
        }
        if (value && !/^\d{4}$/.test(value)) {
          return 'Please enter a valid 4-digit year';
        }
        return '';
      case 'resultsYear':
        if (data.step2.programInfo.levelOfStudy === 'undergraduate' && !value) {
          return 'Results year is required';
        }
        if (value && !/^\d{4}$/.test(value)) {
          return 'Please enter a valid 4-digit year';
        }
        return '';
      case 'gradesAchieved':
        if (data.step2.programInfo.levelOfStudy === 'undergraduate' && !value) {
          return 'Grades achieved is required';
        }
        return '';
      case 'universityCollege':
        if (data.step2.programInfo.levelOfStudy === 'postgraduate' && !value) {
          return 'University/College is required for postgraduate applications';
        }
        return '';
      case 'uniFromDate':
        if (data.step2.programInfo.levelOfStudy === 'postgraduate' && !value) {
          return 'From date is required';
        }
        return '';
      case 'uniToDate':
        if (data.step2.programInfo.levelOfStudy === 'postgraduate' && !value) {
          return 'To date is required';
        }
        return '';
      case 'programme':
        if (data.step2.programInfo.levelOfStudy === 'postgraduate' && !value) {
          return 'Programme is required';
        }
        return '';
      case 'qualification':
        if (data.step2.programInfo.levelOfStudy === 'postgraduate' && !value) {
          return 'Qualification is required';
        }
        return '';
      case 'dateOfAward':
        if (data.step2.programInfo.levelOfStudy === 'postgraduate' && !value) {
          return 'Date of award is required';
        }
        return '';
      case 'classOfAward':
        if (data.step2.programInfo.levelOfStudy === 'postgraduate' && !value) {
          return 'Class of award is required';
        }
        return '';
      default:
        return '';
    }
  };

  const handleProgramInfoChange = (field: string, value: any) => {
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

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleEducationChange = (field: string, value: any) => {
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

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBlur = (field: string) => {
    let value;
    if (field.includes('programInfo')) {
      const actualField = field.replace('programInfo.', '');
      value = data.step2.programInfo[actualField as keyof typeof data.step2.programInfo];
    } else {
      value = data.step2.educationHistory[field as keyof typeof data.step2.educationHistory];
    }
    
    const error = validateField(field.replace('programInfo.', ''), value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const isUndergraduate = data.step2.programInfo.levelOfStudy === 'undergraduate';
  const isPostgraduate = data.step2.programInfo.levelOfStudy === 'postgraduate';

  return (
    <div className="step2-container">
      {/* Section A: Programme */}
      <div className="form-section">
        <h3>Section A: Programme Selection</h3>
        
        <div className="form-group">
          <label>Level of Study *</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="levelOfStudy"
                value="undergraduate"
                checked={data.step2.programInfo.levelOfStudy === 'undergraduate'}
                onChange={(e) => handleProgramInfoChange('levelOfStudy', e.target.value)}
                onBlur={() => handleBlur('programInfo.levelOfStudy')}
              />
              <span>Undergraduate</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="levelOfStudy"
                value="postgraduate"
                checked={data.step2.programInfo.levelOfStudy === 'postgraduate'}
                onChange={(e) => handleProgramInfoChange('levelOfStudy', e.target.value)}
                onBlur={() => handleBlur('programInfo.levelOfStudy')}
              />
              <span>Postgraduate</span>
            </label>
          </div>
          {errors['programInfo.levelOfStudy'] && (
            <span className="error-message">{errors['programInfo.levelOfStudy']}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstChoice">1st Programme Choice *</label>
            <input
              type="text"
              id="firstChoice"
              value={data.step2.programInfo.firstChoice}
              onChange={(e) => handleProgramInfoChange('firstChoice', e.target.value)}
              onBlur={() => handleBlur('programInfo.firstChoice')}
              className={errors['programInfo.firstChoice'] ? 'error' : ''}
            />
            {errors['programInfo.firstChoice'] && (
              <span className="error-message">{errors['programInfo.firstChoice']}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="secondChoice">2nd Programme Choice</label>
            <input
              type="text"
              id="secondChoice"
              value={data.step2.programInfo.secondChoice}
              onChange={(e) => handleProgramInfoChange('secondChoice', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="thirdChoice">3rd Programme Choice</label>
            <input
              type="text"
              id="thirdChoice"
              value={data.step2.programInfo.thirdChoice}
              onChange={(e) => handleProgramInfoChange('thirdChoice', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fourthChoice">4th Programme Choice</label>
            <input
              type="text"
              id="fourthChoice"
              value={data.step2.programInfo.fourthChoice}
              onChange={(e) => handleProgramInfoChange('fourthChoice', e.target.value)}
            />
          </div>
        </div>

        {isPostgraduate && (
          <div className="form-group">
            <label htmlFor="methodOfStudy">Method of Study *</label>
            <select
              id="methodOfStudy"
              value={data.step2.programInfo.methodOfStudy}
              onChange={(e) => handleProgramInfoChange('methodOfStudy', e.target.value)}
              onBlur={() => handleBlur('programInfo.methodOfStudy')}
              className={errors['programInfo.methodOfStudy'] ? 'error' : ''}
            >
              <option value="">Select Method</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
            {errors['programInfo.methodOfStudy'] && (
              <span className="error-message">{errors['programInfo.methodOfStudy']}</span>
            )}
          </div>
        )}
      </div>

      {/* Section B: Academic Background */}
      <div className="form-section">
        <h3>Section B: Academic Background</h3>
        
        {isUndergraduate && (
          <div className="education-section">
            <h4>Secondary Education</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="schoolName">School Name *</label>
                <input
                  type="text"
                  id="schoolName"
                  value={data.step2.educationHistory.schoolName}
                  onChange={(e) => handleEducationChange('schoolName', e.target.value)}
                  onBlur={() => handleBlur('schoolName')}
                  className={errors.schoolName ? 'error' : ''}
                />
                {errors.schoolName && <span className="error-message">{errors.schoolName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="schoolFromDate">From Date *</label>
                <input
                  type="date"
                  id="schoolFromDate"
                  value={data.step2.educationHistory.schoolFromDate}
                  onChange={(e) => handleEducationChange('schoolFromDate', e.target.value)}
                  onBlur={() => handleBlur('schoolFromDate')}
                  className={errors.schoolFromDate ? 'error' : ''}
                />
                {errors.schoolFromDate && <span className="error-message">{errors.schoolFromDate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="schoolToDate">To Date *</label>
                <input
                  type="date"
                  id="schoolToDate"
                  value={data.step2.educationHistory.schoolToDate}
                  onChange={(e) => handleEducationChange('schoolToDate', e.target.value)}
                  onBlur={() => handleBlur('schoolToDate')}
                  className={errors.schoolToDate ? 'error' : ''}
                />
                {errors.schoolToDate && <span className="error-message">{errors.schoolToDate}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subjectsStudied">Subjects Studied *</label>
              <textarea
                id="subjectsStudied"
                value={data.step2.educationHistory.subjectsStudied}
                onChange={(e) => handleEducationChange('subjectsStudied', e.target.value)}
                onBlur={() => handleBlur('subjectsStudied')}
                className={errors.subjectsStudied ? 'error' : ''}
                rows={3}
                placeholder="List all subjects studied during your secondary education"
              />
              {errors.subjectsStudied && <span className="error-message">{errors.subjectsStudied}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="examinationYear">Year Examinations Written *</label>
                <input
                  type="number"
                  id="examinationYear"
                  value={data.step2.educationHistory.examinationYear}
                  onChange={(e) => handleEducationChange('examinationYear', e.target.value)}
                  onBlur={() => handleBlur('examinationYear')}
                  className={errors.examinationYear ? 'error' : ''}
                  min="1900"
                  max="2030"
                  placeholder="YYYY"
                />
                {errors.examinationYear && <span className="error-message">{errors.examinationYear}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="resultsYear">Year Results Obtained *</label>
                <input
                  type="number"
                  id="resultsYear"
                  value={data.step2.educationHistory.resultsYear}
                  onChange={(e) => handleEducationChange('resultsYear', e.target.value)}
                  onBlur={() => handleBlur('resultsYear')}
                  className={errors.resultsYear ? 'error' : ''}
                  min="1900"
                  max="2030"
                  placeholder="YYYY"
                />
                {errors.resultsYear && <span className="error-message">{errors.resultsYear}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="gradesAchieved">Grades Achieved *</label>
              <textarea
                id="gradesAchieved"
                value={data.step2.educationHistory.gradesAchieved}
                onChange={(e) => handleEducationChange('gradesAchieved', e.target.value)}
                onBlur={() => handleBlur('gradesAchieved')}
                className={errors.gradesAchieved ? 'error' : ''}
                rows={3}
                placeholder="Enter your grades for each subject"
              />
              {errors.gradesAchieved && <span className="error-message">{errors.gradesAchieved}</span>}
            </div>
          </div>
        )}

        {isPostgraduate && (
          <div className="education-section">
            <h4>Previous Higher Education</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="universityCollege">University / College *</label>
                <input
                  type="text"
                  id="universityCollege"
                  value={data.step2.educationHistory.universityCollege}
                  onChange={(e) => handleEducationChange('universityCollege', e.target.value)}
                  onBlur={() => handleBlur('universityCollege')}
                  className={errors.universityCollege ? 'error' : ''}
                />
                {errors.universityCollege && <span className="error-message">{errors.universityCollege}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="uniFromDate">From Date *</label>
                <input
                  type="date"
                  id="uniFromDate"
                  value={data.step2.educationHistory.uniFromDate}
                  onChange={(e) => handleEducationChange('uniFromDate', e.target.value)}
                  onBlur={() => handleBlur('uniFromDate')}
                  className={errors.uniFromDate ? 'error' : ''}
                />
                {errors.uniFromDate && <span className="error-message">{errors.uniFromDate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="uniToDate">To Date *</label>
                <input
                  type="date"
                  id="uniToDate"
                  value={data.step2.educationHistory.uniToDate}
                  onChange={(e) => handleEducationChange('uniToDate', e.target.value)}
                  onBlur={() => handleBlur('uniToDate')}
                  className={errors.uniToDate ? 'error' : ''}
                />
                {errors.uniToDate && <span className="error-message">{errors.uniToDate}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="programme">Programme *</label>
                <input
                  type="text"
                  id="programme"
                  value={data.step2.educationHistory.programme}
                  onChange={(e) => handleEducationChange('programme', e.target.value)}
                  onBlur={() => handleBlur('programme')}
                  className={errors.programme ? 'error' : ''}
                />
                {errors.programme && <span className="error-message">{errors.programme}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="qualification">Qualification *</label>
                <input
                  type="text"
                  id="qualification"
                  value={data.step2.educationHistory.qualification}
                  onChange={(e) => handleEducationChange('qualification', e.target.value)}
                  onBlur={() => handleBlur('qualification')}
                  className={errors.qualification ? 'error' : ''}
                />
                {errors.qualification && <span className="error-message">{errors.qualification}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dateOfAward">Date of Award *</label>
                <input
                  type="date"
                  id="dateOfAward"
                  value={data.step2.educationHistory.dateOfAward}
                  onChange={(e) => handleEducationChange('dateOfAward', e.target.value)}
                  onBlur={() => handleBlur('dateOfAward')}
                  className={errors.dateOfAward ? 'error' : ''}
                />
                {errors.dateOfAward && <span className="error-message">{errors.dateOfAward}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="classOfAward">Class of Award *</label>
                <select
                  id="classOfAward"
                  value={data.step2.educationHistory.classOfAward}
                  onChange={(e) => handleEducationChange('classOfAward', e.target.value)}
                  onBlur={() => handleBlur('classOfAward')}
                  className={errors.classOfAward ? 'error' : ''}
                >
                  <option value="">Select Class</option>
                  <option value="First Class">First Class</option>
                  <option value="Second Class Upper">Second Class Upper</option>
                  <option value="Second Class Lower">Second Class Lower</option>
                  <option value="Pass">Pass</option>
                  <option value="Distinction">Distinction</option>
                  <option value="Merit">Merit</option>
                  <option value="Other">Other</option>
                </select>
                {errors.classOfAward && <span className="error-message">{errors.classOfAward}</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step2ProgramEducation; 