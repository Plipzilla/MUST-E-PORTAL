import React, { createContext, useContext, useState } from 'react';

export interface PersonalInfo {
  fullName: string;
  dob: string;
  idNumber: string;
  gender: string;
  maritalStatus: string;
  citizenship: string;
  disability: string;
}

export interface ContactDetails {
  phone: string;
  altPhone: string;
  email: string;
  address: string;
  district: string;
  region: string;
  nextOfKin: string;
}

export interface AcademicBackground {
  lastSchool: string;
  yearCompleted: string;
  gpa: string;
  certificates: File[];
  resultSlips: File[];
}

export interface ProgramSelection {
  primaryProgram: string;
  secondaryProgram: string;
  intakeType: string;
  studyCentre: string;
  learningMode: string;
}

export interface ApplicationData {
  personalInfo: PersonalInfo;
  contactDetails: ContactDetails;
  academicBackground: AcademicBackground;
  programSelection: ProgramSelection;
  declaration: {
    agreed: boolean;
    honesty: boolean;
  };
}

const defaultData: ApplicationData = {
  personalInfo: {
    fullName: '', dob: '', idNumber: '', gender: '', maritalStatus: '', citizenship: '', disability: ''
  },
  contactDetails: {
    phone: '', altPhone: '', email: '', address: '', district: '', region: '', nextOfKin: ''
  },
  academicBackground: {
    lastSchool: '', yearCompleted: '', gpa: '', certificates: [], resultSlips: []
  },
  programSelection: {
    primaryProgram: '', secondaryProgram: '', intakeType: '', studyCentre: '', learningMode: ''
  },
  declaration: {
    agreed: false, honesty: false
  }
};

interface ApplicationContextType {
  data: ApplicationData;
  setData: React.Dispatch<React.SetStateAction<ApplicationData>>;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ApplicationData>(defaultData);
  return (
    <ApplicationContext.Provider value={{ data, setData }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error('useApplication must be used within ApplicationProvider');
  return ctx;
}; 