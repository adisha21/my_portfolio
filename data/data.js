/* =========================================================
   Embedded data mirror.
   Used ONLY as a last-resort fallback when the JSON files in
   this folder cannot be fetched (e.g. opening index.html via
   the file:// protocol). The JSON files remain the source of
   truth; malformed JSON never silently falls back to this copy.
   ========================================================= */
'use strict';

window.PortfolioData = window.PortfolioData || {};

window.PortfolioData['data/profile.json'] = {
  name: 'Aditi Sharma',
  initials: 'AS',
  greeting: "Hello, I'm",
  role: 'Aspiring Software Developer',
  tagline: 'A software developer with a strong foundation in Java and experience in full-stack development and AI-driven applications, passionate about building scalable, user-focused solutions.',
  avatar: 'avatar-2.png',
  avatarAlt: 'Portrait of Aditi Sharma',
  resume: {
    label: 'View Resume',
    file: 'aditisharmaa.pdf'
  },
  about: {
    heading: 'About Me',
    paragraphs: [
      'Aspiring Software Developer with a strong foundation in Java and experience in full-stack development and AI-driven applications. Passionate about building scalable, user-focused solutions.',
      'My journey spans building intelligent computer-vision tools, RESTful web applications, and responsive interfaces — always focused on writing clean, maintainable code and learning new technologies along the way.'
    ]
  },
  meta: {
    title: 'Aditi Sharma - Portfolio',
    description: 'Portfolio of Aditi Sharma — Aspiring Software Developer specializing in full-stack development and AI-driven applications.'
  }
};

window.PortfolioData['data/skills.json'] = {
  groups: [
    {
      title: 'Programming Languages',
      items: [
        { name: 'Java', level: 90 },
        { name: 'Python', level: 85 },
        { name: 'JavaScript', level: 80 }
      ]
    },
    {
      title: 'Web Development',
      items: [
        { name: 'HTML & CSS', level: 90 },
        { name: 'React', level: 75 },
        { name: 'SQL & Databases', level: 70 }
      ]
    },
    {
      title: 'AI & Data',
      items: [
        { name: 'Machine Learning', level: 80 },
        { name: 'Computer Vision (OpenCV)', level: 75 },
        { name: 'TensorFlow', level: 70 }
      ]
    }
  ]
};

window.PortfolioData['data/education.json'] = {
  items: [
    {
      institution: 'Dr. Ambedkar Institute of Technology, Bangalore',
      degree: 'B.E. in Computer Science & Engineering',
      period: '2021 – 2025',
      badge: 'CGPA: 8.88'
    },
    {
      institution: 'Jawahar Navodaya Vidyalaya, Kathua',
      degree: 'Senior Secondary (CBSE), Science',
      period: '2020 – 2021',
      badge: '94.8%'
    }
  ]
};

window.PortfolioData['data/certifications.json'] = {
  items: [
    { title: 'AI with Python', issuer: 'Coincent' },
    { title: 'Programming in Java', issuer: 'NPTEL' },
    { title: 'Java Full Stack with React JS', issuer: 'Brainovision Solutions' }
  ]
};

window.PortfolioData['data/experience.json'] = {
  items: [
    {
      company: 'Zino Technologies',
      role: 'Implementation Engineer Intern',
      period: 'June 2025 – October 2025',
      highlights: [
        'Deploying and configuring client solutions based on business requirements.',
        'Supporting and validating Python-based APIs during implementation and integration.',
        'Assisting in troubleshooting API workflows and resolving client-side issues.',
        'Collaborating with internal teams and clients to ensure smooth deployment in live environments.'
      ]
    }
  ]
};

window.PortfolioData['data/projects.json'] = {
  items: [
    {
      id: 'mask-detection-system',
      title: 'Mask Detection System',
      icon: '👀',
      technologies: ['Python', 'AI', 'OpenCV'],
      description: 'Real-time face mask detection using computer vision.',
      date: '2024-03-01',
      image: 'https://via.placeholder.com/800x450/00b894/ffffff?text=Mask+Detection',
      details: 'This project implements a real-time face mask detection system using computer vision and deep learning. The system can detect whether people are wearing masks correctly, incorrectly, or not at all.'
    },
    {
      id: 'youtube-interface-clone',
      title: 'YouTube Interface Clone',
      icon: '🎥',
      technologies: ['HTML', 'CSS'],
      description: 'Responsive UI clone focusing on layout accuracy.',
      date: '2024-01-10',
      image: 'https://via.placeholder.com/800x450/00b894/ffffff?text=YouTube+Clone',
      details: 'A pixel-perfect responsive clone of YouTube\'s interface, demonstrating advanced CSS layout techniques including flexbox and grid. The project focuses on maintaining layout accuracy across different screen sizes.'
    },
    {
      id: 'food-calorie-estimation',
      title: 'Food Calorie Estimation',
      icon: '🍟',
      technologies: ['Python', 'TensorFlow', 'Streamlit'],
      description: 'CNN-based calorie estimation from food images.',
      date: '2024-06-15',
      image: 'https://via.placeholder.com/800x450/00b894/ffffff?text=Food+Calorie+Estimation',
      details: 'An AI-powered application that estimates calorie content from food images using convolutional neural networks. Built with TensorFlow and deployed using Streamlit for an interactive web interface.'
    },
    {
      id: 'trip-itinerary-planner',
      title: 'Trip Itinerary Planner',
      icon: '🌎',
      technologies: ['Python', 'Flask', 'HTML', 'CSS'],
      description: 'A web-based travel itinerary planner that generates personalized trip plans based on destination, duration, and user preferences — focused on improving travel planning efficiency and user experience.',
      date: '2024-10-20',
      image: 'https://via.placeholder.com/800x450/00b894/ffffff?text=Trip+Planner',
      details: 'A comprehensive web-based travel itinerary planner built with Flask. The application generates personalized trip plans based on user preferences including destination, duration, budget, and interests, streamlining the travel planning process.'
    }
  ]
};

window.PortfolioData['data/contact.json'] = {
  intro: 'Feel free to reach out through any of the channels below:',
  email: {
    label: 'aditisharma3118@gmail.com',
    href: 'mailto:aditisharma3118@gmail.com',
    icon: '✉'
  },
  phone: {
    label: '+91 6005199217',
    href: 'tel:+916005199217',
    icon: '☎'
  },
  links: [
    {
      label: 'LinkedIn Profile',
      href: 'https://www.linkedin.com/in/aditi-sharma3118/',
      icon: 'in',
      external: true
    },
    {
      label: 'GitHub Profile',
      href: 'https://github.com/adisha21',
      icon: '😎',
      external: true
    }
  ],
  codingProfiles: {
    title: 'Coding Profiles',
    items: [
      { label: 'Take U Forward', href: 'https://takeuforward.org/profile/adi_sha21' },
      { label: 'LeetCode', href: 'https://leetcode.com/u/adi_sha21/' },
      { label: 'Unstop', href: 'https://unstop.com/u/adi_sha21' }
    ]
  }
};
