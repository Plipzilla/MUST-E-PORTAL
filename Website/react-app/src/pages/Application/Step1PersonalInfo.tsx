import React, { useState, useRef } from 'react';
import { useApplication } from './ApplicationContext';
import './FormStyles.css';

const Step1PersonalInfo: React.FC = () => {
  const { data, setData } = useApplication();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'surname':
        if (!value) return 'Surname is required';
        if (!/^[A-Za-z\s]+$/.test(value)) return 'Surname must contain only letters and spaces';
        if (value.length < 2 || value.length > 50) return 'Surname must be 2-50 characters';
        return '';
      case 'firstName':
        if (!value) return 'First names are required';
        if (!/^[A-Za-z\s]+$/.test(value)) return 'First names must contain only letters and spaces';
        if (value.length < 2 || value.length > 100) return 'First names must be 2-100 characters';
        return '';
      case 'dateOfBirth':
        if (!value) return 'Date of birth is required';
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 16) return 'You must be at least 16 years old';
        return '';
      case 'placeOfBirth':
        if (!value) return 'Place of birth is required';
        if (value.length < 2 || value.length > 100) return 'Place of birth must be 2-100 characters';
        return '';
      case 'nationality':
        if (!value) return 'Nationality is required';
        if (value.length < 2 || value.length > 50) return 'Nationality must be 2-50 characters';
        return '';
      case 'countryOfResidence':
        if (!value) return 'Country of residence is required';
        if (value.length < 2 || value.length > 50) return 'Country of residence must be 2-50 characters';
        return '';
      case 'correspondenceAddress':
        if (!value) return 'Address for correspondence is required';
        if (value.length < 10 || value.length > 500) return 'Address must be 10-500 characters';
        return '';
      case 'telephoneNumbers':
        if (!value) return 'Telephone number is required';
        if (!/^[+]?[-0-9\s()]+$/.test(value)) return 'Please enter a valid phone number with country code';
        if (value.length < 10 || value.length > 15) return 'Phone number must be 10-15 digits';
        return '';
      case 'emailAddress':
        if (!value) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'passportPhoto':
        if (!value) return 'Passport photo is required';
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

  const handleBlur = (field: string) => {
    const value = data.step1[field as keyof typeof data.step1];
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          passportPhoto: 'Please upload a JPG or PNG image'
        }));
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          passportPhoto: 'Image size must be less than 2MB'
        }));
        return;
      }

      handleInputChange('passportPhoto', file);
      setErrors(prev => ({
        ...prev,
        passportPhoto: ''
      }));
    }
  };

  const renderPhotoPreview = () => {
    if (!data.step1.passportPhoto) return null;

    const photoUrl = URL.createObjectURL(data.step1.passportPhoto);
    return (
      <div className="file-preview">
        <img src={photoUrl} alt="Passport preview" className="photo-preview" />
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
    <div className="form-step">
      <div className="step-header">
        <h2>Personal Information</h2>
        <p>Please provide your personal details as they appear on your official documents</p>
      </div>

      {/* Section A: Identity */}
      <div className="form-section">
        <h3>Section A: Identity</h3>
        <p className="section-description">
          Enter your details exactly as they appear on your certificates and official documents.
        </p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title" className="required">Title</label>
            <select
              id="title"
              value={data.step1.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            >
              <option value="">Select title</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Miss">Miss</option>
              <option value="Ms">Ms</option>
              <option value="Rev">Rev</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="surname" className="required">Surname</label>
            <input
              type="text"
              id="surname"
              value={data.step1.surname}
              onChange={(e) => handleInputChange('surname', e.target.value)}
              onBlur={() => handleBlur('surname')}
              className={errors.surname ? 'error' : ''}
              placeholder="Enter your surname"
              maxLength={50}
              required
            />
            {errors.surname && <div className="error-message">{errors.surname}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="firstName" className="required">First Names</label>
            <input
              type="text"
              id="firstName"
              value={data.step1.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              className={errors.firstName ? 'error' : ''}
              placeholder="Enter all your first names"
              maxLength={100}
              required
            />
            {errors.firstName && <div className="error-message">{errors.firstName}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="maritalStatus" className="required">Marital Status</label>
            <select
              id="maritalStatus"
              value={data.step1.maritalStatus}
              onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
              required
            >
              <option value="">Select marital status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="maidenName">Maiden Name (if applicable)</label>
            <input
              type="text"
              id="maidenName"
              value={data.step1.maidenName}
              onChange={(e) => handleInputChange('maidenName', e.target.value)}
              placeholder="Enter maiden name if applicable"
              maxLength={50}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dateOfBirth" className="required">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              value={data.step1.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              onBlur={() => handleBlur('dateOfBirth')}
              className={errors.dateOfBirth ? 'error' : ''}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
              required
            />
            {errors.dateOfBirth && <div className="error-message">{errors.dateOfBirth}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="placeOfBirth" className="required">Place of Birth</label>
            <input
              type="text"
              id="placeOfBirth"
              value={data.step1.placeOfBirth}
              onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
              onBlur={() => handleBlur('placeOfBirth')}
              className={errors.placeOfBirth ? 'error' : ''}
              placeholder="District and town/village"
              maxLength={100}
              required
            />
            {errors.placeOfBirth && <div className="error-message">{errors.placeOfBirth}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nationality" className="required">Nationality</label>
            <input
              type="text"
              id="nationality"
              value={data.step1.nationality}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              onBlur={() => handleBlur('nationality')}
              className={errors.nationality ? 'error' : ''}
              placeholder="e.g., Malawian"
              maxLength={50}
              required
            />
            {errors.nationality && <div className="error-message">{errors.nationality}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="countryOfResidence" className="required">Country of Residence</label>
            <input
              type="text"
              id="countryOfResidence"
              value={data.step1.countryOfResidence}
              onChange={(e) => handleInputChange('countryOfResidence', e.target.value)}
              onBlur={() => handleBlur('countryOfResidence')}
              className={errors.countryOfResidence ? 'error' : ''}
              placeholder="e.g., Malawi"
              maxLength={50}
              required
            />
            {errors.countryOfResidence && <div className="error-message">{errors.countryOfResidence}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gender" className="required">Gender</label>
            <div className="radio-group horizontal">
              <div className="radio-option">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="Male"
                  checked={data.step1.gender === 'Male'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                />
                <label htmlFor="male">Male</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="Female"
                  checked={data.step1.gender === 'Female'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                />
                <label htmlFor="female">Female</label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="passportPhoto" className="required">Passport Photo</label>
            <div className="file-upload-area">
              <input
                type="file"
                id="passportPhoto"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                onBlur={() => handleBlur('passportPhoto')}
                accept="image/jpeg,image/jpg,image/png"
                className="file-input"
                required
              />
              <div className="file-upload-content">
                <div className="upload-icon">📷</div>
                <div className="upload-text">
                  <p>Click to upload passport photo</p>
                  <p className="upload-hint">JPG or PNG format, max 2MB</p>
                </div>
              </div>
            </div>
            {renderPhotoPreview()}
            {errors.passportPhoto && <div className="error-message">{errors.passportPhoto}</div>}
          </div>
        </div>
      </div>

      {/* Section B: Contact Information */}
      <div className="form-section">
        <h3>Section B: Contact Information</h3>
        <p className="section-description">
          Provide accurate contact details where we can reach you regarding your application.
        </p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="correspondenceAddress" className="required">Address for Correspondence</label>
            <textarea
              id="correspondenceAddress"
              value={data.step1.correspondenceAddress}
              onChange={(e) => handleInputChange('correspondenceAddress', e.target.value)}
              onBlur={() => handleBlur('correspondenceAddress')}
              className={errors.correspondenceAddress ? 'error' : ''}
              placeholder="Include P.O. Box or full physical address"
              rows={3}
              maxLength={500}
              required
            />
            {errors.correspondenceAddress && <div className="error-message">{errors.correspondenceAddress}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="telephoneNumbers" className="required">Telephone Number(s)</label>
            <input
              type="tel"
              id="telephoneNumbers"
              value={data.step1.telephoneNumbers}
              onChange={(e) => handleInputChange('telephoneNumbers', e.target.value)}
              onBlur={() => handleBlur('telephoneNumbers')}
              className={errors.telephoneNumbers ? 'error' : ''}
              placeholder="Include country code (e.g., +265 888 123 456)"
              maxLength={15}
              required
            />
            {errors.telephoneNumbers && <div className="error-message">{errors.telephoneNumbers}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="emailAddress" className="required">Email Address</label>
            <input
              type="email"
              id="emailAddress"
              value={data.step1.emailAddress}
              onChange={(e) => handleInputChange('emailAddress', e.target.value)}
              onBlur={() => handleBlur('emailAddress')}
              className={errors.emailAddress ? 'error' : ''}
              placeholder="Enter a valid, regularly checked email"
              required
            />
            {errors.emailAddress && <div className="error-message">{errors.emailAddress}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <div className="checkbox-option">
              <input
                type="checkbox"
                id="showPermanentAddress"
                checked={data.step1.showPermanentAddress}
                onChange={(e) => handleInputChange('showPermanentAddress', e.target.checked)}
              />
              <label htmlFor="showPermanentAddress">
                My permanent address is different from correspondence address
              </label>
            </div>
          </div>
        </div>

        {data.step1.showPermanentAddress && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="permanentAddress">Permanent Address</label>
              <textarea
                id="permanentAddress"
                value={data.step1.permanentAddress}
                onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                placeholder="Enter your permanent address"
                rows={3}
                maxLength={500}
              />
            </div>
          </div>
        )}
      </div>

      <div className="form-note">
        <p><strong>Important:</strong> All information must be accurate and match your official documents. 
        Any discrepancies may result in delays or rejection of your application.</p>
      </div>
    </div>
  );
};

export default Step1PersonalInfo; 