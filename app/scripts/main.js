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
                reject(error);
            });
    });
}

const getStories = (sections) => {
    return Promise.all(sections.map(x => newYorkTimesAPICall(x)))
        .then(values => {
            return values.reduce((x, y) => x.concat(y))
                .reduce((x, y) => {
                    let { title, abstract, published_date, multimedia, short_url, section, sub_section, byline } = y;

                    x.push({
                        "title": title,
                        "abstract": abstract,
                        "author": byline,
                        "date": $.datepicker.formatDate("M d, yy", new Date(published_date)),
                        "fullDate": new Date(published_date),
                        "tags": [section, sub_section],
                        "image": multimedia.length == 0 ? null : multimedia[4].url,
                        "url": short_url
                    });
                    return x
                }, [])
        })
}

const generateStoriesHTML = (stories) => {
    $('.content').html('')
    stories = stories.sort((x, y) => new Date(y.fullDate) - new Date(x.fullDate))

    const storiesData = stories.reduce((a, b, i, g) => !(i % 3) ? (a.push(g.slice(i, i + 3)), a) : a, [])
    stories.sort((x, y) => new Date(y.date) - new Date(x.date))
    storiesData.map(x => appendContent(x));
}

const appendContent = (data) => {
    const genericImage = "../images/generic-news-image.jpg";
    $('.content').append(`

                <div class="mdl-grid">
                    <div class="mdl-cell mdl-cell--6-col">
                        <div class="demo-card-wide mdl-card mdl-shadow--2dp">
                            <div class="mdl-card__title" style="background: url('${data[0].image != null ? data[0].image : genericImage}') center / cover">
                                <h2 class="mdl-card__title-text">${data[0].title}</h2>
                            </div>
                            <div class="mdl-card__supporting-text">
                                ${data[0].abstract}<br><br><strong>${data[0].author}</strong>
                            </div>
                            <div class="mdl-card__actions mdl-card--border">
                                <a href="${data[0].url}" target="_blank" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
              READ MORE
            </a>
            <div class="mdl-layout-spacer"></div>
                            <div class="date-text">
                            ${data[0].date}
                            </div>
                            </div>
                            <div class="mdl-card__menu">
                               ${data[0].tags[0]} ${data[0].tags[1] != null ? data[0].tags[1] : ""}
                            </div>
                        </div>
                    </div>
                    <div class="mdl-cell mdl-cell--6-col">
                        <div class="demo-card-wide mdl-card mdl-shadow--2dp">
                            <div class="mdl-card__title" style="background: url('${data[1].image != null ? data[1].image : genericImage}') center / cover">
                                <h2 class="mdl-card__title-text">${data[1].title}</h2>
                            </div>
                            <div class="mdl-card__supporting-text">
                                ${data[1].abstract}<br><br><strong>${data[1].author}</strong>
                            </div>
                            <div class="mdl-card__actions mdl-card--border">
                            <a href="${data[1].url}" target="_blank" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
                              READ MORE
                            </a> 
                            <div class="mdl-layout-spacer"></div>
                            <div class="date-text">
                            ${data[1].date}
                            </div>
                            </div>
                            <div class="mdl-card__menu">
                                ${data[1].tags[0]} ${data[0].tags[1] != null ? data[1].tags[1] : ""}
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div class="mdl-grid">
                    <div class="mdl-cell mdl-cell--12-col">
                        <div class="demo-card-wide mdl-card mdl-shadow--2dp">
                            <div class="mdl-card__title" style="background: url('${data[2].image != null ? data[2].image : genericImage}') center / cover">
                                <h2 class="mdl-card__title-text">${data[2].title}</h2>
                            </div>
                            <div class="mdl-card__supporting-text">
                                ${data[2].abstract}<br><br><strong>${data[1].author}</strong>
                            </div>
                            <div class="mdl-card__actions mdl-card--border">
                                <a href="${data[2].url}" target="_blank" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
              READ MORE
            </a>
            <div class="mdl-layout-spacer"></div>
                            <div class="date-text">
                            ${data[2].date}
                            </div>
                            </div>
                            <div class="mdl-card__menu">
                                 ${data[2].tags[0]} ${data[2].tags[1] != null ? data[2].tags[1] : ""}
                            </div>
                        </div>
                    </div>
                </div>
                `).hide().fadeIn('fast');
}





//DOM Event Handlers

$(document).ready(() => {
    let selectedSections = ['home']

    getStories(selectedSections).then(x => {
        generateStoriesHTML(x)
    })

    $('.mdl-switch__input').on('click', (e) => {
        
        let section = $(e.currentTarget).siblings('.mdl-switch__label').text().toLowerCase().split(' ').join('')
        selectedSections.indexOf(section) == -1 ? selectedSections.push(section) : selectedSections.splice(selectedSections.indexOf(section), 1)
        selectedSections.length >= 1 ? getStories(selectedSections).then(x => { generateStoriesHTML(x) }) : $('.content').fadeOut('slow')
        console.log(selectedSections)
    })
})
