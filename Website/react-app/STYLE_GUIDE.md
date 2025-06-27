# MUST E-Portal Style Guide

## Overview
This style guide ensures consistent design, spacing, and typography across all pages of the MUST E-Portal application.

## CSS Variables

### Colors
```css
/* Primary Colors */
--primary: #003366;           /* Main brand color */
--primary-light: #004080;     /* Lighter primary */
--primary-dark: #002244;      /* Darker primary */

/* Secondary Colors */
--secondary: #4CAF50;         /* Success/action color */
--secondary-light: #66bb6a;   /* Lighter secondary */
--secondary-dark: #388e3c;    /* Darker secondary */

/* Accent Colors */
--accent: #FF9800;            /* Warning/highlight color */
--accent-light: #ffb74d;      /* Lighter accent */
--accent-dark: #f57c00;       /* Darker accent */

/* Neutral Colors */
--light: #f5f7fa;             /* Background color */
--dark: #1a2a3a;              /* Text color */
--white: #ffffff;             /* Pure white */
--gray-50: #f9fafb;           /* Very light gray */
--gray-100: #f3f4f6;          /* Light gray */
--gray-200: #e5e7eb;          /* Border gray */
--gray-300: #d1d5db;          /* Input border */
--gray-400: #9ca3af;          /* Placeholder text */
--gray-500: #6b7280;          /* Secondary text */
--gray-600: #4b5563;          /* Body text */
--gray-700: #374151;          /* Headings */
--gray-800: #1f2937;          /* Dark text */
--gray-900: #111827;          /* Very dark text */

/* Status Colors */
--success: #28a745;           /* Success state */
--success-light: #d4edda;     /* Success background */
--success-dark: #155724;      /* Success text */
--warning: #ffc107;           /* Warning state */
--warning-light: #fff3cd;     /* Warning background */
--warning-dark: #856404;      /* Warning text */
--danger: #dc3545;            /* Error state */
--danger-light: #f8d7da;      /* Error background */
--danger-dark: #721c24;       /* Error text */
--info: #17a2b8;              /* Info state */
--info-light: #d1ecf1;        /* Info background */
--info-dark: #0c5460;         /* Info text */
```

### Spacing
```css
--spacing-xs: 0.25rem;   /* 4px - Very small spacing */
--spacing-sm: 0.5rem;    /* 8px - Small spacing */
--spacing-md: 1rem;      /* 16px - Medium spacing */
--spacing-lg: 1.5rem;    /* 24px - Large spacing */
--spacing-xl: 2rem;      /* 32px - Extra large spacing */
--spacing-2xl: 3rem;     /* 48px - 2x extra large */
--spacing-3xl: 4rem;     /* 64px - 3x extra large */
```

### Typography
```css
--font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
--font-size-xs: 0.75rem;   /* 12px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-base: 1rem;    /* 16px */
--font-size-lg: 1.125rem;  /* 18px */
--font-size-xl: 1.25rem;   /* 20px */
--font-size-2xl: 1.5rem;   /* 24px */
--font-size-3xl: 1.875rem; /* 30px */
--font-size-4xl: 2.25rem;  /* 36px */

--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

### Border Radius
```css
--radius-sm: 4px;      /* Small radius */
--radius: 8px;         /* Default radius */
--radius-md: 12px;     /* Medium radius */
--radius-lg: 16px;     /* Large radius */
--radius-xl: 20px;     /* Extra large radius */
--radius-full: 9999px; /* Full circle */
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

### Transitions
```css
--transition-fast: all 0.15s ease;
--transition: all 0.3s ease;
--transition-slow: all 0.5s ease;
```

## Component Guidelines

### Buttons
```css
/* Base button styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius);
  font-weight: 600;
  font-size: var(--font-size-base);
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
  min-height: 44px; /* Touch target size */
}

/* Button variants */
.btn-primary { background: var(--primary); color: var(--white); }
.btn-secondary { background: var(--secondary); color: var(--white); }
.btn-outline { background: transparent; color: var(--primary); border: 2px solid var(--primary); }
.btn-success { background: var(--success); color: var(--white); }
.btn-danger { background: var(--danger); color: var(--white); }

/* Button sizes */
.btn-sm { padding: var(--spacing-sm) var(--spacing-md); font-size: var(--font-size-sm); min-height: 36px; }
.btn-lg { padding: var(--spacing-lg) var(--spacing-xl); font-size: var(--font-size-lg); min-height: 52px; }
```

