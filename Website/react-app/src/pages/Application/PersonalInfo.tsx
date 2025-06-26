import React, { useState } from 'react';
import { useApplication } from './ApplicationContext';

const requiredFields = [
  'fullName', 'dob', 'idNumber', 'gender', 'maritalStatus', 'citizenship', 'disability'
];

const PersonalInfo: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { data, setData } = useApplication();
  const personalInfo = data.personalInfo;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!personalInfo.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!personalInfo.dob) newErrors.dob = 'Date of birth is required.';
    if (personalInfo.dob && !/^\d{4}-\d{2}-\d{2}$/.test(personalInfo.dob)) newErrors.dob = 'Date of birth must be in YYYY-MM-DD format.';
    if (!personalInfo.idNumber.trim()) newErrors.idNumber = 'ID/Passport number is required.';
    if (!personalInfo.gender) newErrors.gender = 'Please select your gender.';
    if (!personalInfo.maritalStatus) newErrors.maritalStatus = 'Please select your marital status.';
    if (!personalInfo.citizenship.trim()) newErrors.citizenship = 'Citizenship is required.';
    if (!personalInfo.disability) newErrors.disability = 'Please select an option.';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="form-card">
      <form className="form-step" onSubmit={handleNext} noValidate>
        <div style={{marginBottom: 16, color: '#666', fontSize: 14}}>
          <span style={{color: 'red'}}>*</span> Required fields
        </div>
        <h2>Personal Information</h2>
        <div className="form-group">
          <label>Full Name <span style={{color: 'red'}}>*</span></label>
          {errors.fullName && <div className="form-error">{errors.fullName}</div>}
          <input name="fullName" value={personalInfo.fullName} onChange={handleChange} placeholder="e.g. Jane Doe" required />
        </div>
        <div className="form-group">
          <label>Date of Birth <span style={{color: 'red'}}>*</span></label>
          {errors.dob && <div className="form-error">{errors.dob}</div>}
          <input name="dob" type="date" value={personalInfo.dob} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>ID/Passport Number <span style={{color: 'red'}}>*</span></label>
          {errors.idNumber && <div className="form-error">{errors.idNumber}</div>}
          <input name="idNumber" value={personalInfo.idNumber} onChange={handleChange} placeholder="e.g. A1234567" required />
        </div>
        <div className="form-group">
          <label>Gender <span style={{color: 'red'}}>*</span></label>
          {errors.gender && <div className="form-error">{errors.gender}</div>}
          <select name="gender" value={personalInfo.gender} onChange={handleChange} required>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Marital Status <span style={{color: 'red'}}>*</span></label>
          {errors.maritalStatus && <div className="form-error">{errors.maritalStatus}</div>}
          <select name="maritalStatus" value={personalInfo.maritalStatus} onChange={handleChange} required>
            <option value="">Select status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Citizenship <span style={{color: 'red'}}>*</span></label>
          {errors.citizenship && <div className="form-error">{errors.citizenship}</div>}
          <input name="citizenship" value={personalInfo.citizenship} onChange={handleChange} placeholder="e.g. Malawian" required />
        </div>
        <div className="form-group">
          <label>Disability <span style={{color: 'red'}}>*</span></label>
          {errors.disability && <div className="form-error">{errors.disability}</div>}
          <select name="disability" value={personalInfo.disability} onChange={handleChange} required>
            <option value="">Select option</option>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <button type="submit" style={{display: 'none'}} aria-hidden />
      </form>
    </div>
  );
};

export default PersonalInfo; 