window.SAS_CONFIG = {};
try {
  const request = new XMLHttpRequest();
  request.open('GET', 'https://yfipyobifjhzfwsyhhew.supabase.co/functions/v1/public-app-config', false);
  request.send(null);
  if (request.status >= 200 && request.status < 300) {
    window.SAS_CONFIG = JSON.parse(request.responseText);
  }
} catch (error) {
  console.error('Unable to load shared app configuration.', error);
}
