const Event = use('Event');
const Redis = use('Redis');

Event.on('instance::ready', 'Instance.ready');

Redis.subscribe('contact:clone', 'Contact.clone');
Redis.subscribe('contact:session', 'Contact.session');
Redis.subscribe('resource:deduct', 'Resource.deduct');
Redis.subscribe('instance:dispatch', 'Instance.dispatch');

Redis.subscribe('response:received', 'Response.received');
