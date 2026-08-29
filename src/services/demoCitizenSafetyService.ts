/*!
 * Demo Citizen Safety Service for Bhubaneswar Heat Early Warning System
 *
 * Currently returns demonstration data with simulated latency.
 * Future backend integration will replace fetchCitizenSafety() with
 * `GET /api/v1/citizen-safety` API response.
 */

export const demoCitizenSafetyService = {
  async fetchCitizenSafety() {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return {
      metadata: {
        scenario: 'Demonstration Scenario — Backend Not Connected',
        assessmentPeriod: 'Illustrative Heat Safety Snapshot (Demo)',
        isDemo: true,
        source:
          'Illustrative data for UI development. NOT official heat warnings, NOT a clinical diagnosis, and NOT connected to the backend analytics engine.',
      },
      currentRisk: {
        level: 'very_high',
        label: 'Very High Risk',
        description:
          'Severe heat stress is possible. Reduce outdoor exposure and take frequent cooling breaks.',
        urgency: 'critical',
        whatItMeans:
          'People who are older, very young, pregnant, chronically ill, or working outdoors may be at greater risk.',
        extraPrecautions: ['Minimize time outdoors, especially during peak heat', 'Seek air-conditioned or cool indoor spaces when possible', 'Keep hydrated with regular water intake'],
      },
      recommendations: [
        { category: 'everyone', title: 'Drink water regularly', description: 'Stay hydrated throughout the day, even if you do not feel thirsty.' },
        { category: 'everyone', title: 'Avoid unnecessary outdoor activity during peak heat', description: 'Limit time outside between 11:00 and 15:00 when temperatures are highest.' },
      ],
    };
  },

  async getMetadata() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      scenario: 'Demonstration Scenario — Backend Not Connected',
      assessmentPeriod: 'Illustrative Heat Safety Snapshot (Demo)',
      isDemo: true,
      source:
        'Illustrative data for UI development. NOT official heat warnings, NOT a clinical diagnosis, and NOT connected to the backend analytics engine.',
    };
  },
};