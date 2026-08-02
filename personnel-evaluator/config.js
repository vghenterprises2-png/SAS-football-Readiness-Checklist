window.SAS_CONFIG = {};
window.SAS_CONFIG_READY = fetch('https://yfipyobifjhzfwsyhhew.supabase.co/functions/v1/public-app-config', {
  headers: { accept: 'application/json' },
  cache: 'no-store'
})
  .then(response => {
    if (!response.ok) throw new Error(`Configuration request failed (${response.status})`);
    return response.json();
  })
  .then(config => {
    window.SAS_CONFIG = config;
    return config;
  })
  .catch(error => {
    console.error('Unable to load shared app configuration.', error);
    return null;
  });

