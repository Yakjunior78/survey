'use strict';

const { Command } = require('@adonisjs/ace');
const Instance = use('App/Models/Instance');

class ProcessReadyInstance extends Command {
  
    static get signature () {
        return 'process:ready:instance'
    }
  
    static get description () {
        return 'Process survey instances ready for dispatch'
    }
  
    async handle (args, options) {
        
        let instances = await Instance
            .query()
            .whereNotNull('should_dispatch')
            .whereNull('clone_job_queued')
            .fetch();
        
        instances = instances.toJSON();
        
        for (const instance of instances) {
            
            console.log('processing instance if id ' + instance.id);
            
            if(instance.clone_job_queued) {
                console.log('Instance already queued');
                return;
            }
    
            console.log('Processing the instance');
    
            await Dispatch.handle (instance);
        }
        
        console.log('Processing completed')
    }
}

module.exports = ProcessReadyInstance
