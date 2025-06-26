import React from 'react';
import { useApplication } from './ApplicationContext';

const Declaration: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const { data, setData } = useApplication();
  const { personalInfo, contactDetails, academicBackground, programSelection, declaration } = data;

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setData(prev => ({
      ...prev,
      declaration: {
        ...prev.declaration,
        [name]: checked
      }
    }));
  };

  return (
    <div className="form-card">
      <form className="form-step" onSubmit={e => { e.preventDefault(); onSubmit(); }}>
        <h2>Declaration & Submission</h2>
        <h3>Review Your Application</h3>
        <div className="summary-section">
          <h4>Personal Information</h4>
          <ul>
            <li><b>Full Name:</b> {personalInfo.fullName}</li>
            <li><b>Date of Birth:</b> {personalInfo.dob}</li>
            <li><b>ID/Passport Number:</b> {personalInfo.idNumber}</li>
            <li><b>Gender:</b> {personalInfo.gender}</li>
            <li><b>Marital Status:</b> {personalInfo.maritalStatus}</li>
            <li><b>Citizenship:</b> {personalInfo.citizenship}</li>
            <li><b>Disability:</b> {personalInfo.disability}</li>
          </ul>
          <h4>Contact Details</h4>
          <ul>
            <li><b>Phone:</b> {contactDetails.phone}</li>
            <li><b>Alternate Phone:</b> {contactDetails.altPhone}</li>
            <li><b>Email:</b> {contactDetails.email}</li>
            <li><b>Address:</b> {contactDetails.address}</li>
            <li><b>District:</b> {contactDetails.district}</li>
            <li><b>Region:</b> {contactDetails.region}</li>
            <li><b>Next of Kin:</b> {contactDetails.nextOfKin}</li>
          </ul>
          <h4>Academic Background</h4>
          <ul>
            <li><b>Last School Attended:</b> {academicBackground.lastSchool}</li>
            <li><b>Year Completed:</b> {academicBackground.yearCompleted}</li>
            <li><b>GPA/Aggregate:</b> {academicBackground.gpa}</li>
            <li><b>Certificates:</b> {academicBackground.certificates && academicBackground.certificates.length > 0 ? academicBackground.certificates.map(f => f.name).join(', ') : 'None'}</li>
            <li><b>Result Slips:</b> {academicBackground.resultSlips && academicBackground.resultSlips.length > 0 ? academicBackground.resultSlips.map(f => f.name).join(', ') : 'None'}</li>
          </ul>
          <h4>Program Selection</h4>
          <ul>
            <li><b>Primary Program:</b> {programSelection.primaryProgram}</li>
            <li><b>Secondary Program:</b> {programSelection.secondaryProgram}</li>
            <li><b>Intake Type:</b> {programSelection.intakeType}</li>
            <li><b>Study Centre:</b> {programSelection.studyCentre}</li>
            <li><b>Learning Mode:</b> {programSelection.learningMode}</li>
          </ul>
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox" name="agreed" checked={declaration.agreed} onChange={handleCheck} required />
            I agree to the terms and conditions
          </label>
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox" name="honesty" checked={declaration.honesty} onChange={handleCheck} required />
            I confirm that all information provided is true and correct
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Submit Application</button>
      </form>
    </div>
  );
};

export default Declaration; 