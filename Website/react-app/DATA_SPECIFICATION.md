# MUST E-Portal Application Data Specification

## Overview
This document defines the **MANDATORY** data fields for the MUST University 2025 Application Forms. This specification covers both **Undergraduate** and **Postgraduate** applications based on the official MUST 2025 application forms. **NO OTHER DATA FIELDS** are permitted beyond what is specified here.

## Application Types Supported

### 1. Undergraduate Applications
- Based on: "2025 NON-GENERIC UNDERGRADUATE STUDENTS SELECTION APPLICATION FORM"
- Target: Full-Fee Paying Applicants Only
- Entry Requirements: Secondary school completion

### 2. Postgraduate Applications  
- Based on: "2025 POSTGRADUATE PROGRAMMES APPLICATION FORM"
- Target: Full-Fee Paying Applicants Only
- Entry Requirements: Bachelor's degree or equivalent

## Data Collection Rules

### ⚠️ STRICT COMPLIANCE REQUIREMENTS
1. **ONLY** the data fields listed in this specification may be collected
2. **ALL** mandatory fields must be collected and validated  
3. **NO** additional fields may be added without official MUST approval
4. **ALL** data must follow the specified formats and validation rules
5. **APPLICATION TYPE** determines which fields are collected

---

## COMMON FIELDS (Both Application Types)

### Personal Information
*All fields are required unless marked as Optional*

| Field Name | Type | Required | Validation Rules | Storage Key | Notes |
|------------|------|----------|------------------|-------------|-------|
| Surname | Text | Yes* | 2-50 characters, letters and spaces only | `surname` | Use official surname on certificates |
| First Names | Text | Yes* | 2-100 characters, letters and spaces only | `firstName` | All legal given names |
| Title | Select | Yes* | Mr, Mrs, Miss, Ms, Rev, Other | `title` | Custom input if "Other" selected |
| Marital Status | Select | Yes* | Single, Married, Divorced, Widowed | `maritalStatus` | Required field |
| Maiden Name | Text | No | 2-50 characters, letters and spaces only | `maidenName` | Optional - if applicable |
| Date of Birth | Date | Yes* | Format: DD/MM/YYYY, must be 16+ years old | `dateOfBirth` | Standard date validation |
| Place of Birth | Text | Yes* | 2-100 characters | `placeOfBirth` | District and town/village |
| Nationality | Text | Yes* | 2-50 characters | `nationality` | e.g., Malawian |
| Country of Residence | Text | Yes* | 2-50 characters | `countryOfResidence` | Usually Malawi unless stated otherwise |
| Gender | Select | Yes* | Male, Female | `gender` | Required selection |
| Address for Correspondence | Textarea | Yes* | 10-500 characters | `correspondenceAddress` | Include P.O. Box or full address |
| Telephone Number(s) | Text | Yes* | 10-15 digits with country code | `telephoneNumbers` | Include country code for non-Malawians |
| Email Address | Email | Yes* | Valid email format | `emailAddress` | Valid, regularly checked email address |
| Permanent Address | Textarea | No | 10-500 characters | `permanentAddress` | Optional - if different from correspondence |

### Special Needs (Optional)
| Field Name | Type | Required | Validation Rules | Storage Key | Notes |
|------------|------|----------|------------------|-------------|-------|
| Special Needs | Textarea | No | 10-500 characters | `specialNeeds` | Disabilities or accommodations needed |

### Application Fee (Mandatory)
| Field Name | Type | Required | Validation Rules | Storage Key | Notes |
|------------|------|----------|------------------|-------------|-------|
| Deposit Slip Attachment | File | Yes* | PDF/JPG, max 5MB | `depositSlip` | See fee structure below |

