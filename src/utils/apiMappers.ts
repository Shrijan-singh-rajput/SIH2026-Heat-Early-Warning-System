export const toRiskLevel = (level: string | null | undefined): string =>
  (level ?? 'low').toLowerCase();

export function mapZoneToWard(zone: any, risk?: any) {
  return {
    zoneCode: zone.zone_code,
    name: zone.zone_name,
    riskLevel: toRiskLevel(risk?.overall_risk_level),
    population: zone.population ?? undefined,
  };
}

export function mapAlertOutToAlert(a: any) {
  return {
    id: String(a.id),
    severity: toRiskLevel(a.alert_level),
    title: `${a.alert_level} Heat Alert`,
    area: a.zone_code ?? 'Citywide',
    affectedWards: a.zone_code ? [a.zone_code] : [],
    description: a.alert_message,
    trigger: {
      temperature: 0, // not provided by backend AlertOut
      humidity: 0,    // not provided by backend AlertOut
      windSpeed: 0,   // not provided by backend AlertOut
    },
    vulnerability: {
      score: 0, // not provided by backend AlertOut
      vulnerablePopulation: 0,
      atRiskGroups: [] as string[],
    },
    recommendedAction: a.recommended_action ?? 'Not provided',
    status: a.status,
    priority: 'medium' as const,
    intendedAudience: ['general-public'] as const,
    geographicScope: (a.zone_code ? 'ward' : 'citywide') as 'ward' | 'multi-ward' | 'citywide',
    notificationChannels: [] as any[],
    issuedAt: a.created_at,
    acknowledgedAt: undefined,
    resolvedAt: a.sent_at ?? undefined,
  };
}