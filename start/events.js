const Event = use('Event');
const Redis = use('Redis');

Event.on('instance::ready', 'Instance.ready');

Redis.subscribe('contact:clone', 'Contact.clone');