### Referees (Mandatory - Two Required)
| Field Name | Type | Required | Validation Rules | Storage Key | Notes |
|------------|------|----------|------------------|-------------|-------|
| Referee 1 Name | Text | Yes* | 2-100 characters | `referee1Name` | At least two referees required |
| Referee 1 Position | Text | Yes* | 2-100 characters | `referee1Position` | One must be academic |
| Referee 1 Address | Textarea | Yes* | 10-500 characters | `referee1Address` | Full postal or physical address |
| Referee 1 Email | Email | Yes* | Valid email format | `referee1Email` | Mandatory |
| Referee 2 Name | Text | Yes* | 2-100 characters | `referee2Name` | Second referee |
| Referee 2 Position | Text | Yes* | 2-100 characters | `referee2Position` | Academic or professional |
| Referee 2 Address | Textarea | Yes* | 10-500 characters | `referee2Address` | Full postal or physical address |
| Referee 2 Email | Email | Yes* | Valid email format | `referee2Email` | Mandatory |

### Declaration (Mandatory)
| Field Name | Type | Required | Validation Rules | Storage Key | Notes |
|------------|------|----------|------------------|-------------|-------|
| Applicant Signature | Text | Yes* | 2-100 characters (full name) | `applicantSignature` | Must be signed by applicant |
| Declaration Date | Date | Yes* | Auto-filled on submission | `declarationDate` | Submission date |

---

## UNDERGRADUATE-SPECIFIC FIELDS

### Programme of Study Details
| Field Name | Type | Required | Validation Rules | Storage Key | Notes |
|------------|------|----------|------------------|-------------|-------|
| 1st Choice Programme | Select | Yes* | From official MUST undergraduate list | `firstChoiceProgramme` | Official MUST programme title |
| 2nd Choice Programme | Select | No | From official MUST undergraduate list | `secondChoiceProgramme` | Optional |
| 3rd Choice Programme | Select | No | From official MUST undergraduate list | `thirdChoiceProgramme` | Optional |
| 4th Choice Programme | Select | No | From official MUST undergraduate list | `fourthChoiceProgramme` | Optional |
| Application Category | Select | Yes* | Economic Fee Paying, ODeL, Mature Entry, Weekend | `applicationCategory` | Choose one category |

### Academic Background (Secondary/High School)
| Field Name | Type | Required | Validation Rules | Storage Key | Notes |
|------------|------|----------|------------------|-------------|-------|
| Secondary School Attended | Text | Yes* | 2-200 characters | `secondarySchool` | Include full official name of school |
| Dates Attended From | Year | Yes* | 1990-current year | `secondaryDateFrom` | Year-based, e.g., 2019 |
| Dates Attended To | Year | Yes* | 1990-current year | `secondaryDateTo` | Year-based, e.g., 2022 |
| Subjects Studied | Textarea | Yes* | List format, 50-1000 characters | `subjectsStudied` | List all examinable subjects |
| Year Exams Written | Year | Yes* | 1990-current year | `examYear` | Usually MSCE or IGCSE exams |
| Year Results Obtained | Year | Yes* | 1990-current year | `resultsYear` | Same or following year after exams |
| Grades Achieved | Textarea | Yes* | MANEB scale format | `gradesAchieved` | Use MANEB scale (1–9 or A–E) |
| Certified Certificates | File | Yes* | PDF/JPG, max 10MB | `certificatedCertificates` | Official stamps required |

### University/College Background (Mature Entry Only)
*Only required if Application Category = "Mature Entry"*
| Field Name | Type | Required | Validation Rules | Storage Key | Notes |
|------------|------|----------|------------------|-------------|-------|
| Institution Attended | Text | Conditional* | 2-200 characters | `institutionAttended` | Accredited post-secondary institutions only |
| Dates Attended From | Year | Conditional* | 1990-current year | `institutionDateFrom` | Year-based |
| Dates Attended To | Year | Conditional* | 1990-current year | `institutionDateTo` | Year-based |
| Qualification Obtained | Text | Conditional* | 2-200 characters | `qualificationObtained` | e.g., Diploma in Civil Engineering |
| Year Exams Written | Year | Conditional* | 1990-current year | `institutionExamYear` | Required for mature entry |
| Year Results Obtained | Year | Conditional* | 1990-current year | `institutionResultsYear` | Required for mature entry |
| Grades Achieved | Text | Conditional* | 2-50 characters | `institutionGrades` | e.g., Credit, Distinction, or numerical GPA |
| Certified Certificates | File | Conditional* | PDF/JPG, max 10MB | `institutionCertificates` | Must include all academic transcripts and certificates |

