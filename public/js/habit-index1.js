
const uncheckHabitDate = (event) => {
    console.log('Add code to uncheck habit date...');

    $(event.target).off('click', uncheckHabitDate)
    $(event.target).on('click', checkHabitDate)

    let rawDate = $(event.target).attr('habit-date');
    let habitId = $(event.target).attr('habit-id');
    let sendObj = {
        "date": rawDate,
        "habitId": habitId
    }

    console.log(rawDate);
    $.post(`/habits/uncheck/${habitId}`, sendObj, (data, status) => {
        console.log('data?',data);
        console.log(status);

        $(event.target).attr('habit-checked','false');
    });

}

const checkHabitDate = (event) => {
    console.log(event.currentTarget);
    console.log(event.target);

    $(event.target).off('click', checkHabitDate)
    $(event.target).on('click', uncheckHabitDate)

    let rawDate = $(event.target).attr('habit-date');
    let habitId = $(event.target).attr('habit-id');
    
    let sendObj = {
        "date": rawDate,
        "habitId": habitId
    }

    console.log('Right before post');
    console.log(sendObj);
    $.post(`/habits/check/${habitId}`, sendObj, (data, status) => {
        console.log('data?',data);
        console.log(status);

        $(event.target).attr('habit-checked','true');
    })
}

const loadAllDateElements = () => {

    //For each .date-header within .date-row
    let $allHabitSections =  $('.habit-data-container');
    let $dateCols = $allHabitSections.children('.date-row');
    let $allDateCols = $dateCols.children('.date-header');
    
    $allDateCols = $('.date-header')

    for(let i = 0; i< $allDateCols.length; i++) {
        let $addDateCol = $allDateCols.eq(i);
        
        let dateOffset = $addDateCol.attr('date-offset');
        let calculatedDate = moment().startOf('day').subtract(dateOffset, 'days').format('ddd DD');
        $addDateCol.text(calculatedDate);
    }

    let $allHabitCheckFields = $('.habit-check-field');
    console.log($allHabitCheckFields);

    

    $.get('/habits/index?dataOnly=true', (habitData, status) => {
        console.log(habitData);
        for(let i = 0; i < habitData.length; i++) {       

            let $habitRow = $('#'+habitData[i]._id);
            console.log($habitRow);
            let checkFieldArr = $habitRow.children('.habit-check-field')

            for(let j=0; j< checkFieldArr.length; j++) {
                let $eachCheckField = checkFieldArr.eq(j);
                console.log($eachCheckField);
                let offset = $eachCheckField.attr('date-offset');
                let pageDate = moment().startOf('day').subtract(offset, 'days').format();
                let checked = false;
                for(let checkDates of habitData[i].date_data) {
                    if(moment(checkDates).isSame(pageDate, 'day')) {
                        checked = true;
                    }
                }
                $eachCheckField.attr('habit-checked', checked);
                $eachCheckField.attr('habit-date', pageDate);
                
                if(checked) {
                    //$eachCheckField.html('&#xf14a')
                    $eachCheckField.on('click', uncheckHabitDate)
                }
                else {
                    //$eachCheckField.html('&#xF096')
                    $eachCheckField.on('click', checkHabitDate)
                }


                console.log(pageDate);
            }
        }
        generateAllSparkCharts(habitData)
    })
}

const generateAllSparkCharts = (habitData) => {

    $allSparkCharts = $('.sparkline');

    for(let i = 0; i < $allSparkCharts.length; i++) {
        generateSingleSparkChart($allSparkCharts.eq(i), habitData);
    }
}

const generateSingleSparkChart = ($chartCanvas, habitData) => {
    let tagName = $chartCanvas.attr('tag-name');
    let $parentContainer = $chartCanvas.parent().parent()
    let $dateElements = $parentContainer.find('.habit-check-field');
    console.log($dateElements);

    let goalScore = [0, 0, 0, 0, 0, 0];
    let realScore = [0, 0, 0, 0, 0, 0];

    for(let i =0; i < $dateElements.length; i++) {
        let $ele = $dateElements.eq(i);
        
        let dateOffset = parseInt($ele.attr('date-offset'))
        let habitIndex = habitData.findIndex( (e) => {
            return e._id === ($ele.attr('habit-id'))
        });
        let scoreweight = habitData[habitIndex].weight;

        let checked = $ele.attr('habit-checked')

        if (checked === 'true') {
            goalScore[dateOffset] += scoreweight;
            realScore[dateOffset] += scoreweight;
        }
        else if(checked === 'false') {
            goalScore[dateOffset] += scoreweight;
        }

    }
    console.log(tagName);
    
    goalScore.reverse()
    realScore.reverse()
    console.log(goalScore);
    console.log(realScore);
    let chartDataArr = realScore.map( (e, index) => {
        return  (parseFloat(e) / parseFloat(goalScore[index])).toFixed(2);
    });
    console.log(chartDataArr);

    let ctx = $chartCanvas
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [-5, -4, -3, -2, -1, 0],
        datasets: [{
            // label: 'My First dataset',
            // backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(0, 0, 128)',
            // fill: false,
            data: chartDataArr,
            lineTension: 0
            }]
        },
        // Configuration options go here
        options: {
            bezierCurve: false,
            responsive: false,
            //hide legend
            legend: {
                display: false
            },
            layout: {
                padding: {
                  top: 5
                }
            },
            elements: {
                line: {
                    borderColor: '#000000',
                    borderWidth: 2
                },
                point: {
                  radius: 0
                }
            },
            tooltips: {
                enabled: false
            },
            scales: {
                yAxes: [
                    {
                        display: false,
                        ticks: {
                            padding: 30,
                            min: -0.05,
                            max: 1.05
                        }
                    }
                ],
                xAxes: [
                    {
                        display: false
                    }
                ]
            }
        }
    });

}

$( ()=> {
    
    $(window).on('popstate', function() {
        location.reload(true);
    }); //via - https://stackoverflow.com/questions/43043113/how-to-force-reloading-a-page-when-using-browser-back-button

    loadAllDateElements();

    //$(`div[habit-checked='false'`).on('click', checkHabitDate)
    //$(`div[habit-checked='true'`).on('click', uncheckHabitDate)

    

})