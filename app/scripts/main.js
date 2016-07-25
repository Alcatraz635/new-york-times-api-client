'use strict';

const newYorkTimesAPICall = (section = 'home', apiKey = '73e6f1e508994f288d5df6548e902fda') => {
    return new Promise((resolve, reject) => {
        $.ajax({
                url: `https://api.nytimes.com/svc/topstories/v2/${section}.json`,
                type: 'GET',
                data: { 'api-key': `${apiKey}` },
            })
            .done((data) => {
                resolve(data.results);
            })
            .fail((error) => {
                //console.log(error);
                reject(error);
            });
    });
}

const getStories = (sections) => {
    Promise.all(sections.map(x => newYorkTimesAPICall(x)))
        .then(values => {
            return values.reduce((x, y) => x.concat(y))
            			 .reduce((x, y) => {
            			 	let {title} = y;
            			 	x.push({title});
            			 	console.log(x);
            			 	return x
            			 }, [])
        })
}


let sectionSelections = ['home', 'opinion', 'politics']

getStories(sectionSelections)
