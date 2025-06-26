import React, { useRef, useState } from 'react';
import { useApplication } from './ApplicationContext';

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPE = 'application/pdf';

const AcademicBackground: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { data, setData } = useApplication();
  const academic = data.academicBackground;
  const certInputRef = useRef<HTMLInputElement>(null);
  const slipInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!academic.lastSchool.trim()) newErrors.lastSchool = 'Last school attended is required.';
    if (!academic.yearCompleted.trim()) newErrors.yearCompleted = 'Year completed is required.';
    if (academic.yearCompleted && (!/^\d{4}$/.test(academic.yearCompleted) || +academic.yearCompleted < 1900 || +academic.yearCompleted > 2099)) newErrors.yearCompleted = 'Enter a valid year (e.g. 2022).';
    if (!academic.gpa.trim()) newErrors.gpa = 'GPA/Aggregate is required.';
    if (!academic.certificates || academic.certificates.length === 0) newErrors.certificates = 'At least one certificate PDF is required.';
    if (academic.certificates && Array.from(academic.certificates).some(f => f.type !== ALLOWED_TYPE || f.size > MAX_FILE_SIZE_MB * 1024 * 1024)) newErrors.certificates = 'Certificates must be PDF and max 5MB each.';
    if (!academic.resultSlips || academic.resultSlips.length === 0) newErrors.resultSlips = 'At least one result slip PDF is required.';
    if (academic.resultSlips && Array.from(academic.resultSlips).some(f => f.type !== ALLOWED_TYPE || f.size > MAX_FILE_SIZE_MB * 1024 * 1024)) newErrors.resultSlips = 'Result slips must be PDF and max 5MB each.';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      academicBackground: {
        ...prev.academicBackground,
        [name]: value
      }
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files) return;
    const validFiles = Array.from(files).filter(f => f.type === ALLOWED_TYPE && f.size <= MAX_FILE_SIZE_MB * 1024 * 1024);
    setData(prev => ({
      ...prev,
      academicBackground: {
        ...prev.academicBackground,
        [name]: validFiles
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
        <h2>Academic Background</h2>
        <div className="form-group">
          <label>Last School Attended <span style={{color: 'red'}}>*</span></label>
          {errors.lastSchool && <div className="form-error">{errors.lastSchool}</div>}
          <input name="lastSchool" value={academic.lastSchool} onChange={handleChange} placeholder="e.g. MUST Secondary School" required />
        </div>
        <div className="form-group">
          <label>Year Completed <span style={{color: 'red'}}>*</span></label>
          {errors.yearCompleted && <div className="form-error">{errors.yearCompleted}</div>}
          <input name="yearCompleted" type="number" min="1900" max="2099" value={academic.yearCompleted} onChange={handleChange} placeholder="e.g. 2022" required />
        </div>
        <div className="form-group">
          <label>GPA / Aggregate <span style={{color: 'red'}}>*</span></label>
          {errors.gpa && <div className="form-error">{errors.gpa}</div>}
          <input name="gpa" value={academic.gpa} onChange={handleChange} placeholder="e.g. 4.0 or 350/500" required />
        </div>
        <div className="form-group">
          <label>Certificates (PDF, max 5MB each) <span style={{color: 'red'}}>*</span></label>
          {errors.certificates && <div className="form-error">{errors.certificates}</div>}
          <input ref={certInputRef} name="certificates" type="file" accept="application/pdf" multiple onChange={handleFileChange} />
          <small>Accepted: PDF only, max 5MB per file.</small>
          <ul>
            {academic.certificates && Array.from(academic.certificates).map((file: File, idx: number) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        </div>
        <div className="form-group">
          <label>Result Slips (PDF, max 5MB each) <span style={{color: 'red'}}>*</span></label>
          {errors.resultSlips && <div className="form-error">{errors.resultSlips}</div>}
          <input ref={slipInputRef} name="resultSlips" type="file" accept="application/pdf" multiple onChange={handleFileChange} />
          <small>Accepted: PDF only, max 5MB per file.</small>
          <ul>
            {academic.resultSlips && Array.from(academic.resultSlips).map((file: File, idx: number) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        </div>
        <button type="submit" style={{display: 'none'}} aria-hidden />
      </form>
    </div>
  );
};

export default AcademicBackground; 