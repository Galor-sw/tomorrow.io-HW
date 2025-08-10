export const ALL_PARAMS = [
  'cloudBase','cloudCeiling','cloudCover','dewPoint','freezingRainIntensity','humidity',
  'precipitationProbability','pressureSurfaceLevel','rainIntensity','sleetIntensity','snowIntensity',
  'temperature','temperatureApparent','uvHealthConcern','uvIndex','visibility','weatherCode',
  'windDirection','windGust','windSpeed'
] as const;
export type AlertParameter = typeof ALL_PARAMS[number];

// Helpful splits (can be used later by scheduler rules)
export const CATEGORICAL_PARAMS = ['weatherCode'] as const;
export const NUMERIC_PARAMS = ALL_PARAMS.filter(p => !CATEGORICAL_PARAMS.includes(p as any)) as readonly AlertParameter[];

export const OPERATORS = ['>','>=','<','<=','=','!='] as const;
export type Operator = typeof OPERATORS[number];

export type Units = 'metric' | 'imperial' | 'kelvin';
