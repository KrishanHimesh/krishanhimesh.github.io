import React, { useState } from 'react';
import './Projects.css';

const projects = [
  {
    id: 1,
    title: 'KN University Network Design',
    category: 'Networking',
    tags: ['VLAN', 'Firewall', 'Active Directory', 'RBAC', 'IoT', 'Cloud'],
    description:
      'Designed a secure multi-campus network infrastructure for KN University, implementing VLANs, firewalls, and IoT integration for enhanced scalability. Deployed Active Directory with Role-Based Access Control (RBAC) and prototyped physical network configurations with cloud solutions.',
    highlights: [
      'Multi-campus network architecture',
      'VLAN segmentation & firewall rules',
      'Active Directory with RBAC',
      'IoT device integration',
    ],
    github: 'https://github.com/KrishanHimesh/KN_University_Network_Design-Cyber_Security_Project_G02',
    color: '#00d4ff',
  },
  {
    id: 2,
    title: 'CQ Smart Systems — Smart Home',
    category: 'IoT & Cloud',
    tags: ['Azure IoT', 'Node-RED', 'Kubernetes', 'Docker', 'Security'],
    description:
      'Cloud-based IoT home management system built on Azure IoT Hub and Node-RED, enabling real-time monitoring and control of home devices from a centralised interface. Used Kubernetes and Docker for containerised deployment with robust security protocols.',
    highlights: [
      'Azure IoT Hub integration',
      'Node-RED dashboard interface',
      'Kubernetes & Docker deployment',
      'End-to-end device security',
    ],
    github: null,
    color: '#7b61ff',
  },
  {
    id: 3,
    title: 'BiZChat — AI Business Advisor',
    category: 'AI & Dev',
    tags: ['Dialogflow', 'ChatGPT API', 'Python', 'NLP', 'Speech Recognition'],
    description:
      'AI-powered business advisor chatbot designed to help small business owners make informed decisions. Built with Dialogflow and ChatGPT API, featuring speech recognition and a Python GUI for accessible, conversational business guidance.',
    highlights: [
      'Conversational AI with Dialogflow',
      'ChatGPT API integration',
      'Speech recognition support',
      'Python GUI application',
    ],
    github: null,
    color: '#00ff9d',
  },
  {
    id: 4,
    title: 'Facial Recognition Attendance',
    category: 'AI & Dev',
    tags: ['OpenCV', 'HOG', 'Python', 'Face Recognition', 'Privacy'],
    description:
      'Real-time automated attendance tracking system using OpenCV and Histogram of Oriented Gradients (HOG) for face recognition. Built with privacy compliance at its core, ensuring secure handling of captured data.',
    highlights: [
      'Real-time face detection (OpenCV)',
      'HOG-based recognition algorithm',
      'Automated attendance logging',
      'Privacy-compliant data handling',
    ],
    github: null,
    color: '#ff6b6b',
  },
  {
    id: 5,
    title: 'Cryptography Security Project',
    category: 'Security',
    tags: ['Diffie-Hellman', 'AES Encryption', 'Python', 'Cryptography', 'Secure Comms'],
    description:
      'Implemented Diffie-Hellman key exchange and AES encryption to establish a secure communication channel between client and server applications. Includes detailed analysis of the encryption and key exchange processes.',
    highlights: [
      'Diffie-Hellman key exchange',
      'AES encryption & decryption',
      'Secure client-server channel',
      'Cryptographic analysis',
    ],
    github: 'https://github.com/KrishanHimesh/coit13240y24t1-project-g09',
    color: '#ffd93d',
  },
];

const categories = ['All', 'Networking', 'IoT & Cloud', 'AI & Dev', 'Security'];

export default function Projects() {
  const [active, setActive] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = active === 'All' ? projects : projects.filter(p => p.category === active);

  return (
    <div className="projects-page page">
      <div className="container">
        <p className="section-label">// my work</p>
        <h1 className="section-title">Projects</h1>
        <p className="projects-intro">
          A collection of academic and personal projects spanning network design,
          cloud infrastructure, AI, and cybersecurity.
        </p>

        <div className="filter-bar">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${active === cat ? 'active' : ''}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filtered.map(project => (
            <div
              key={project.id}
              className={`project-card ${expanded === project.id ? 'expanded' : ''}`}
              style={{ '--project-color': project.color }}
            >
              <div className="card-header">
                <div className="card-meta">
                  <span className="card-category">{project.category}</span>
                  <span className="card-num">0{project.id}</span>
                </div>
                <h3 className="card-title">{project.title}</h3>
                <div className="card-tags">
                  {project.tags.map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>

              <p className="card-desc">{project.description}</p>

              <ul className="card-highlights">
                {project.highlights.map(h => (
                  <li key={h}><span className="hl-arrow">→</span> {h}</li>
                ))}
              </ul>

              <div className="card-actions">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