---

## POSTGRADUATE-SPECIFIC FIELDS

### Study Details
| Field Name | Type | Required | Validation Rules | Storage Key | Notes |
|------------|------|----------|------------------|-------------|-------|
| Programme Applied For 1 | Select | Yes* | From official MUST postgraduate list | `postgrad1stChoice` | Four choices allowed |
| Programme Applied For 2 | Select | No | From official MUST postgraduate list | `postgrad2ndChoice` | Optional |
| Programme Applied For 3 | Select | No | From official MUST postgraduate list | `postgrad3rdChoice` | Optional |
| Programme Applied For 4 | Select | No | From official MUST postgraduate list | `postgrad4thChoice` | Optional |
| Method of Study | Select | Yes* | Full-time, Part-time | `methodOfStudy` | Required selection |

### Academic Qualifications (Mandatory)
| Field Name | Type | Required | Validation Rules | Storage Key | Notes |
|------------|------|----------|------------------|-------------|-------|
| University/College Attended | Text | Yes* | 2-200 characters | `universityAttended` | Accredited institutions only |
| Dates Attended From | Year | Yes* | 1990-current year | `universityDateFrom` | Year-based |
| Dates Attended To | Year | Yes* | 1990-current year | `universityDateTo` | Year-based |
| Programme Name | Text | Yes* | 2-200 characters | `programmeName` | e.g., BSc in Environmental Science |
| Qualification | Text | Yes* | 2-100 characters | `qualification` | Degree/Diploma earned |
| Date of Award | Year | Yes* | 1990-current year | `dateOfAward` | Year qualification was awarded |
| Class of Award | Text | Yes* | 2-50 characters | `classOfAward` | e.g., Credit, Distinction, GPA 3.2 |
| Certified Certificates | File | Yes* | PDF/JPG, max 10MB | `certifiedCertificates` | Required including academic transcript |

### Professional and Other Qualifications (Optional)
| Field Name | Type | Required | Validation Rules | Storage Key | Notes |
|------------|------|----------|------------------|-------------|-------|
| Professional Institution Name | Text | No | 2-200 characters | `professionalInstitution` | Optional |
| Professional Dates From | Year | No | 1990-current year | `professionalDateFrom` | Optional |
| Professional Dates To | Year | No | 1990-current year | `professionalDateTo` | Optional |
| Professional Programme | Text | No | 2-200 characters | `professionalProgramme` | Optional |
| Professional Qualification | Text | No | 2-100 characters | `professionalQualification` | Optional |
| Professional Date of Award | Year | No | 1990-current year | `professionalDateOfAward` | Optional |
| Professional Class of Award | Text | No | 2-50 characters | `professionalClassOfAward` | Optional |

### Work Experience (Mandatory)
| Field Name | Type | Required | Validation Rules | Storage Key | Notes |
|------------|------|----------|------------------|-------------|-------|
| Organization Name | Text | Yes* | 2-200 characters | `organizationName` | Most recent first |
| Employment Date From | Date | Yes* | DD/MM/YYYY format | `employmentDateFrom` | Start date |
| Employment Date To | Date | Yes* | DD/MM/YYYY format or "Present" | `employmentDateTo` | End date |
| Position/Nature of Work | Text | Yes* | 2-200 characters | `positionNature` | Job title or role description |

### Motivation Statement (Mandatory)
| Field Name | Type | Required | Validation Rules | Storage Key | Notes |
|------------|------|----------|------------------|-------------|-------|
| Motivation Essay | File | Yes* | PDF/DOC, max 5MB | `motivationEssay` | 500 words explaining reasons for applying |
| Research Concept Note | File | Yes* | PDF/DOC, max 5MB | `researchConceptNote` | Brief outline of intended research topic |

---

## Fee Structure

### Undergraduate Applications
- **Malawians**: MWK 10,000
- **Non-Malawians**: USD 100

### Postgraduate Applications
- **Malawians**: MWK 10,000
- **SADC Countries**: MWK 10,000
- **Other Countries**: USD 50

---

## Official Programme Lists

### Undergraduate Programmes (2025)

