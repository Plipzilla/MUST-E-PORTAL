import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Step 1: Personal & Contact Details
export interface PersonalInfo {
  // Section A: Identity
  title: string;
  firstName: string;
  surname: string;
  nationality: string;
  countryOfResidence: string;
  maritalStatus: string;
  maidenName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: string;
  passportPhoto: File | null;
  
  // Section B: Contact Info
  correspondenceAddress: string;
  telephoneNumbers: string;
  emailAddress: string;
  permanentAddress: string;
  showPermanentAddress: boolean;
}

// Step 2: Programme & Education History
export interface ProgramInfo {
  // Section A: Programme
  levelOfStudy: 'undergraduate' | 'postgraduate' | '';
  firstChoice: string;
  secondChoice: string;
  thirdChoice: string;
  fourthChoice: string;
  methodOfStudy: string;
}

export interface EducationHistory {
  // For Undergraduate
  schoolName: string;
  schoolFromDate: string;
  schoolToDate: string;
  subjectsStudied: string;
  examinationYear: string;
  resultsYear: string;
  gradesAchieved: string;
  
  // For Postgraduate/Mature Entry
  universityCollege: string;
  uniFromDate: string;
  uniToDate: string;
  programme: string;
  qualification: string;
  dateOfAward: string;
  classOfAward: string;
}

// Step 3: Work Experience & Motivation
export interface WorkExperience {
  fromDate: string;
  toDate: string;
  organization: string;
  position: string;
}

export interface Motivation {
  motivationEssay: string;
  uploadMotivationNote: boolean;
  motivationFile: File | null;
}

// Step 4: Special Needs & Financial Info
export interface SpecialNeeds {
  hasDisability: boolean;
  disabilityDescription: string;
}

// Step 5: Referees & Final Declaration
export interface Referee {
  name: string;
  position: string;
  institution: string;
  address: string;
  email: string;
}

export interface Declaration {
  declarationAgreed: boolean;
  fullName: string;
  date: string;
  allSectionsCompleted: boolean;
  allDocumentsUploaded: boolean;
  depositSlipAttached: boolean;
}

export interface ApplicationData {
  step1: PersonalInfo;
  step2: {
    programInfo: ProgramInfo;
    educationHistory: EducationHistory;
  };
  step3: {
    workExperience: WorkExperience[];
    motivation: Motivation;
  };
  step4: SpecialNeeds;
  step5: {
    referees: Referee[];
    declaration: Declaration;
  };
  currentStep: number;
  lastSaved: string;
}

const defaultPersonalInfo: PersonalInfo = {
  title: '',
  firstName: '',
  surname: '',
  nationality: '',
  countryOfResidence: '',
  maritalStatus: '',
  maidenName: '',
  dateOfBirth: '',
  placeOfBirth: '',
  gender: '',
  passportPhoto: null,
  correspondenceAddress: '',
  telephoneNumbers: '',
  emailAddress: '',
  permanentAddress: '',
  showPermanentAddress: false,
};

const defaultProgramInfo: ProgramInfo = {
  levelOfStudy: '',
  firstChoice: '',
  secondChoice: '',
  thirdChoice: '',
  fourthChoice: '',
  methodOfStudy: '',
};

const defaultEducationHistory: EducationHistory = {
  schoolName: '',
  schoolFromDate: '',
  schoolToDate: '',
  subjectsStudied: '',
  examinationYear: '',
  resultsYear: '',
  gradesAchieved: '',
  universityCollege: '',
  uniFromDate: '',
  uniToDate: '',
  programme: '',
  qualification: '',
  dateOfAward: '',
  classOfAward: '',
};

const defaultMotivation: Motivation = {
  motivationEssay: '',
  uploadMotivationNote: false,
  motivationFile: null,
};

const defaultSpecialNeeds: SpecialNeeds = {
  hasDisability: false,
  disabilityDescription: '',
};

const defaultDeclaration: Declaration = {
  declarationAgreed: false,
  fullName: '',
  date: new Date().toISOString().split('T')[0],
  allSectionsCompleted: false,
  allDocumentsUploaded: false,
  depositSlipAttached: false,
};

const defaultData: ApplicationData = {
  step1: defaultPersonalInfo,
  step2: {
    programInfo: defaultProgramInfo,
    educationHistory: defaultEducationHistory,
  },
  step3: {
    workExperience: [],
    motivation: defaultMotivation,
  },
  step4: defaultSpecialNeeds,
  step5: {
    referees: [
      { name: '', position: '', institution: '', address: '', email: '' },
      { name: '', position: '', institution: '', address: '', email: '' },
    ],
    declaration: defaultDeclaration,
  },
  currentStep: 0,
  lastSaved: '',
};

