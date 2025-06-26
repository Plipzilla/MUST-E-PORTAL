import React, { useState } from 'react';
import { useApplication } from './ApplicationContext';
import { useAuth } from '../../firebase/AuthContext';

const districts = [
  '', 'Blantyre', 'Lilongwe', 'Mzimba', 'Zomba', 'Mangochi', 'Mulanje', 'Salima', 'Dedza', 'Kasungu', 'Nkhotakota', 'Mchinji', 'Chikwawa', 'Nsanje', 'Ntcheu', 'Thyolo', 'Dowa', 'Karonga', 'Nkhata Bay', 'Rumphi', 'Ntchisi', 'Chitipa', 'Balaka', 'Phalombe', 'Likoma', 'Neno' 
];
const regions = ['', 'Northern', 'Central', 'Southern'];

const ContactDetails: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { data, setData } = useApplication();
  const { user } = useAuth();
  const contact = data.contactDetails;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!contact.phone.trim()) newErrors.phone = 'Phone is required.';
    if (contact.phone && !/^\d{9,15}$/.test(contact.phone)) newErrors.phone = 'Phone must be 9-15 digits.';
    if (!contact.email.trim()) newErrors.email = 'Email is required.';
    if (contact.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email)) newErrors.email = 'Invalid email address.';
    if (!contact.address.trim()) newErrors.address = 'Physical address is required.';
    if (!contact.district) newErrors.district = 'Please select a district.';
    if (!contact.region) newErrors.region = 'Please select a region.';
    if (!contact.nextOfKin.trim()) newErrors.nextOfKin = 'Next of kin/guardian is required.';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        [name]: value
      }
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  React.useEffect(() => {
    if (user && !contact.email) {
      setData(prev => ({
        ...prev,
        contactDetails: {
          ...prev.contactDetails,
          email: user.email || ''
        }
      }));
    }
    // eslint-disable-next-line
  }, [user]);

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
        <h2>Contact Details</h2>
        <div className="form-group">
          <label>Phone <span style={{color: 'red'}}>*</span></label>
          {errors.phone && <div className="form-error">{errors.phone}</div>}
          <input name="phone" value={contact.phone} onChange={handleChange} placeholder="e.g. 0991234567" required />
        </div>
        <div className="form-group">
          <label>Alternate Phone</label>
          <input name="altPhone" value={contact.altPhone} onChange={handleChange} placeholder="Optional" />
        </div>
        <div className="form-group">
          <label>Email <span style={{color: 'red'}}>*</span></label>
          {errors.email && <div className="form-error">{errors.email}</div>}
          <input name="email" value={contact.email} onChange={handleChange} required readOnly />
        </div>
        <div className="form-group">
          <label>Physical Address <span style={{color: 'red'}}>*</span></label>
          {errors.address && <div className="form-error">{errors.address}</div>}
          <input name="address" value={contact.address} onChange={handleChange} placeholder="e.g. 123 Main St, Area 10" required />
        </div>
        <div className="form-group">
          <label>District <span style={{color: 'red'}}>*</span></label>
          {errors.district && <div className="form-error">{errors.district}</div>}
          <select name="district" value={contact.district} onChange={handleChange} required>
            {districts.map(d => <option key={d} value={d}>{d || 'Select district'}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Region <span style={{color: 'red'}}>*</span></label>
          {errors.region && <div className="form-error">{errors.region}</div>}
          <select name="region" value={contact.region} onChange={handleChange} required>
            {regions.map(r => <option key={r} value={r}>{r || 'Select region'}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Next of Kin / Guardian <span style={{color: 'red'}}>*</span></label>
          {errors.nextOfKin && <div className="form-error">{errors.nextOfKin}</div>}
          <input name="nextOfKin" value={contact.nextOfKin} onChange={handleChange} placeholder="e.g. John Doe (Father)" required />
        </div>
        <button type="submit" style={{display: 'none'}} aria-hidden />
      </form>
    </div>
  );
};

export default ContactDetails; 