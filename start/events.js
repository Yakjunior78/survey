const Event = use('Event');

Event.on('new::instance', 'Instance.created');
Event.on('NewInstance::created', 'Contacts.sync');