#### Engineering Programmes
- Bachelor of Engineering in Civil Engineering
- Bachelor of Engineering in Electrical Engineering  
- Bachelor of Engineering in Mechanical Engineering
- Bachelor of Engineering in Chemical Engineering
- Bachelor of Engineering in Mining Engineering

#### Science Programmes
- Bachelor of Science in Applied Mathematics
- Bachelor of Science in Physics
- Bachelor of Science in Chemistry
- Bachelor of Science in Biology
- Bachelor of Science in Environmental Science

#### Technology Programmes
- Bachelor of Technology in Information Technology
- Bachelor of Technology in Computer Science
- Bachelor of Technology in Telecommunications
- Bachelor of Technology in Renewable Energy

#### Health Sciences Programmes
- Bachelor of Science in Biomedical Sciences
- Bachelor of Science in Medical Laboratory Sciences
- Bachelor of Science in Environmental Health

### Postgraduate Programmes (2025)

#### Master's Programmes
- Master of Science in Applied Mathematics
- Master of Science in Physics
- Master of Science in Chemistry
- Master of Science in Environmental Science
- Master of Engineering in Civil Engineering
- Master of Engineering in Electrical Engineering
- Master of Engineering in Mechanical Engineering
- Master of Technology in Information Technology
- Master of Technology in Computer Science

#### PhD Programmes
- PhD in Applied Mathematics
- PhD in Physics
- PhD in Chemistry
- PhD in Environmental Science
- PhD in Engineering (Civil)
- PhD in Engineering (Electrical)
- PhD in Engineering (Mechanical)
- PhD in Information Technology

*Note: Programme lists must be updated annually based on official MUST offerings*

---

## Application Categories

### Undergraduate Categories
1. **Economic Fee Paying** - Standard full-fee paying students
2. **ODeL** - Open, Distance and e-Learning mode
3. **Mature Entry** - Applicants over 25 with work experience
4. **Weekend** - Classes held on weekends for working professionals

### Postgraduate Categories
1. **Full-time** - Regular daytime classes
2. **Part-time** - Evening and weekend classes

---

## Database Structure (TypeScript Interface)

```typescript
interface MUSTApplicationData {
  // Application Type
  applicationType: 'undergraduate' | 'postgraduate';
  
  // Common Personal Information
  surname: string;
  firstName: string;
  title: 'Mr' | 'Mrs' | 'Miss' | 'Ms' | 'Rev' | 'Other';
  titleOther?: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  maidenName?: string;
  dateOfBirth: string; // DD/MM/YYYY
  placeOfBirth: string;
  nationality: string;
  countryOfResidence: string;
  gender: 'Male' | 'Female';
  correspondenceAddress: string;
  telephoneNumbers: string;
  emailAddress: string;
  permanentAddress?: string;

  // Common Fields
  specialNeeds?: string;
  depositSlip: File;
  referee1Name: string;
  referee1Position: string;
  referee1Address: string;
  referee1Email: string;
  referee2Name: string;
  referee2Position: string;
  referee2Address: string;
  referee2Email: string;
  applicantSignature: string;
  declarationDate: string;

  // UNDERGRADUATE SPECIFIC FIELDS
  // Programme Selection
  firstChoiceProgramme?: string;
  secondChoiceProgramme?: string;
  thirdChoiceProgramme?: string;
  fourthChoiceProgramme?: string;
  applicationCategory?: 'Economic Fee Paying' | 'ODeL' | 'Mature Entry' | 'Weekend';

  // Secondary Academic Background
  secondarySchool?: string;
  secondaryDateFrom?: number;
  secondaryDateTo?: number;
  subjectsStudied?: string;
  examYear?: number;
  resultsYear?: number;
  gradesAchieved?: string;
  certificatedCertificates?: File;

  // University Background (Mature Entry)
  institutionAttended?: string;
  institutionDateFrom?: number;
  institutionDateTo?: number;
  qualificationObtained?: string;
  institutionExamYear?: number;
  institutionResultsYear?: number;
  institutionGrades?: string;
  institutionCertificates?: File;

  // POSTGRADUATE SPECIFIC FIELDS
  // Study Details
  postgrad1stChoice?: string;
  postgrad2ndChoice?: string;
  postgrad3rdChoice?: string;
  postgrad4thChoice?: string;
  methodOfStudy?: 'Full-time' | 'Part-time';

  // Academic Qualifications
  universityAttended?: string;
  universityDateFrom?: number;
  universityDateTo?: number;
  programmeName?: string;
  qualification?: string;
  dateOfAward?: number;
  classOfAward?: string;
  certifiedCertificates?: File;

  // Professional Qualifications
  professionalInstitution?: string;
  professionalDateFrom?: number;
  professionalDateTo?: number;
  professionalProgramme?: string;
  professionalQualification?: string;
  professionalDateOfAward?: number;
  professionalClassOfAward?: string;

  // Work Experience
  organizationName?: string;
  employmentDateFrom?: string;
  employmentDateTo?: string;
  positionNature?: string;

  // Motivation Statement
  motivationEssay?: File;
  researchConceptNote?: File;

  // System Metadata
  applicationId: string;
  userId: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submissionDate?: string;
  lastModified: string;
  currentStep: number;
  completionPercentage: number;
  reviewComments?: string[];
  decisionDate?: string;
}
```

