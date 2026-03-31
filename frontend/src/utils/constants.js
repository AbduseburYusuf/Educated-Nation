export const STUDENT_LEVELS = [
  { value: 'Grade 9-12', label: 'Grade 9-12' },
  { value: 'College', label: 'College' },
  { value: 'University', label: 'University' }
];

export const EDUCATION_LEVELS = [
  { value: null, label: 'N/A' },
  { value: 1, label: 'Diploma' }, // Match DB ids
  { value: 2, label: 'Degree' },
  { value: 3, label: 'Masters' }
];

export const PERSON_TYPES = [
  { value: 'student', label: 'Student' },
  { value: 'worker', label: 'Worker' },
  { value: 'unemployed_graduate', label: 'Unemployed Graduate' }
];

export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];

export const REGION_VILLAGE_OPTIONS = {
  Afar: ['Ifat'],
  Harari: ['Omerdin', 'Koromi', 'Hulo', 'Afardeba'],
  Oromia: ['Esakoy', 'Adasha', 'Ikiyo']
};

export const SAMPLE_PROFESSIONS = [
  'Nurse',
  'Software Engineer', 
  'Doctor',
  'Teacher',
  'Engineer'
];
