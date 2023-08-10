

const fs=require('fs');
const csvParser=require('csv-parser');

const inquirer=require('inquirer');
const filePath='train_details.csv';

const TrainData=[];

// Read the CSV file and store its content in the trainData array


fs.createReadStream(filePath)
	.pipe(csvParser())
	.on('data',(row) => {TrainData.push(row);})
	.on('end',() => {


		const trackways=TrainData.split('\n').slice(1);
		const AllData=trackways.map((track) => {

			const [
				train_No,
				train_Name,
				seq,
				station_Code,
				station_Name,
				arrival_Time,
				departure_Time,
				distance,
				source_Station_Code,
				source_Station_Name,
				destination_Station_Code,
				destination_Station_Name
			]
				=route.split(',');
			return {
				train_No,
				train_Name,
				seq,
				station_Code,
				station_Name,
				arrival_Time,
				departure_Time,
				distance,
				source_Station_Code,
				source_Station_Name,
				destination_Station_Code,
				destination_Station_Name
			};
		});


		const GroupAllInfo=new Map();
		AllData.forEach((item) => {

			if(GroupAllInfo.has(item.train_No)) {
				GroupAllInfo.set(item,train_No,[]);
			}
			GroupAllInfo.get(item.train_No).push(item)
		})

		// call  readCSVFiles()  function
		readCSVFiles();

	});


function readCSVFiles() {

	inquirer.prompt([
		{
			message: 'Select an option:',
			choices: [
				'Train info with longest route',
				'Train info with shortest route',
				'Train info with which covers less no of station between starting and ending station',
				'Train info with which covers maximum no of station between starting and ending station',
				'No of trains and names of the training',
				'Get the name of pickup point and destination point and provide possible options to travel between.'
			]
		}

	]).then((answers) => {


		const choice=answers.choice;

		switch(choice) {
			case 'Train info with longest route':
				TrainWithLongestRoute();
				break;
			case 'Train info with shortest route':
				TrainWithShortestRoute();
				break;
			case 'Train info with which covers less no of station between starting and ending station':
				TrainWithFewestStations();
				break;
			case 'Train info with which covers maximum no of station between starting and ending station':
				TrainWithMostStations();
				break;
			case 'No of trains and names of the training':
				TrainCountAndNames();
				break;
			case 'Get the name of pickup point and destination point and provide possible options to travel between.':
				findTravelOptions();
				break;
			default:
				console.log('Invalid choice.');
		}
	});
}


//readCSVFiles()

const TrainWithLongestRoute=() => {
	const longest_Route_Train=TrainData.reduce((max,train) => (train.distance>max.distance? train:max),TrainData[0]);
	console.log(` TrainName: ${longest_Route_Train.train_Name}, Distance: ${longest_Route_Train.distance}`);

}

const TrainWithShortestRoute=() => {
	const shortest_Route_Train=TrainData.reduce((min,train) => (train.distance<min.distance? train:min),TrainData[0]);
	console.log(`TrainName: ${shortest_Route_Train.train_Name}, Distance: ${shortest_Route_Train.distance}`);

}


const TrainWithFewestStations=() => {

	const fewest_Stations_Train=TrainData.reduce((min,train) => {

		const stations_Count=
		getStationsCountBetween(train.source_Station_Name,train.destination_Station_Name);
		return stations_Count<min.stations_Count? {...train,stations_Count}:min;
	},
		{...TrainData[0],stations_Count: Infinity}

	);
	console.log(`
	TrainName:${fewest_Stations_Train.train_Name},
  Stations Count: ${fewest_Stations_Train.stations_Count}`);



}


const TrainWithMostStations=() => {


	const mostStationsTrain = TrainData.reduce((max,train) => {

		const stationsCount=getStationsCountBetween(train.source_Station_Name,train.destination_Station_Name);
		return stationsCount > max.stationsCount? {...train,stationsCount}:max;
	},{...TrainData[0],stationsCount: 0});
	console.log(`TrainName:  ${mostStationsTrain.train_Name}, Stations Count: ${mostStationsTrain.stationsCount}`);




}


const TrainCountAndNames=() => {


	const station_Numbers=[];

	for(let i=0;i<TrainData.length-1;i++) {
		const current_Train=TrainData[i];
		const next_Train=TrainData[i+1];

		if(!next_Train||current_Train.trainName!==next_Train.train_Name) {
			station_Numbers.push({
				trainName: current_Train.train_Name,
				trainTotalStation: current_Train.seq
			});
		}
	}
	return station_Numbers;


}


const findTravelOptions=() => {
	//console.log(`${TrainData.length}`);

	console.log(`${TrainData.map((train) => train.train_Name).join(',')}`);
	return TrainData.filter(train => train.source_Station_Code === train.station_Code &&
		                                train.destination_Station_Code === train.station_Code)

}