---

## Form Structure by Application Type

### Undergraduate Application (5 Steps)
1. **Personal Information** (14 fields)
2. **Programme Selection** (5 fields)
3. **Academic Background - Secondary** (8 fields)
4. **Academic Background - University** (8 fields - Mature Entry only)
5. **Final Requirements** (11 fields)

**Total: 46 fields (38 mandatory + 8 conditional)**

### Postgraduate Application (6 Steps)
1. **Personal Information** (14 fields)
2. **Study Details** (5 fields)
3. **Academic Qualifications** (8 fields)
4. **Professional Qualifications & Work Experience** (11 fields)
5. **Motivation Statement** (2 fields)
6. **Final Requirements** (11 fields)

**Total: 51 fields (44 mandatory + 7 optional)**

---

## Validation Rules

### Date Formats
- **Birth Date**: DD/MM/YYYY format
- **Academic Years**: YYYY format for year-based entries
- **Employment Dates**: DD/MM/YYYY format

### File Requirements
- **Certificates**: PDF preferred, JPG acceptable, max 10MB
- **Deposit Slip**: PDF/JPG, max 5MB
- **Essays/Statements**: PDF/DOC, max 5MB
- **All Files**: Virus scanned, official stamps required for certificates

### Text Validation
- **Names**: Letters, spaces, apostrophes, hyphens only
- **Addresses**: Standard address characters
- **Academic Info**: Official names as they appear on certificates
- **No HTML/Scripts**: All input sanitized

---

## Compliance & Enforcement

### ⚠️ CRITICAL RULES
1. **APPLICATION TYPE**: Must be selected first to determine form fields
2. **EXACT COMPLIANCE**: Forms must match official MUST requirements exactly
3. **NO CROSS-CONTAMINATION**: Undergraduate fields not shown for postgraduate and vice versa
4. **ANNUAL UPDATES**: Both specifications updated for each academic year
5. **OFFICIAL APPROVAL**: Changes require MUST registrar approval

### Quality Assurance
- **Dual Form Testing**: Both undergraduate and postgraduate forms tested
- **Conditional Logic**: Proper field showing/hiding based on application type
- **Data Segregation**: Clear separation between application types
- **User Experience**: Smooth transition between form types

---

## Version Control

- **Current Version**: 3.0 (Updated for 2025 Entry - Both Application Types)
- **Undergraduate Based On**: "2025 NON-GENERIC UNDERGRADUATE STUDENTS SELECTION APPLICATION FORM"
- **Postgraduate Based On**: "2025 POSTGRADUATE PROGRAMMES APPLICATION FORM"
- **Last Updated**: [Current Date]
- **Next Review**: Before 2026 application cycle
- **Change Authority**: MUST Registrar's Office

**This specification is MANDATORY and represents the official MUST 2025 application requirements for both undergraduate and postgraduate programmes. Any deviation requires formal approval from MUST administration.** 