'use strict';

const { Command } = require('@adonisjs/ace');
const Dispatch = new(use('App/Services/Survey/Dispatch'))();
const Instance = use('App/Models/Instance');
const { isNowOrPast } = use('App/Helpers/DateHelper');

const Logger = use('Logger');

class ProcessReadyInstance extends Command {
  
    static get signature () {
        return 'process:ready:instance'
    }
  
    static get description () {
        return 'Process survey instances ready for dispatch'
    }
  
    async handle (args, options) {
    
        Logger.info('Started to process');
        
        let instances = await Instance
            .query()
            .whereNotNull('should_dispatch')
            .whereNull('clone_job_queued')
            .fetch();
        
        Logger.info('Finished fetching the instances');
        
        instances = instances.toJSON();
        
        for (let instance of instances) {
            
            instance = await Instance.find(instance.id);
            
            if(!isNowOrPast(instance.start_at)) {
                Logger.info('Instance start time not yet');
                return;
            }
            
            Logger.info('processing instance if id ' + instance.id);
            
            if(instance.clone_job_queued) {
                Logger.info('Instance already queued');
                return;
            }
    
            Logger.info('Processing the instance');
    
            await Dispatch.handle (instance);
        }
        
        Logger.info('Processing completed');
    }
}

module.exports = ProcessReadyInstance
