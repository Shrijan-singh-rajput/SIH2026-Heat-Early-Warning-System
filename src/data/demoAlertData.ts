/**
 * Demonstration Alert Data for Bhubaneswar Heat Early Warning System
 *
 * IMPORTANT: This is DEMONSTRATION DATA ONLY for UI development.
 * These are NOT real alerts, NOT real government notifications, and NOT
 * live measurements. All values are illustrative only.
 *
 * Backend integration will replace this file with actual API responses from:
 * - GET /api/v1/alerts/active
 * - GET /api/v1/alerts/history
 * - Heat risk engine calculations
 * - Ward vulnerability models
 */

import type { RiskLevel } from '../types';

/**
 * Alert status states
 */
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'scheduled';

/**
 * Alert priority levels
 */
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Notification channel states
 */
export type NotificationChannelStatus = 'not-connected' | 'ready' | 'sending' | 'delivered' | 'failed';

/**
 * Alert audience categories
 */
export type AlertAudience = 'general-public' | 'older-adults' | 'children' | 'outdoor-workers' | 'municipal-field-teams' | 'healthcare-facilities' | 'emergency-response';

/**
 * Alert channel types
 */
export type AlertChannel = 'sms' | 'whatsapp' | 'dashboard' | 'public-display' | 'municipal-operations';

/**
 * Individual notification channel configuration
 */
export interface AlertChannelConfig {
  channel: AlertChannel;
  status: NotificationChannelStatus;
  audience: AlertAudience;
  recipientCount?: number;
  messageTemplate?: string;
  language?: string;
}

/**
 * Full alert data structure
 *
 * Designed to mirror a future GET /api/v1/alerts response shape
 * so the demonstration data can be swapped for the API response
 * without restructuring the presentation components.
 */