interface ApplicationContextType {
  data: ApplicationData;
  setData: React.Dispatch<React.SetStateAction<ApplicationData>>;
  updateStep: (step: number) => void;
  saveDraft: () => Promise<void>;
  loadDraft: () => Promise<void>;
  isStepValid: (step: number) => boolean;
  getStepProgress: () => number;
  addWorkExperience: () => void;
  removeWorkExperience: (index: number) => void;
  addReferee: () => void;
  removeReferee: (index: number) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ApplicationData>(defaultData);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Autosave every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      saveDraft();
    }, 30000);

    return () => clearInterval(timer);
  }, [data]);

  // Save draft function
  const saveDraft = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('/api/application/save-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          lastSaved: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setData(prev => ({
          ...prev,
          lastSaved: new Date().toISOString(),
        }));
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [data]);

  // Load draft function
  const loadDraft = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('/api/application/load-draft', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const savedData = await response.json();
        setData(savedData);
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  }, []);

  // Update current step
  const updateStep = useCallback((step: number) => {
    setData(prev => ({ ...prev, currentStep: step }));
    saveDraft(); // Save on page change
  }, [saveDraft]);

  // Validation functions
  const isStepValid = useCallback((step: number): boolean => {
    switch (step) {
      case 0: // Personal & Contact Details
        const { step1 } = data;
        return !!(
          step1.title &&
          step1.firstName &&
          step1.surname &&
          step1.nationality &&
          step1.countryOfResidence &&
          step1.dateOfBirth &&
          step1.placeOfBirth &&
          step1.gender &&
          step1.passportPhoto &&
          step1.correspondenceAddress &&
          step1.telephoneNumbers &&
          step1.emailAddress
        );
      
      case 1: // Programme & Education History
        const { step2 } = data;
        return !!(
          step2.programInfo.levelOfStudy &&
          step2.programInfo.firstChoice &&
          ((step2.programInfo.levelOfStudy === 'undergraduate' && 
            step2.educationHistory.schoolName &&
            step2.educationHistory.schoolFromDate &&
            step2.educationHistory.schoolToDate &&
            step2.educationHistory.subjectsStudied &&
            step2.educationHistory.examinationYear &&
            step2.educationHistory.resultsYear &&
            step2.educationHistory.gradesAchieved) ||
           (step2.programInfo.levelOfStudy === 'postgraduate' &&
            step2.educationHistory.universityCollege &&
            step2.educationHistory.uniFromDate &&
            step2.educationHistory.uniToDate &&
            step2.educationHistory.programme &&
            step2.educationHistory.qualification &&
            step2.educationHistory.dateOfAward &&
            step2.educationHistory.classOfAward))
        );
      
      case 2: // Work Experience & Motivation
        const { step3 } = data;
        return !!(
          step3.motivation.motivationEssay &&
          step3.motivation.motivationEssay.split(' ').length >= 300 &&
          step3.motivation.motivationEssay.split(' ').length <= 500
        );
      
      case 3: // Special Needs
        const { step4 } = data;
        return !step4.hasDisability || !!step4.disabilityDescription;
      
      case 4: // Referees & Declaration
        const { step5 } = data;
        const validReferees = step5.referees.filter(ref => 
          ref.name && ref.position && ref.institution && ref.address && ref.email
        );
        return !!(
          validReferees.length >= 2 &&
          step5.declaration.declarationAgreed &&
          step5.declaration.fullName &&
          step5.declaration.allSectionsCompleted &&
          step5.declaration.allDocumentsUploaded &&
          step5.declaration.depositSlipAttached
        );
      
      default:
        return false;
    }
  }, [data]);

  // Get overall progress
  const getStepProgress = useCallback(() => {
    let completedSteps = 0;
    for (let i = 0; i < 5; i++) {
      if (isStepValid(i)) completedSteps++;
    }
    return (completedSteps / 5) * 100;
  }, [isStepValid]);

  // Work experience management
  const addWorkExperience = useCallback(() => {
    setData(prev => ({
      ...prev,
      step3: {
        ...prev.step3,
        workExperience: [
          ...prev.step3.workExperience,
          { fromDate: '', toDate: '', organization: '', position: '' }
        ]
      }
    }));
  }, []);

  const removeWorkExperience = useCallback((index: number) => {
    setData(prev => ({
      ...prev,
      step3: {
        ...prev.step3,
        workExperience: prev.step3.workExperience.filter((_, i) => i !== index)
      }
    }));
  }, []);

  // Referee management
  const addReferee = useCallback(() => {
    if (data.step5.referees.length < 3) {
      setData(prev => ({
        ...prev,
        step5: {
          ...prev.step5,
          referees: [
            ...prev.step5.referees,
            { name: '', position: '', institution: '', address: '', email: '' }
          ]
        }
      }));
    }
  }, [data.step5.referees.length]);

  const removeReferee = useCallback((index: number) => {
    if (data.step5.referees.length > 2) {
      setData(prev => ({
        ...prev,
        step5: {
          ...prev.step5,
          referees: prev.step5.referees.filter((_, i) => i !== index)
        }
      }));
    }
  }, [data.step5.referees.length]);

  return (
    <ApplicationContext.Provider value={{
      data,
      setData,
      updateStep,
      saveDraft,
      loadDraft,
      isStepValid,
      getStepProgress,
      addWorkExperience,
      removeWorkExperience,
      addReferee,
      removeReferee,
    }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error('useApplication must be used within ApplicationProvider');
  return ctx;
}; 