import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Programs.css';

interface Programme {
  name: string;
  level: 'Undergraduate' | 'Postgraduate';
  duration: string;
  description: string;
}

interface School {
  name: string;
  fullName: string;
  acronym: string;
  programmes: Programme[];
  departments: number;
  description: string;
}

const Programs: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const schools: School[] = [
    {
      name: "Malawi Institute of Technology",
      fullName: "Malawi Institute of Technology",
      acronym: "MIT",
      programmes: [
        {
          name: "Bachelor of Science in Computer Science",
          level: "Undergraduate",
          duration: "4 years",
          description: "Comprehensive program covering software development, algorithms, and computer systems."
        },
        {
          name: "Bachelor of Engineering in Civil Engineering",
          level: "Undergraduate", 
          duration: "5 years",
          description: "Professional engineering program focusing on infrastructure development and construction."
        },
        {
          name: "Bachelor of Engineering in Electrical Engineering",
          level: "Undergraduate",
          duration: "5 years", 
          description: "Covers power systems, electronics, and electrical infrastructure development."
        },
        {
          name: "Bachelor of Engineering in Mechanical Engineering",
          level: "Undergraduate",
          duration: "5 years",
          description: "Focus on machine design, manufacturing, and mechanical systems."
        },
        {
          name: "Bachelor of Engineering in Chemical Engineering",
          level: "Undergraduate",
          duration: "5 years",
          description: "Industrial processes, chemical plant design, and process optimization."
        },
        {
          name: "Bachelor of Science in Information Technology",
          level: "Undergraduate",
          duration: "4 years",
          description: "IT systems, network administration, and information management."
        },
        {
          name: "Bachelor of Science in Applied Mathematics",
          level: "Undergraduate",
          duration: "4 years",
          description: "Mathematical modeling, statistics, and computational mathematics."
        },
        {
          name: "Bachelor of Science in Applied Physics",
          level: "Undergraduate",
          duration: "4 years",
          description: "Physics principles applied to technology and engineering solutions."
        },
        {
          name: "Bachelor of Science in Applied Chemistry",
          level: "Undergraduate",
          duration: "4 years",
          description: "Chemistry applications in industry, materials science, and technology."
        },
        {
          name: "Bachelor of Science in Architecture",
          level: "Undergraduate",
          duration: "5 years",
          description: "Building design, urban planning, and architectural technology."
        },
        {
          name: "Bachelor of Science in Quantity Surveying",
          level: "Undergraduate",
          duration: "4 years",
          description: "Construction cost management and project economics."
        },
        {
          name: "Bachelor of Science in Land Surveying",
          level: "Undergraduate",
          duration: "4 years",
          description: "Geospatial technology, mapping, and land measurement."
        },
        {
          name: "Bachelor of Science in Metallurgical Engineering",
          level: "Undergraduate",
          duration: "5 years",
          description: "Materials science, metal processing, and mining engineering."
        },
        {
          name: "Master of Science in Computer Science",
          level: "Postgraduate",
          duration: "2 years",
          description: "Advanced computing research and specialized applications."
        },
        {
          name: "Master of Engineering in Civil Engineering",
          level: "Postgraduate",
          duration: "2 years",
          description: "Advanced civil engineering with research component."
        },
        {
          name: "Master of Engineering in Electrical Engineering",
          level: "Postgraduate",
          duration: "2 years",
          description: "Specialized electrical engineering research and development."
        },
        {
          name: "Master of Science in Applied Mathematics",
          level: "Postgraduate",
          duration: "2 years",
          description: "Advanced mathematical research and applications."
        },
        {
          name: "Master of Science in Information Technology",
          level: "Postgraduate",
          duration: "2 years",
          description: "Advanced IT research and systems development."
        },
        {
          name: "Master of Science in Architecture",
          level: "Postgraduate",
          duration: "2 years",
          description: "Advanced architectural design and research."
        },
        {
          name: "PhD in Engineering",
          level: "Postgraduate",
          duration: "3-4 years",
          description: "Doctoral research in various engineering disciplines."
        },
        {
          name: "PhD in Computer Science",
          level: "Postgraduate",
          duration: "3-4 years",
          description: "Doctoral research in computer science and technology."
        }
      ],
      departments: 3,
      description: "MIT focuses on engineering, technology, and applied sciences, preparing graduates for industrial and technological leadership."
    },
    {
      name: "Ndata School of Climate and Earth Sciences",
      fullName: "Ndata School of Climate and Earth Sciences",
      acronym: "NSCES",
      programmes: [
        {
          name: "Bachelor of Science in Environmental Science",
          level: "Undergraduate",
          duration: "4 years",
          description: "Environmental conservation, pollution control, and sustainability."
        },
        {
          name: "Bachelor of Science in Meteorology",
          level: "Undergraduate",
          duration: "4 years",
          description: "Weather forecasting, climate analysis, and atmospheric sciences."
        },
        {
          name: "Bachelor of Science in Geology",
          level: "Undergraduate",
          duration: "4 years",
          description: "Earth sciences, mineral exploration, and geological mapping."
        },
        {
          name: "Bachelor of Science in Geography",
          level: "Undergraduate",
          duration: "4 years",
          description: "Physical and human geography with GIS applications."
        },
        {
          name: "Bachelor of Science in Climate Change and Sustainable Development",
          level: "Undergraduate",
          duration: "4 years",
          description: "Climate adaptation, mitigation strategies, and sustainable practices."
        },
        {
          name: "Bachelor of Science in Water Resources Management",
          level: "Undergraduate",
          duration: "4 years",
          description: "Water conservation, hydrology, and aquatic resource management."
        },
        {
          name: "Bachelor of Science in Mining Engineering",
          level: "Undergraduate",
          duration: "5 years",
          description: "Mineral extraction, mine planning, and resource development."
        },
        {
          name: "Bachelor of Science in Renewable Energy",
          level: "Undergraduate",
          duration: "4 years",
          description: "Solar, wind, and alternative energy systems development."
        },
        {
          name: "Master of Science in Environmental Science",
          level: "Postgraduate",
          duration: "2 years",
          description: "Advanced environmental research and policy development."
        },
        {
          name: "Master of Science in Climate Change",
          level: "Postgraduate",
          duration: "2 years",
          description: "Climate research, adaptation, and mitigation strategies."
        },
        {
          name: "Master of Science in Water Resources Management",
          level: "Postgraduate",
          duration: "2 years",
          description: "Advanced water management and conservation research."
        },
        {
          name: "Master of Science in Renewable Energy",
          level: "Postgraduate",
          duration: "2 years",
          description: "Advanced renewable energy systems and technology."
        },
        {
          name: "PhD in Environmental Sciences",
          level: "Postgraduate",
          duration: "3-4 years",
          description: "Doctoral research in environmental and earth sciences."
        }
      ],
      departments: 4,
      description: "NSCES addresses climate change, environmental conservation, and sustainable development challenges facing Malawi and Africa."
    },
    {
      name: "Bingu School of Culture and Heritage",
      fullName: "Bingu School of Culture and Heritage",
      acronym: "BISCH",
      programmes: [
        {
          name: "Bachelor of Arts in Cultural Studies",
          level: "Undergraduate",
          duration: "4 years",
          description: "Malawian and African cultural preservation, research, and development."
        },
        {
          name: "Bachelor of Arts in Heritage Management",
          level: "Undergraduate",
          duration: "4 years",
          description: "Cultural heritage conservation, museum studies, and tourism development."
        },
        {
          name: "Master of Arts in Cultural Studies",
          level: "Postgraduate",
          duration: "2 years",
          description: "Advanced research in African culture and heritage preservation."
        }
      ],
      departments: 3,
      description: "BISCH preserves and promotes Malawian and African cultural heritage while fostering cultural innovation and development."
    },
    {
      name: "Academy of Medical Sciences",
      fullName: "Academy of Medical Sciences",
      acronym: "AMS",
      programmes: [
        {
          name: "Bachelor of Medicine and Bachelor of Surgery",
          level: "Undergraduate",
          duration: "6 years",
          description: "Comprehensive medical education leading to medical practice qualification."
        },
        {
          name: "Bachelor of Science in Biomedical Sciences",
          level: "Undergraduate",
          duration: "4 years",
          description: "Foundation in medical sciences, research, and laboratory techniques."
        },
        {
          name: "Bachelor of Science in Medical Laboratory Sciences",
          level: "Undergraduate",
          duration: "4 years",
          description: "Clinical laboratory diagnostics and medical testing procedures."
        },
        {
          name: "Bachelor of Science in Radiography",
          level: "Undergraduate",
          duration: "4 years",
          description: "Medical imaging, diagnostic radiology, and radiation therapy."
        },
        {
          name: "Bachelor of Science in Physiotherapy",
          level: "Undergraduate",
          duration: "4 years",
          description: "Physical rehabilitation, therapeutic exercise, and patient care."
        },
        {
          name: "Master of Medicine",
          level: "Postgraduate",
          duration: "3-4 years",
          description: "Specialized medical training in various clinical disciplines."
        },
        {
          name: "Master of Science in Biomedical Sciences",
          level: "Postgraduate",
          duration: "2 years",
          description: "Advanced biomedical research and laboratory sciences."
        }
      ],
      departments: 2,
      description: "AMS trains healthcare professionals and conducts medical research to address Malawi's health challenges and improve healthcare delivery."
    }
  ];

  return (
    <main className="page-content">
      <section className="programs-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Academic Programmes</h1>
            <p>Discover world-class programmes at Malawi's premier science and technology university</p>
            
            <div className="hero-intro">
              <h2>Where Excellence Reigns</h2>
              <p>
                At MUST, we offer innovative programmes aligned with global development agendas including 
                MW2063, Africa Agenda 2063, and the UN Sustainable Development Goals. Our graduates are 
                internationally competitive and ready to lead in science, technology, and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="schools-section">
        <div className="container">
          {schools.map((school, index) => (
            <div key={index} className="school-section">
              <div className="school-header">
                <div className="school-info">
                  <h2>{school.name} ({school.acronym})</h2>
                  <p className="school-description">{school.description}</p>
                  <div className="school-stats">
                    <span className="stat">{school.programmes.length} Programmes</span>
                    <span className="stat">{school.departments} Departments</span>
                  </div>
                </div>
              </div>

              <div className="programmes-grid">
                {school.programmes.map((programme, progIndex) => (
                  <div key={progIndex} className="programme-card">
                    <div className="programme-header">
                      <h3>{programme.name}</h3>
                      <div className="programme-badges">
                        <span className={`level-badge ${programme.level.toLowerCase()}`}>
                          {programme.level}
                        </span>
                        <span className="duration-badge">{programme.duration}</span>
                      </div>
                    </div>
                    <p className="programme-description">{programme.description}</p>
                    <div className="programme-actions">
                      <Link to="/application" className="btn btn-sm btn-primary">
                        Apply Now
                      </Link>
                      <button className="btn btn-sm btn-outline">
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admission-info">
        <div className="container">
          <div className="admission-content">
            <h2>Ready to Join MUST?</h2>
            <p>
              Take the first step towards your academic excellence. Our admission process is designed 
              to identify talented individuals who are ready to contribute to Malawi's development 
              through science, technology, and innovation.
            </p>
            <div className="admission-features">
              <div className="feature">
                <i className="fas fa-graduation-cap"></i>
                <h3>Quality Education</h3>
                <p>World-class programmes with industry-relevant curriculum</p>
              </div>
              <div className="feature">
                <i className="fas fa-microscope"></i>
                <h3>Research Excellence</h3>
                <p>State-of-the-art facilities for cutting-edge research</p>
              </div>
              <div className="feature">
                <i className="fas fa-briefcase"></i>
                <h3>Career Ready</h3>
                <p>Graduates equipped for leadership in their fields</p>
              </div>
              <div className="feature">
                <i className="fas fa-globe-africa"></i>
                <h3>Global Impact</h3>
                <p>Contributing to Africa's development and global competitiveness</p>
              </div>
            </div>
            <div className="admission-cta">
              <Link to="/application" className="btn btn-primary btn-lg">
                Start Your Application
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Programs; 