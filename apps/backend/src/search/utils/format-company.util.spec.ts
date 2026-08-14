import { formatCompanyResponse } from './format-company.util';

const rawResponse = {
  clearbit: [
    { name: 'Microsoft Office', domain: 'office.com', logo: null },
    { name: 'Microsoft', domain: 'microsoft.com', logo: null },
    {
      name: 'Microsoft Casual Games',
      domain: 'microsoftcasualgames.com',
      logo: null,
    },
    { name: 'Microsoft OneNote', domain: 'onenote.com', logo: null },
    {
      name: 'Microsoft Flight Simulator',
      domain: 'flightsimulator.com',
      logo: null,
    },
  ],
  wikipedia: {
    title: 'Microsoft',
    description: 'American multinational technology company',
    extract:
      'Microsoft Corporation is an American multinational technology company headquartered in Redmond, Washington.',
  },
  linkedin: {
    website: 'https://news.microsoft.com/',
    industry: 'Software Development',
    companySize: '10,001+ employees',
    headquarters: 'Redmond, Washington',
    founded: '2001',
    specialties: 'Business Software, Developer Tools',
    people: [
      {
        name: 'Satya Nadella',
        link: 'https://www.linkedin.com/in/satyanadella',
      },
    ],
  },
};

describe('formatCompanyResponse', () => {
  it('formats full response with wikipedia name and computed age', () => {
    const result = formatCompanyResponse(rawResponse);

    expect(result).toEqual({
      name: 'Microsoft',
      website: 'https://news.microsoft.com/',
      otherSites: [
        'office.com',
        'microsoft.com',
        'microsoftcasualgames.com',
        'onenote.com',
        'flightsimulator.com',
      ],
      industry: 'Software Development',
      companySize: '10,001+ employees',
      headquarters: 'Redmond, Washington',
      founded: '2001',
      age: new Date().getFullYear() - 2001,
      specialties: 'Business Software, Developer Tools',
      people: [
        {
          name: 'Satya Nadella',
          link: 'https://www.linkedin.com/in/satyanadella',
        },
      ],
      description: 'American multinational technology company',
      extract:
        'Microsoft Corporation is an American multinational technology company headquartered in Redmond, Washington.',
      partialError: undefined,
    });
  });

  it('falls back to clearbit first name when wikipedia is missing', () => {
    const rest = { ...rawResponse };
    delete rest.wikipedia;
    const result = formatCompanyResponse(rest);

    expect(result.name).toBe('Microsoft Office');
  });

  it('drops clearbit domains matching the website ignoring scheme and www', () => {
    const result = formatCompanyResponse({
      ...rawResponse,
      clearbit: [
        { name: 'News', domain: 'https://www.news.microsoft.com/', logo: null },
        { name: 'WWW', domain: 'www.news.microsoft.com', logo: null },
        { name: 'Keep', domain: 'microsoft.com', logo: null },
      ],
      linkedin: { website: 'https://news.microsoft.com/' },
    });

    expect(result.otherSites).toEqual(['microsoft.com']);
  });

  it('omits age when founded is not a year', () => {
    const result = formatCompanyResponse({
      ...rawResponse,
      linkedin: { founded: undefined },
    });

    expect(result.age).toBeUndefined();
  });

  it('passes partialError through', () => {
    const result = formatCompanyResponse({
      ...rawResponse,
      partialError: { wikipedia: 'unavailable' },
    });

    expect(result.partialError).toEqual({ wikipedia: 'unavailable' });
  });
});