### Forms
```css
/* Form group */
.form-group {
  margin-bottom: var(--spacing-lg);
}

/* Form labels */
.form-label {
  display: block;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

/* Form inputs */
.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius);
  font-size: var(--font-size-base);
  transition: var(--transition);
  background: var(--white);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(0, 51, 102, 0.1);
}

/* Error states */
.form-input.error,
.form-select.error,
.form-textarea.error {
  border-color: var(--danger);
  background: var(--danger-light);
}

.error-message {
  color: var(--danger);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
  font-weight: 500;
}
```

### Cards
```css
.card {
  background: var(--white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
}
```

### Navigation
```css
/* Header navigation */
.nav-link {
  color: var(--white);
  text-decoration: none;
  font-weight: 600;
  font-size: var(--font-size-base);
  transition: var(--transition);
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 2px solid transparent;
  display: block;
  white-space: nowrap;
  border-radius: var(--radius);
}

.nav-link:hover {
  color: var(--accent);
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 2px solid var(--accent);
  transform: translateY(-1px);
}

.nav-link.active {
  color: var(--accent);
  border-bottom: 2px solid var(--accent);
  background: rgba(255, 255, 255, 0.05);
}
```

## Layout Guidelines

### Container
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}
```

### Page Layout
```css
.page-container {
  min-height: calc(100vh - 80px); /* Account for header height */
  padding: var(--spacing-2xl) 0;
}
```

### Grid System
```css
.grid {
  display: grid;
  gap: var(--spacing-lg);
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
```

### Flexbox Utilities
```css
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-sm { gap: var(--spacing-sm); }
.gap-md { gap: var(--spacing-md); }
.gap-lg { gap: var(--spacing-lg); }
```

## Responsive Design

### Breakpoints
```css
/* Tablet */
@media (max-width: 1024px) {
  .grid-cols-4 { grid-template-columns: repeat(3, 1fr); }
}

/* Mobile */
@media (max-width: 768px) {
  .grid-cols-3,
  .grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
  
  .container {
    padding: 0 var(--spacing-md);
  }
  
  .page-container {
    padding: var(--spacing-xl) 0;
  }
  
  .card {
    padding: var(--spacing-lg);
  }
}

/* Small Mobile */
@media (max-width: 640px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 { grid-template-columns: 1fr; }
  
  .flex {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
```

## Typography Guidelines

### Headings
- Use semantic heading hierarchy (h1, h2, h3, etc.)
- Maintain consistent font weights and sizes
- Use appropriate line heights for readability

### Body Text
- Use `var(--font-size-base)` for body text
- Maintain `var(--line-height-relaxed)` for better readability
- Use `var(--gray-600)` for body text color

### Links
- Use `var(--primary)` for link color
- Include hover states with `var(--primary-light)`
- Maintain consistent transition timing

## Accessibility Guidelines

### Focus States
```css
:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### Touch Targets
- Minimum 44px height for interactive elements
- Adequate spacing between touch targets

### Color Contrast
- Ensure sufficient contrast ratios (WCAG AA compliant)
- Don't rely solely on color to convey information

## Best Practices

1. **Use CSS Variables**: Always use the defined CSS variables for colors, spacing, and typography
2. **Consistent Spacing**: Use the spacing scale consistently across components
3. **Responsive Design**: Design mobile-first and use appropriate breakpoints
4. **Accessibility**: Ensure all interactive elements are keyboard accessible
5. **Performance**: Minimize CSS specificity and avoid deep nesting
6. **Maintainability**: Use semantic class names and organize CSS logically

## File Organization

```
src/
├── index.css              # Global styles and CSS variables
├── App.css                # App-specific styles
├── components/
│   └── Header/
│       └── Header.css     # Header component styles
└── pages/
    ├── Home/
    │   └── Home.css       # Home page styles
    ├── Application/
    │   ├── ApplicationForm.css
    │   ├── Step1PersonalInfo.css
    │   ├── Step2ProgramEducation.css
    │   ├── Step3WorkMotivation.css
    │   ├── Step4SpecialNeeds.css
    │   └── Step5RefereesDeclaration.css
    ├── Dashboard/
    │   └── Dashboard.css  # Dashboard styles
    ├── Contact/
    │   └── Contact.css    # Contact page styles
    ├── Auth/
    │   └── Auth.css       # Authentication styles
    └── Admin/
        └── AdminDashboard.css # Admin styles
```

## Implementation Notes

- All styles should be imported in the correct order (global → component → page)
- CSS variables are defined in `index.css` and available globally
- Component styles should be scoped to their specific components
- Page styles should be scoped to their specific pages
- Use utility classes for common patterns (spacing, flexbox, etc.)
- Maintain consistent naming conventions across all CSS files 