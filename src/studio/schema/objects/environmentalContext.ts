import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'environmentalContext',
  title: 'Environmental Context',
  type: 'object',
  fields: [
    defineField({ name: 'type', type: 'string', title: 'Type' }),
    defineField({ name: 'condition', type: 'string', title: 'Condition' }),
    defineField({
      name: 'temperatureCelsius',
      type: 'number',
      title: 'Temperature (°C)',
    }),
    defineField({
      name: 'tempMinCelsius',
      type: 'number',
      title: 'Min Temp (°C)',
    }),
    defineField({
      name: 'tempMaxCelsius',
      type: 'number',
      title: 'Max Temp (°C)',
    }),
    defineField({ name: 'rainfallMm', type: 'number', title: 'Rainfall (mm)' }),
    defineField({ name: 'windKmh', type: 'number', title: 'Wind (km/h)' }),
    defineField({
      name: 'humidityPercent',
      type: 'number',
      title: 'Humidity (%)',
    }),
    defineField({ name: 'uvIndex', type: 'number', title: 'UV Index' }),
    defineField({ name: 'fetchedAt', type: 'string', title: 'Fetched At' }),
  ],
});
