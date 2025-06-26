import React from 'react';
import { useApplication } from './ApplicationContext';

const programs = [
  '', 'BSc Computer Science', 'BSc Information Technology', 'BSc Biomedical Engineering', 'BSc Chemical Engineering', 'BSc Earth Sciences', 'BSc Water Resources', 'BSc Business Information Systems', 'BSc Renewable Energy', 'BSc Mathematics', 'BSc Physics', 'BSc Chemistry', 'BSc Biological Sciences', 'BSc Environmental Science', 'BSc Food Science', 'BSc Nutrition', 'BSc Sports Science', 'BSc Engineering (General)', 'BSc Management', 'BSc Education', 'BSc Economics', 'BSc Social Science', 'BSc Communication', 'BSc Design', 'BSc Architecture'
];
const intakeTypes = ['', 'Regular', 'ODL', 'Weekend', 'Economic'];
const studyCentres = ['', 'Main Campus', 'Blantyre Centre', 'Lilongwe Centre', 'Mzuzu Centre'];
const learningModes = ['', 'Full-time', 'Part-time', 'Online', 'Blended'];

const ProgramSelection: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { data, setData } = useApplication();
  const prog = data.programSelection;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      programSelection: {
        ...prev.programSelection,
        [name]: value
      }
    }));
  };

  return (
    <div className="form-card">
      <form className="form-step" onSubmit={e => { e.preventDefault(); onNext(); }}>
        <h2>Program Selection</h2>
        <div className="form-group">
          <label>Primary Program Choice</label>
          <select name="primaryProgram" value={prog.primaryProgram} onChange={handleChange} required>
            {programs.map(p => <option key={p} value={p}>{p || 'Select program'}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Secondary Program Choice</label>
          <select name="secondaryProgram" value={prog.secondaryProgram} onChange={handleChange} required>
            {programs.map(p => <option key={p} value={p}>{p || 'Select program'}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Intake Type</label>
          <select name="intakeType" value={prog.intakeType} onChange={handleChange} required>
            {intakeTypes.map(i => <option key={i} value={i}>{i || 'Select intake type'}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Study Centre</label>
          <select name="studyCentre" value={prog.studyCentre} onChange={handleChange} required>
            {studyCentres.map(s => <option key={s} value={s}>{s || 'Select study centre'}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Learning Mode</label>
          <select name="learningMode" value={prog.learningMode} onChange={handleChange} required>
            {learningModes.map(m => <option key={m} value={m}>{m || 'Select learning mode'}</option>)}
          </select>
        </div>
      </form>
    </div>
  );
};

export default ProgramSelection; 