export interface Alert {
  id: string;
  severity: RiskLevel;
  title: string;
  area: string;
  affectedWards: string[];
  description: string;
  trigger: {
    utcI?: number;
    wbgt?: number;
    temperature: number; // °C
    humidity: number; // %
    windSpeed: number; // m/s
    heatIndex?: number;
    solarRadiation?: number; // W/m²
  };
  vulnerability: {
    score: number; // 0-100
    vulnerablePopulation: number; // people
    atRiskGroups: string[]; // e.g. ['older-adults', 'children']
  };
  recommendedAction: string;
  status: AlertStatus;
  priority: AlertPriority;
  intendedAudience: AlertAudience[];
  geographicScope: 'ward' | 'multi-ward' | 'citywide';
  notificationChannels: AlertChannelConfig[];
  issuedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

/**
 * Alert metadata/provenance
 */
export interface AlertMetadata {
  scenario: string;
  assessmentPeriod: string;
  isDemo: boolean;
  source: string;
}

/**
 * Top-level alert collection payload
 */
export interface AlertCollection {
  metadata: AlertMetadata;
  alerts: Alert[];
}

/**
 * DEMO DATA — Demonstration scenario for UI development
 *
 * This represents a hypothetical high-heat situation in Bhubaneswar
 * during peak summer conditions. Values are illustrative only.
 * All five risk levels (LOW, MODERATE, HIGH, VERY HIGH, EXTREME) are included.
 */
export const DEMO_ALERT_DATA: AlertCollection = {
  metadata: {
    scenario: 'Demonstration Scenario — Backend Not Connected',
    assessmentPeriod: 'Current Conditions (Demo)',
    isDemo: true,
    source: 'Illustrative demonstration data — not an official government alert',
  },

  alerts: [
    {
      id: 'DEMO-ALERT-001',
      severity: 'extreme',
      title: 'Extreme Heat Alert',
      area: 'Ward 03',
      affectedWards: ['Ward 03'],
      description:
        'Extreme heat conditions are expected with UTCI values exceeding 45°C. Emergency response may be required. Immediate precautionary measures recommended.',
      trigger: {
        temperature: 42.5,
        humidity: 72,
        windSpeed: 3.2,
        heatIndex: 54.8,
      },
      vulnerability: {
        score: 88,
        vulnerablePopulation: 8200,
        atRiskGroups: ['older-adults', 'children'],
      },
      recommendedAction:
        'Activate cooling centers. Issue immediate heat health advisories. Review and adjust outdoor work schedules.',
      status: 'active',
      priority: 'critical',
      intendedAudience: ['general-public', 'older-adults', 'children'],
      geographicScope: 'ward',
      notificationChannels: [
        {
          channel: 'dashboard',
          status: 'ready',
          audience: 'general-public',
        },
        {
          channel: 'sms',
          status: 'not-connected',
          audience: 'general-public',
        },
        {
          channel: 'whatsapp',
          status: 'not-connected',
          audience: 'general-public',
        },
      ],
      issuedAt: '2026-08-30T14:30:00Z',
    },
    {
      id: 'DEMO-ALERT-002',
      severity: 'very_high',
      title: 'Very High Heat Alert',
      area: 'Ward 07, Ward 01',
      affectedWards: ['Ward 01', 'Ward 07'],
      description:
        'Very high heat stress conditions detected. Outdoor work precautions recommended. High-risk groups should remain indoors and remain hydrated.',
      trigger: {
        temperature: 41.1,
        humidity: 68,
        windSpeed: 2.8,
        heatIndex: 51.3,
      },
      vulnerability: {
        score: 75,
        vulnerablePopulation: 13100,
        atRiskGroups: ['older-adults', 'children'],
      },
      recommendedAction:
        'Issue heat health advisories to vulnerable populations. Adjust outdoor work schedules. Prepare cooling centers.',
      status: 'active',
      priority: 'high',
      intendedAudience: ['older-adults', 'children', 'outdoor-workers'],
      geographicScope: 'multi-ward',
      notificationChannels: [
        {
          channel: 'dashboard',
          status: 'ready',
          audience: 'general-public',
        },
        {
          channel: 'sms',
          status: 'not-connected',
          audience: 'older-adults',
        },
      ],
      issuedAt: '2026-08-30T11:15:00Z',
    },
    {
      id: 'DEMO-ALERT-003',
      severity: 'high',
      title: 'High Heat Alert',
      area: 'Multiple zones',
      affectedWards: ['Ward 02', 'Ward 04', 'Ward 06', 'Ward 08'],
      description:
        'High heat stress conditions. Monitor vulnerable populations. Ensure hydration and cooling access for at-risk groups.',
      trigger: {
        temperature: 39.8,
        humidity: 65,
        windSpeed: 2.1,
        heatIndex: 48.5,
      },
      vulnerability: {
        score: 62,
        vulnerablePopulation: 45000,
        atRiskGroups: ['older-adults'],
      },
      recommendedAction:
        'Monitor vulnerable populations. Ensure hydration and cooling access. Prepare hospitals for increased admissions.',
      status: 'acknowledged',
      priority: 'medium',
      intendedAudience: ['general-public', 'older-adults'],
      geographicScope: 'citywide',
      notificationChannels: [
        {
          channel: 'dashboard',
          status: 'ready',
          audience: 'general-public',
        },
        {
          channel: 'sms',
          status: 'not-connected',
          audience: 'general-public',
        },
        {
          channel: 'public-display',
          status: 'ready',
          audience: 'general-public',
        },
      ],
      issuedAt: '2026-08-29T18:45:00Z',
      acknowledgedAt: '2026-08-29T19:00:00Z',
    },
    {
      id: 'DEMO-ALERT-004',
      severity: 'moderate',
      title: 'Moderate Heat Alert',
      area: 'Ward 05',
      affectedWards: ['Ward 05'],
      description:
        'Moderate heat stress. Normal activities can proceed with standard precautions. Vulnerable populations should take standard heat precautions.',
      trigger: {
        temperature: 38.2,
        humidity: 60,
        windSpeed: 3.5,
        heatIndex: 45.2,
      },
      vulnerability: {
        score: 45,
        vulnerablePopulation: 7500,
        atRiskGroups: ['older-adults'],
      },
      recommendedAction:
        'Standard heat precautions. Ensure hydration. Monitor for any escalation.',
      status: 'resolved',
      priority: 'low',
      intendedAudience: ['general-public'],
      geographicScope: 'ward',
      notificationChannels: [
        {
          channel: 'dashboard',
          status: 'ready',
          audience: 'general-public',
        },
      ],
      issuedAt: '2026-08-28T10:00:00Z',
      resolvedAt: '2026-08-29T16:00:00Z',
    },
    {
      id: 'DEMO-ALERT-005',
      severity: 'low',
      title: 'Low Heat Alert',
      area: 'Ward 12',
      affectedWards: ['Ward 12'],
      description:
        'Low heat stress. No unusual precautions required. Standard summer preparedness measures in place.',
      trigger: {
        temperature: 36.5,
        humidity: 55,
        windSpeed: 4.2,
        heatIndex: 42.1,
      },
      vulnerability: {
        score: 25,
        vulnerablePopulation: 3200,
        atRiskGroups: [],
      },
      recommendedAction:
        'Maintain standard summer preparedness. No additional action required.',
      status: 'resolved',
      priority: 'low',
      intendedAudience: ['general-public'],
      geographicScope: 'ward',
      notificationChannels: [
        {
          channel: 'dashboard',
          status: 'ready',
          audience: 'general-public',
        },
      ],
      issuedAt: '2026-08-27T08:00:00Z',
      resolvedAt: '2026-08-28T18:00:00Z',
    },
  ],
};