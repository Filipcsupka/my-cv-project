import React from 'react';

const cvData = {
  summary: 'A highly motivated and experienced DevOps and Site Reliability Engineer with a proven track record of managing and scaling infrastructure. Passionate about automation, monitoring, and building resilient systems.',
  experience: [
    {
      role: 'DevOps / Kubernetes',
      company: 'ProsoftKe',
      period: 'Apr 2022 — Jun 2022',
      location: 'Košice',
      description: [
        'Engineered and managed CI/CD pipelines for fast, reliable deployments to Azure Kubernetes Service (AKS).',
        'Oversaw 100+ microservices across 6 environments/clusters, managing configurations and settings using GitOps principles with ArgoCD.',
        'Implemented and maintained monitoring with Prometheus, Grafana, and Alertmanager, deployed via official Helm charts.',
        'Conducted troubleshooting across distributed systems involving Kafka, MongoDB, and PostgreSQL.',
      ],
    },
    {
      role: 'DevOps Engineer',
      company: 'Ness Digital Engineering',
      period: 'Oct 2020 — 2022',
      location: 'Košice',
      description: [
        'Preparing for AWS Certified Solutions Architect - Associate certification.',
      ],
    },
    {
      role: 'Head of Team / Admin',
      company: 'Datagroup',
      period: 'Jan 2018 — Oct 2020',
      location: 'Košice',
      description: [
        'Led the Lotus Notes technology team, providing technical leadership and guidance.',
        'Participated in the Groupware team, responsible for new technology rollouts.',
        'Managed documentation, vendor relationships, and customer migrations to modern platforms like Exchange and Teams.',
        'Fostered team growth, skill development, and high-quality service delivery.',
      ],
    },
    {
      role: 'Head of Team / Admin',
      company: 'Diebold Nixdorf',
      period: 'Prior to Jan 2018',
      location: 'Košice',
      description: [
        'Monitored and improved the performance and morale of the administration team.',
        'Managed a team of professionals to ensure service quality and customer satisfaction.',
        'Collaborated with department heads and customers on strategic initiatives.',
        'Organized company activities and events to promote a positive work environment.',
      ],
    },
  ],
  skills: [
    'Kubernetes',
    'Docker',
    'Prometheus',
    'Grafana',
    'Alertmanager',
    'ArgoCD',
    'GitOps',
    'CI/CD',
    'Azure (AKS)',
    'Helm',
    'Kafka',
    'MongoDB',
    'PostgreSQL',
    'AWS (in preparation)',
  ],
};

const CV = () => {
  return (
    <section id="cv" className="bg-white p-8 rounded-lg shadow-md">
      <h3 className="text-3xl font-bold text-gray-900 mb-6">Curriculum Vitae</h3>
      
      <div className="mb-8">
        <h4 className="text-2xl font-semibold text-gray-800 mb-4">Professional Summary</h4>
        <p className="text-gray-700">{cvData.summary}</p>
      </div>

      <div className="mb-8">
        <h4 className="text-2xl font-semibold text-gray-800 mb-4">Work Experience</h4>
        <div className="space-y-6">
          {cvData.experience.map((job, index) => (
            <div key={index} className="border-l-4 border-gray-300 pl-4">
              <h5 className="text-xl font-bold text-gray-900">{job.role}</h5>
              <p className="font-semibold text-gray-700">{job.company} | {job.location}</p>
              <p className="text-sm text-gray-600 mb-2">{job.period}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {job.description.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-2xl font-semibold text-gray-800 mb-4">Skills</h4>
        <div className="flex flex-wrap gap-2">
          {cvData.skills.map((skill, index) => (
            <span key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CV;