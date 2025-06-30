import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Application Type
export type ApplicationType = 'undergraduate' | 'postgraduate' | '';

// Step 1: Personal & Contact Details
export interface PersonalInfo {
  // Application Type Selection
  applicationType: ApplicationType;
  
  // Section A: Identity (Official MUST fields)
  title: string;
  surname: string;
  firstName: string;
  maritalStatus: string;
  maidenName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  countryOfResidence: string;
  gender: string;
  passportPhoto: File | null;
  
  // Section B: Contact Information (Official MUST fields)
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
  applicationType: '',
  title: '',
  surname: '',
  firstName: '',
  maritalStatus: '',
  maidenName: '',
  dateOfBirth: '',
  placeOfBirth: '',
  nationality: '',
  countryOfResidence: '',
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
  getApplicationType: () => ApplicationType;
  getTotalSteps: () => number;
  getStepTitle: (step: number) => string;
  isStepAvailable: (step: number) => boolean;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ApplicationData>(defaultData);

  const getFacultyFromProgram = (programName: string): string => {
    if (!programName) return 'Not specified';
    if (programName.includes('Computer Science') || programName.includes('Information Technology')) {
      return 'Malawi Institute of Technology';
    } else if (programName.includes('Environmental') || programName.includes('Climate') || programName.includes('Earth')) {
      return 'Ndata School of Climate and Earth Sciences';
    } else if (programName.includes('Cultural') || programName.includes('Heritage')) {
      return 'Bingu School of Culture and Heritage';
    } else if (programName.includes('Medicine') || programName.includes('Medical') || programName.includes('Biomedical')) {
      return 'Academy of Medical Sciences';
    }
    return 'Not specified';
  };

  // Save draft function
  const saveDraft = useCallback(async () => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) return;

      const user = JSON.parse(currentUser);
      const userId = user.uid || user.email;

      // Calculate completion percentage based on filled fields
      let completionPercentage = 0;
      
      // Basic completion based on application type and step progress
      if (data.step1.applicationType) {
        completionPercentage += 20; // Application type selected
      }
      if (data.step1.firstName && data.step1.surname && data.step1.emailAddress) {
        completionPercentage += 20; // Basic personal info
      }
      if (data.step2.programInfo.firstChoice) {
        completionPercentage += 20; // Program selected
      }
      if (data.step1.applicationType === 'postgraduate' && data.step3.motivation.motivationEssay) {
        completionPercentage += 20; // Motivation (postgraduate only)
      }
      if (data.step5.referees.some(ref => ref.name && ref.email)) {
        completionPercentage += 20; // At least one referee
      }
      
      const draftData = {
        id: `draft_${userId}_${Date.now()}`,
        userId: userId,
        ...data,
        programTitle: data.step2.programInfo.firstChoice || 'Application Draft',
        faculty: getFacultyFromProgram(data.step2.programInfo.firstChoice),
        completionPercentage,
        lastSaved: new Date().toISOString(),
        isDraft: true
      };

      // Save to localStorage
      const existingDrafts = JSON.parse(localStorage.getItem('applicationDrafts') || '[]');
      
      // Remove any existing draft for this user (only keep one draft per user)
      const filteredDrafts = existingDrafts.filter((draft: any) => draft.userId !== userId);
      
      // Add the new draft
      filteredDrafts.push(draftData);
      
      localStorage.setItem('applicationDrafts', JSON.stringify(filteredDrafts));

      setData(prev => ({
        ...prev,
        lastSaved: new Date().toISOString(),
      }));

      console.log('Draft saved successfully to localStorage');
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [data]);

  // Autosave every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      saveDraft();
    }, 30000);

    return () => clearInterval(timer);
  }, [saveDraft]);

  // Load draft function
  const loadDraft = useCallback(async () => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) return;

      const user = JSON.parse(currentUser);
      const userId = user.uid || user.email;

      // Check if there's a specific draft ID in URL params
      const urlParams = new URLSearchParams(window.location.search);
      const draftId = urlParams.get('draft');
      
      const existingDrafts = JSON.parse(localStorage.getItem('applicationDrafts') || '[]');
      
      let draftToLoad = null;
      
      if (draftId) {
        // Load specific draft by ID
        draftToLoad = existingDrafts.find((draft: any) => draft.id === draftId);
      } else {
        // Load the user's most recent draft
        draftToLoad = existingDrafts.find((draft: any) => draft.userId === userId);
      }

      if (draftToLoad) {
        setData(draftToLoad);
        console.log('Draft loaded successfully from localStorage');
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
      case 1: // Personal & Contact Details
        const { step1 } = data;
        return !!(
          step1.title &&
          step1.surname &&
          step1.firstName &&
          step1.maritalStatus &&
          step1.dateOfBirth &&
          step1.placeOfBirth &&
          step1.nationality &&
          step1.countryOfResidence &&
          step1.gender &&
          step1.passportPhoto &&
          step1.correspondenceAddress &&
          step1.telephoneNumbers &&
          step1.emailAddress
        );
      
      case 2: // Programme & Education History
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
      
      case 3: 
        const applicationType = data.step1.applicationType;
        if (applicationType === 'undergraduate') {
          // Step 3 for undergraduate is Special Needs
          const { step4 } = data;
          return !step4.hasDisability || !!step4.disabilityDescription;
        } else {
          // Step 3 for postgraduate is Work Experience & Motivation
          const { step3 } = data;
          return !!(
            step3.motivation.motivationEssay &&
            step3.motivation.motivationEssay.split(' ').length >= 500 &&
            step3.motivation.motivationEssay.split(' ').length <= 1000
          );
        }
      
      case 4: 
        const appType = data.step1.applicationType;
        if (appType === 'undergraduate') {
          // Step 4 for undergraduate is Referees & Declaration
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
        } else {
          // Step 4 for postgraduate is Special Needs
          const { step4 } = data;
          return !step4.hasDisability || !!step4.disabilityDescription;
        }
      
      case 5: // Referees & Declaration (postgraduate only)
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

  // Get application type
  const getApplicationType = useCallback((): ApplicationType => {
    return data.step1.applicationType;
  }, [data.step1.applicationType]);

  // Get total steps based on application type
  const getTotalSteps = useCallback((): number => {
    const applicationType = data.step1.applicationType;
    return applicationType === 'undergraduate' ? 4 : 5; // Undergraduate: 4 steps, Postgraduate: 5 steps
  }, [data.step1.applicationType]);

  // Get step title based on application type
  const getStepTitle = useCallback((step: number): string => {
    const applicationType = getApplicationType();
    
    if (applicationType === 'undergraduate') {
      const undergraduateStepTitles = {
        1: 'Personal Information',
        2: 'Programme & Secondary Education',
        3: 'Special Needs & Requirements',
        4: 'Referees & Declaration'
      };
      return undergraduateStepTitles[step as keyof typeof undergraduateStepTitles] || 'Unknown Step';
    } else {
      const postgraduateStepTitles = {
        1: 'Personal Information',
        2: 'Programme & University Education',
        3: 'Work Experience & Motivation',
        4: 'Special Needs & Requirements',
        5: 'Referees & Declaration'
      };
      return postgraduateStepTitles[step as keyof typeof postgraduateStepTitles] || 'Unknown Step';
    }
  }, [getApplicationType]);

  // Check if step is available based on application type
  const isStepAvailable = useCallback((step: number): boolean => {
    const applicationType = getApplicationType();
    
    // Step 1 and above only available after application type is selected
    return applicationType !== '';
  }, [getApplicationType]);

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
      getApplicationType,
      getTotalSteps,
      getStepTitle,
      isStepAvailable,
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