# Multi-Step University Application Form

A comprehensive 5-step application form for university admissions with advanced UX features, validation, and autosave functionality.

## Features

### 🎯 Core Functionality
- **5-Step Multi-Page Form** with logical field grouping
- **Real-time Validation** with immediate error feedback
- **Autosave** every 30 seconds and on page changes
- **Progress Tracking** with visual progress bar and step completion
- **File Upload** with preview and validation
- **Conditional Logic** based on study level and user selections
- **Dynamic Rows** for work experience and referees
- **Responsive Design** for all device sizes

### 📋 Form Structure

#### Step 1: Personal & Contact Details
**Section A: Identity**
- Title (Dropdown: Mr/Mrs/Miss/Ms/Rev/Other)
- First Name (Text, letters only, max 50 chars)
- Surname (Text, letters only, max 50 chars)
- Nationality (Text)
- Country of Residence (Text)
- Marital Status (Dropdown: Single/Married/Divorced/Widowed)
- Maiden Name (Text, optional)
- Date of Birth (Date picker, 16+ years validation)
- Place of Birth (Text)
- Gender (Radio: Male/Female)
- Passport Photo (File upload, JPG/PNG, max 5MB, live preview)

**Section B: Contact Info**
- Address for Correspondence (Textarea, min 10 chars)
- Telephone Number(s) (Text, phone format validation)
- Email Address (Text, email format validation)
- Permanent Address (Textarea, optional toggle)

#### Step 2: Programme & Education History
**Section A: Programme**
- Level of Study (Radio: Undergraduate/Postgraduate)
- 1st-4th Programme Choice (Text, 1st required)
- Method of Study (Dropdown: Full-time/Part-time, required for Postgraduate)

**Section B: Academic Background**
**For Undergraduate:**
- School Name (Text)
- From-To Dates (Date pickers)
- Subjects Studied (Text)
- Year Examinations Written (Numeric, 4-digit)
- Year Results Obtained (Numeric, 4-digit)
- Grades Achieved (Text)

**For Postgraduate:**
- University/College (Text)
- From-To Dates (Date pickers)
- Programme (Text)
- Qualification (Text)
- Date of Award (Date picker)
- Class of Award (Dropdown)

#### Step 3: Work Experience & Motivation
**Section A: Work Experience (Postgraduate Only)**
- From-To Dates (Date pickers)
- Organization (Text)
- Position/Nature of Work (Text)
- Dynamic repeatable rows

**Section B: Motivation**
- Motivation Essay (Rich textarea, 300-500 words)
- Upload Motivation Note (Optional toggle, PDF/DOCX, max 5MB)

#### Step 4: Special Needs & Financial Info
**Section A: Special Requirements**
- Disability/Condition Toggle (Yes/No)
- Description (Textarea, required if Yes)

#### Step 5: Referees & Final Declaration
**Section A: Referees (Minimum 2, Maximum 3)**
- Name (Text)
- Position (Text)
- Institution/Company (Text)
- Address (Textarea)
- Email (Text, email validation)

**Section B: Declaration**
- Declaration Checkbox (Required)
- Full Name (Text)
- Date (Auto-filled)
- Final Checklist (All items required)

## Technical Implementation

### 🏗️ Architecture
- **React TypeScript** with functional components
- **Context API** for state management
- **Custom Hooks** for validation and form logic
- **CSS Modules** for component-specific styling
- **Responsive Grid Layout** for optimal UX

### 🔧 Key Components

#### ApplicationContext.tsx
- Central state management for all form data
- Autosave functionality (30-second intervals)
- Validation logic for each step
- Dynamic row management for work experience and referees
- Progress calculation and step validation

#### ApplicationForm.tsx
- Main form container with progress bar
- Step navigation and rendering
- Form submission handling
- Loading states and error handling

#### Step Components
- **Step1PersonalInfo.tsx** - Personal and contact information
- **Step2ProgramEducation.tsx** - Programme selection and education history
- **Step3WorkMotivation.tsx** - Work experience and motivation essay
- **Step4SpecialNeeds.tsx** - Special requirements and support
- **Step5RefereesDeclaration.tsx** - Referees and final declaration

### ✅ Validation Rules

#### Field Validation
- **Required Fields**: All marked with asterisk (*)
- **Text Length**: First/Last name max 50 chars
- **Age Validation**: Date of birth must be 16+ years
- **Email Format**: Standard email validation
- **Phone Format**: International phone number support
- **File Types**: JPG/PNG for photos, PDF/DOCX for documents
- **File Size**: Maximum 5MB per file
- **Word Count**: Motivation essay 300-500 words
- **Referee Count**: Minimum 2, maximum 3

#### Conditional Validation
- Postgraduate students must provide work experience
- Disability description required if disability indicated
- Method of study required for postgraduate applications
- Different education fields based on study level

### 🎨 UX Features

#### Visual Feedback
- **Progress Bar**: Real-time completion percentage
- **Step Status**: Complete/Incomplete indicators
- **Error Messages**: Immediate feedback below fields
- **Success Icons**: Visual confirmation for completed steps
- **File Previews**: Image thumbnails and file information

#### Navigation
- **Step Navigation**: Click to jump between completed steps
- **Back/Next Buttons**: Intuitive navigation
- **Save & Exit**: Always visible for draft saving
- **Validation Gates**: Cannot proceed without completing required fields

#### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Large buttons and form elements
- **Flexible Layout**: Grid system adapts to screen width
- **Readable Typography**: Optimized font sizes and spacing

### 🔄 Autosave Functionality

#### Save Triggers
- Every 30 seconds automatically
- On step navigation
- On form submission
- Manual save button

#### Save Features
- **Draft Storage**: Saves to backend API
- **Last Saved Indicator**: Shows timestamp of last save
- **Error Handling**: Graceful failure with user notification
- **Token Authentication**: Secure API calls with JWT

### 📱 Responsive Breakpoints

- **Desktop**: 1024px+ (Full layout with sidebar navigation)
- **Tablet**: 768px-1023px (Stacked layout)
- **Mobile**: <768px (Single column, optimized touch targets)

## API Integration

### Endpoints Required
```javascript
// Save draft
POST /api/application/save-draft
{
  userId: string,
  data: ApplicationData,
  lastSaved: string
}

// Load draft
GET /api/application/load-draft
Authorization: Bearer <token>

// Submit application
POST /api/application/submit
{
  data: ApplicationData
}
```

### Data Structure
```typescript
interface ApplicationData {
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
```

## Usage

### Basic Implementation
```jsx
import ApplicationForm from './pages/Application/ApplicationForm';

function App() {
  return (
    <div className="App">
      <ApplicationForm />
    </div>
  );
}
```

### With Custom Styling
```jsx
import ApplicationForm from './pages/Application/ApplicationForm';
import './custom-styles.css';

function App() {
  return (
    <div className="custom-app-container">
      <ApplicationForm />
    </div>
  );
}
```

## Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## Performance

- **Lazy Loading**: Components load on demand
- **Optimized Renders**: React.memo for performance
- **Efficient Validation**: Debounced validation calls
- **Minimal Re-renders**: Optimized state updates

## Accessibility

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Logical tab order
- **Color Contrast**: WCAG AA compliant
- **Screen Reader**: Compatible with assistive technologies

## Future Enhancements

- [ ] Rich text editor for motivation essay
- [ ] Document preview for uploaded files
- [ ] Offline support with local storage
- [ ] Multi-language support
- [ ] Advanced analytics and tracking
- [ ] Integration with payment systems
- [ ] Email notifications and reminders 