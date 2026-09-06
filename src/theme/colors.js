export const getColors = (scheme) => {
  const dark = scheme === 'dark';

  return {
    background: dark ? '#0F172A' : '#F1F5F9',
    surface: dark ? '#1E293B' : '#FFFFFF',
    text: dark ? '#F8FAFC' : '#0F172A',
    muted: dark ? '#CBD5E1' : '#64748B',
    border: dark ? '#475569' : '#CBD5E1',
    primary: '#5B9BD5',
    danger: '#F87171',
  };
};
