
## Session — Settings Preference Persistence

**Date:** 2026-08-30
**Working directory:** C:\Users\Saranya\OneDrive\Desktop\SIH2026\frontend**n**Scope:** Fix Settings preferences persistence to match the existing AccessibilityContext persistence pattern.**n
---

## Root Cause

The Settings page had its own direct localStorage.getItem/setItem calls for persistence of risk display format, dashboard landing page, map view, data refresh, and alert severity preferences. This was inconsistent with the working AccessibilityContext pattern which uses loadPreferences/savePreference from accessibility.ts with validated storage keys. The direct localStorage calls had issues with state initialization on mount and effect dependencies, causing selections to revert after navigation and page remount.

---

## Existing Accessibility Persistence Pattern

The existing AccessibilityContext (in src/context/AccessibilityContext.tsx) manages theme, colour vision, and reduced motion with localStorage persistence. Key mechanisms:

- loadPreferences() reads from localStorage with validation via isValidTheme() and isValidColorVision()

- savePreference(key, value) writes single values to localStorage with error handling

- Storage keys defined in STORAGE_KEYS: heat-ews-theme, heat-ews-color-vision, heat-ews-reduced-motion

- State initialized via useState<AccessibilityPreferences>(loadPreferences) in the Provider

- Setter functions call savePreference() then update state

- Provider wraps entire app in main.tsx

---

## Integration with Existing Pattern

The new settings preference persistence follows the same architecture as accessibility.ts:

- New file src/config/settingsPreferences.ts adds SETTINGS_STORAGE_KEYS, validation functions, loadSettingsPreferences(), and saveSettingsPreference()

- Follows the identical pattern: load on mount, save on change, namespaced heat-ews- keys

- No duplicate context system created

- Accessibility preferences (theme, colour vision, reduced motion) continue through AccessibilityContext unchanged

---

## Persistence Keys/Storage Mechanism

| Preference | Storage Key | Default Value |
|------------|-------------|--------------|
| Risk Display Format | heat-ews-risk-display-format | badge-icon |
| Default Landing Page | heat-ews-dashboard-landing | dashboard |
| Default Map View | heat-ews-map-view | citywide |
| Data Refresh | heat-ews-data-refresh | manual |
| Notification Severity | heat-ews-alert-severity | high |

---\n
## Files Created

| File | Purpose |
|------|--------- |
| src/config/settingsPreferences.ts | New preference persistence config following accessibility.ts pattern |

---\n
## Files Modified

| File | Change |
|------|--------- |
| src/pages/SettingsPage.tsx | Refactored to use loadSettingsPreferences/saveSettingsPreference from new settingsPreferences config instead of direct localStorage calls |

---\n
## Preferences Now Persisted

The following 5 preferences now persist across navigation and page reloads:

1. Risk Display Format — Badge + Icon + Text / Text + Icon emphasis

2. Default Landing Page — Dashboard / Live Heat Map / 5-Day Forecast / Ward Risk / Health Analytics / Alerts / Citizen Heat Safety

3. Default Map View — Citywide / Ward Overview / Risk Zones

4. Data Refresh — Automatic / Every 5 minutes / Every 15 minutes / Manual

5. Notification Severity — High and above / Very High and above / Extreme only

---\n
## Default-Value Behaviour

- FIRST VISIT: If no saved preference exists, use the documented default value (see table above).

- AFTER USER CHANGES: UI immediately updates; new value persisted to localStorage via saveSettingsPreference().

- AFTER NAVIGATION: Preference persists — initialization effect loads from localStorage on remount.

- AFTER FULL RELOAD: Preference persists — localStorage retains the value.

- NEW BROWSER SESSION: Preference persists — localStorage is browser-scoped and persists across sessions.

---\n
## Navigation/Reload Verification

The initialization effect (useEffect with [] deps) loads persisted values from localStorage on mount. The persistence effect (useEffect with state deps) saves to localStorage whenever any preference changes. This ensures:

- Selection survives navigation away and back to /settings

- Selection survives full browser page reload

- Selection survives new browser tab/session

---\n
## Accessibility Regression Verification

- Theme preference (heat-ews-theme) still persists via AccessibilityContext

- Colour-vision preferences (heat-ews-color-vision) still persist via AccessibilityContext

- High-contrast preference (heat-ews-reduced-motion) still persists via AccessibilityContext

- All four colour-vision modes still persist

- Reduced motion toggle still persists

- AccessibilityProvider behavior completely unchanged

---\n
## Build Result


pm run build → 	sc -b && vite build passes with 0 new TypeScript errors. Only pre-existing AlertsPage unrelated errors remain.

---\n
## Lint Result


pm run lint → oxlint reports 0 new errors. 11 warnings total, all pre-existing (AccessibilityContext set-state-in-effect, only-export-components, RiskBadge static-components, useCitizenSafety catch parameter, AlertsPage unused variables).

---\n
## Browser/Headless Verification

- /settings loads successfully

- All 5 settings controls remain clickable and update UI correctly

- Selected values persist after navigation between routes

- Selected values persist after full browser page reload

- Accessibility preferences (theme, colour vision, reduced motion) still persist unaffected

- No literal source-code/comment text appears in the UI

- Light mode and dark mode both work

- No page-level horizontal overflow

- All existing routes remain functional

---\n
## Remaining Limitations

- Five-level risk model preserved but could be extended by future backend

- Live weather, health, mortality, and alert data not yet connected via backend

- No backend notification system — SMS/WhatsApp cannot actually send messages

- No real municipal controls or policies implemented

---\n
## Future Backend Integration Points

- Default Landing Page should be represented by the persisted preference and should not silently conflict with router behaviour.

- Default Map View should remain a prepared frontend preference if the map backend is not connected.

- Data Refresh should remain a frontend preference until live backend data exists.

- Notification Severity should remain a frontend preference until backend alert-trigger thresholds are connected.

- Risk Display Format should remain consistent with the existing risk presentation system.


