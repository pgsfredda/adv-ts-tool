System.import('app/pg-adv-app')
    .then(function(m){ new m.pgAdvApp();})
    .catch(function(error) { console.error('app starting error', error) })