import React, { useState, useRef } from 'react';
import { useApplication } from './ApplicationContext';
import './Step1PersonalInfo.css';

const Step1PersonalInfo: React.FC = () => {
  const { data, setData } = useApplication();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'title':
        return !value ? 'Title is required' : '';
      case 'firstName':
        if (!value) return 'First name is required';
        if (!/^[A-Za-z\s]+$/.test(value)) return 'First name must contain only letters';
        if (value.length > 50) return 'First name must be 50 characters or less';
        return '';
      case 'surname':
        if (!value) return 'Surname is required';
        if (!/^[A-Za-z\s]+$/.test(value)) return 'Surname must contain only letters';
        if (value.length > 50) return 'Surname must be 50 characters or less';
        return '';
      case 'nationality':
        return !value ? 'Nationality is required' : '';
      case 'countryOfResidence':
        return !value ? 'Country of residence is required' : '';
      case 'dateOfBirth':
        if (!value) return 'Date of birth is required';
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 16) return 'You must be at least 16 years old';
        return '';
      case 'placeOfBirth':
        return !value ? 'Place of birth is required' : '';
      case 'gender':
        return !value ? 'Gender is required' : '';
      case 'passportPhoto':
        return !value ? 'Passport photo is required' : '';
      case 'correspondenceAddress':
        if (!value) return 'Address for correspondence is required';
        if (value.length < 10) return 'Address must be at least 10 characters';
        return '';
      case 'telephoneNumbers':
        if (!value) return 'Telephone number is required';
        if (!/^[\+]?[0-9\s\-\(\)]+$/.test(value)) return 'Please enter a valid phone number';
        return '';
      case 'emailAddress':
        if (!value) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setData(prev => ({
      ...prev,
      step1: {
        ...prev.step1,
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          passportPhoto: 'Please upload a JPG or PNG file'
        }));
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          passportPhoto: 'File size must be less than 5MB'
        }));
        return;
      }

      setData(prev => ({
        ...prev,
        step1: {
          ...prev.step1,
          passportPhoto: file
        }
      }));

      setErrors(prev => ({
        ...prev,
        passportPhoto: ''
      }));
    }
  };

  const handleBlur = (field: string) => {
    const value = data.step1[field as keyof typeof data.step1];
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const renderFilePreview = () => {
    if (!data.step1.passportPhoto) return null;

    return (
      <div className="file-preview">
        <img 
          src={URL.createObjectURL(data.step1.passportPhoto)} 
          alt="Passport photo preview" 
          className="photo-preview"
        />
        <div className="file-info">
          <span className="file-name">{data.step1.passportPhoto.name}</span>
          <span className="file-size">
            {(data.step1.passportPhoto.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="step1-container">
      {/* Section A: Identity */}
      <div className="form-section">
        <h3>Section A: Identity</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <select
              id="title"
              value={data.step1.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              className={errors.title ? 'error' : ''}
            >
              <option value="">Select Title</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Miss">Miss</option>
              <option value="Ms">Ms</option>
              <option value="Rev">Rev</option>
              <option value="Other">Other</option>
            </select>
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              value={data.step1.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              className={errors.firstName ? 'error' : ''}
              maxLength={50}
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="surname">Surname *</label>
            <input
              type="text"
              id="surname"
              value={data.step1.surname}
              onChange={(e) => handleInputChange('surname', e.target.value)}
              onBlur={() => handleBlur('surname')}
              className={errors.surname ? 'error' : ''}
              maxLength={50}
            />
            {errors.surname && <span className="error-message">{errors.surname}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nationality">Nationality *</label>
            <input
              type="text"
              id="nationality"
              value={data.step1.nationality}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              onBlur={() => handleBlur('nationality')}
              className={errors.nationality ? 'error' : ''}
            />
            {errors.nationality && <span className="error-message">{errors.nationality}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="countryOfResidence">Country of Residence *</label>
            <input
              type="text"
              id="countryOfResidence"
              value={data.step1.countryOfResidence}
              onChange={(e) => handleInputChange('countryOfResidence', e.target.value)}
              onBlur={() => handleBlur('countryOfResidence')}
              className={errors.countryOfResidence ? 'error' : ''}
            />
            {errors.countryOfResidence && <span className="error-message">{errors.countryOfResidence}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="maritalStatus">Marital Status</label>
            <select
              id="maritalStatus"
              value={data.step1.maritalStatus}
              onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="maidenName">Maiden Name</label>
            <input
              type="text"
              id="maidenName"
              value={data.step1.maidenName}
              onChange={(e) => handleInputChange('maidenName', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth *</label>
            <input
              type="date"
              id="dateOfBirth"
              value={data.step1.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              onBlur={() => handleBlur('dateOfBirth')}
              className={errors.dateOfBirth ? 'error' : ''}
            />
            {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="placeOfBirth">Place of Birth *</label>
            <input
              type="text"
              id="placeOfBirth"
              value={data.step1.placeOfBirth}
              onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
              onBlur={() => handleBlur('placeOfBirth')}
              className={errors.placeOfBirth ? 'error' : ''}
            />
            {errors.placeOfBirth && <span className="error-message">{errors.placeOfBirth}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Gender *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={data.step1.gender === 'Male'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  onBlur={() => handleBlur('gender')}
                />
                <span>Male</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={data.step1.gender === 'Female'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  onBlur={() => handleBlur('gender')}
                />
                <span>Female</span>
              </label>
            </div>
            {errors.gender && <span className="error-message">{errors.gender}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="passportPhoto">Passport Photo *</label>
          <input
            ref={fileInputRef}
            type="file"
            id="passportPhoto"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="file-input"
          />
          <button
            type="button"
            className="btn-upload"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose File
          </button>
          {errors.passportPhoto && <span className="error-message">{errors.passportPhoto}</span>}
          {renderFilePreview()}
        </div>
      </div>

      {/* Section B: Contact Info */}
      <div className="form-section">
        <h3>Section B: Contact Information</h3>
        
        <div className="form-group">
          <label htmlFor="correspondenceAddress">Address for Correspondence *</label>
          <textarea
            id="correspondenceAddress"
            value={data.step1.correspondenceAddress}
            onChange={(e) => handleInputChange('correspondenceAddress', e.target.value)}
            onBlur={() => handleBlur('correspondenceAddress')}
            className={errors.correspondenceAddress ? 'error' : ''}
            rows={3}
            minLength={10}
          />
          {errors.correspondenceAddress && <span className="error-message">{errors.correspondenceAddress}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="telephoneNumbers">Telephone Number(s) *</label>
            <input
              type="tel"
              id="telephoneNumbers"
              value={data.step1.telephoneNumbers}
              onChange={(e) => handleInputChange('telephoneNumbers', e.target.value)}
              onBlur={() => handleBlur('telephoneNumbers')}
              className={errors.telephoneNumbers ? 'error' : ''}
              placeholder="+1234567890"
            />
            {errors.telephoneNumbers && <span className="error-message">{errors.telephoneNumbers}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="emailAddress">Email Address *</label>
            <input
              type="email"
              id="emailAddress"
              value={data.step1.emailAddress}
              onChange={(e) => handleInputChange('emailAddress', e.target.value)}
              onBlur={() => handleBlur('emailAddress')}
              className={errors.emailAddress ? 'error' : ''}
            />
            {errors.emailAddress && <span className="error-message">{errors.emailAddress}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={data.step1.showPermanentAddress}
              onChange={(e) => handleInputChange('showPermanentAddress', e.target.checked)}
            />
            <span>Add Permanent Address (if different from correspondence address)</span>
          </label>
        </div>

        {data.step1.showPermanentAddress && (
          <div className="form-group">
            <label htmlFor="permanentAddress">Permanent Address</label>
            <textarea
              id="permanentAddress"
              value={data.step1.permanentAddress}
              onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
              rows={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1PersonalInfo; 