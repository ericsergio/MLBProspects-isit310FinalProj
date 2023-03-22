using System;
using LeagueProspects.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace LeagueProspects.Services
{
	public class MongoProspectsServices
	{
		private readonly IMongoCollection<MongoProspect> _prospectsCollection;

		public MongoProspectsServices(
		
			IOptions<ProspectDatabaseSettings> prospectDatabaseSettings)
		{
			var mongoClient = new MongoClient(
				prospectDatabaseSettings.Value.ConnectionString);
			var mongoDatabase = mongoClient.GetDatabase(
				prospectDatabaseSettings.Value.DatabaseName);
			_prospectsCollection = mongoDatabase.GetCollection<MongoProspect>(
				prospectDatabaseSettings.Value.ProspectsCollectionName);
		}

		public async Task<List<MongoProspect>> GetAsync() =>
			await _prospectsCollection.Find(_ => true).ToListAsync();

		public async Task<MongoProspect?> GetAsync(string id) =>
			await _prospectsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

		public async Task CreateAsync(MongoProspect newProspect) =>
			await _prospectsCollection.InsertOneAsync(newProspect);

		public async Task UpdateAsync(string id, MongoProspect updatedProspect) =>
			await _prospectsCollection.ReplaceOneAsync(x => x.Id == id, updatedProspect);

		public async Task RemoveAsync(string id) =>
			await _prospectsCollection.DeleteOneAsync(x => x.Id == id);

        
	}
}

