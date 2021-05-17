export const barChartData = (summary, column) => {

	let labels = mapLabels();

	let datasets = mapDataSets(summary, column);

	return {
		labels: labels,
		datasets: datasets
	}
}

function mapLabels()
{
	return mapDays ();
}

function mapDates()
{
	let today = new Date();

	let datesSorted = [];

	for(let i = 0; i < 7; i++) {

		let sub = i === 0 ? 0 : 1;

		let newDate = new Date(today.setDate(today.getDate() - sub));

		datesSorted.push(newDate.toISOString().split('T')[0]);
	}

	return datesSorted.reverse();
}

function mapDays()
{
	const days = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat' ];

	let today = new Date();

	let daysSorted = [];

	for(let i = 0; i < 7; i++) {

		let sub = i === 0 ? 0 : 1;

		let newDate = new Date(today.setDate(today.getDate() - sub));

		daysSorted.push(days[newDate.getDay()]);
	}

	return daysSorted.reverse();
}

function mapDataSets(summary, column)
{
	let dates = mapDates();

	return [
		{
			label: 'TOTAL',
			data: mapDataOnDates(summary, dates, column),
			backgroundColor: '#48bb78'
		}
	]
}

function mapDataOnDates(summary, dates, column)
{
	let sortedData = [];

	dates.forEach ((date) => {

		let filtered = summary.filter (summ => formatDate(summ.date) === date );

		let total = filtered.reduce ((a, b) => {
			return a + b[column];
		}, 0);

		sortedData.push (total);
	})

	return sortedData;
}

export const barChartOptions = (title) => {

	return {

		responsive: true,
		maintainAspectRatio: false,

		legend: {
			display: false
		},

		title: {
			display: false,
			text: title,
			fontSize: 12	,
			fontColor: '#5c1799'
		},

		tooltips: {
			backgroundColor: '#17bf62'
		},

		scales: {
			xAxes: [
				{
					gridLines: {
						display: false
					}
				}
			],
			yAxes: [
				{
					ticks: {
						beginAtZero: true
					},
					gridLines: {
						display: true
					}
				}
			]
		}
	}
}

function formatDate (date)
{
	let d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2)
		month = '0' + month;
	if (day.length < 2)
		day = '0' + day;

	return [year, month, day].join('-');
}
