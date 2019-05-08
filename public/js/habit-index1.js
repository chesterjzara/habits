
const uncheckHabitDate = (event) => {
    //Toggles the event listener - will Check box next click
    $(event.target).off('click', uncheckHabitDate)
    $(event.target).on('click', checkHabitDate)

    //Get the Date and Habit to send in POST query 
    let rawDate = $(event.target).attr('habit-date');
    let habitId = $(event.target).attr('habit-id');
    let sendObj = {
        "date": rawDate,
        "habitId": habitId
    }

    //Sends the date to remove from the Habit date_data array
        //Then callback code to update the checkbox and chart
    $.post(`/habits/uncheck/${habitId}`, sendObj, (data, status) => {
        //console.log('Data from uncheck GET:',data);

        //Change the clicked checkbox element to be "unchecked" - changes icon
        $(event.target).attr('habit-checked','false');

        //Update the chart on clicking check/uncheck
        let $greatGrandParent = $(event.target).parent().parent().parent();
        let $sparklineChart = $greatGrandParent.find('.sparkline')
        //Get the original chart.js object
        let existingChart = $sparklineChart.data('chart');
        existingChart.destroy();
        //Re-call the chart gen function to redraw new line
        generateSingleSparkChart($sparklineChart, data.habit_list)
    });

}

const checkHabitDate = (event) => {
    //Toggles the event listener - will Check box next click
    $(event.target).off('click', checkHabitDate)
    $(event.target).on('click', uncheckHabitDate)

    //Get the Date and Habit to send in POST query 
    let rawDate = $(event.target).attr('habit-date');
    let habitId = $(event.target).attr('habit-id');
    let sendObj = {
        "date": rawDate,
        "habitId": habitId
    }

    //Sends the date to add to the Habit date_data array
        //Then callback code to update the checkbox and chart
    $.post(`/habits/check/${habitId}`, sendObj, (data, status) => {
        //console.log('Data from uncheck GET:',data);

        //Change the clicked checkbox element to be "checked" - changes icon
        $(event.target).attr('habit-checked','true');
        
        //Update the chart on clicking check/uncheck
        let $greatGrandParent = $(event.target).parent().parent().parent();
        let $sparklineChart = $greatGrandParent.find('.sparkline')
        //Get the original chart.js object
        let existingChart = $sparklineChart.data('chart');
        existingChart.destroy();
        
        generateSingleSparkChart($sparklineChart, data.habit_list)
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

    $.get('/habits/index?dataOnly=true', (habitData, status) => {
        //console.log(habitData);
        for(let i = 0; i < habitData.length; i++) {       

            let $habitRow = $('#'+habitData[i]._id);
            let checkFieldArr = $habitRow.children('.habit-check-field')

            for(let j=0; j< checkFieldArr.length; j++) {
                let $eachCheckField = checkFieldArr.eq(j);
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

    let goalScore = [0, 0, 0, 0, 0, 0];
    let realScore = [0, 0, 0, 0, 0, 0];

    for(let i =0; i < $dateElements.length; i++) {
        let $ele = $dateElements.eq(i);
        
        let dateOffset = parseInt($ele.attr('date-offset'))
        let habitIndex = habitData.findIndex( (e) => {
            return e._id === ($ele.attr('habit-id'))
        });
        let scoreweight = habitData[habitIndex].weight;
        //let expectedFreq = habitData[habitIndex].weekly_goal/7;

        let checked = $ele.attr('habit-checked')

        if (checked === 'true') {
            goalScore[dateOffset] += scoreweight; //expectedFreq*scoreweight;
            realScore[dateOffset] += scoreweight;
        }
        else if(checked === 'false') {
            goalScore[dateOffset] += scoreweight;
        }

    }
    
    goalScore.reverse()
    realScore.reverse()
    let chartDataArr = realScore.map( (e, index) => {
        return  (parseFloat(e) / parseFloat(goalScore[index])).toFixed(2);
    });

    let ctx = $chartCanvas
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [-5, -4, -3, -2, -1, 0],
        datasets: [{
            // label: 'My First dataset',
            backgroundColor: 'rgba(0, 0, 128, 0.4)',
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
                            // padding: 30,
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

    //Store the Chart.js object in the canvas DOM element for altering later
    ctx.data('chart', chart);
}

const hideTagsWithNoHabits = () => {
    
    let $allTagElements = $('.tag-habit-container');

    for(let i = 0; i < $allTagElements.length; i++) {
        let numHabitChildren = $allTagElements.eq(i).find('.habit-data-row').length;
        if(numHabitChildren < 1){
            $allTagElements.eq(i).remove();
        }
    }
}

$( ()=> {
    
    $(window).on('popstate', function() {
        location.reload(true);
    }); //via - https://stackoverflow.com/questions/43043113/how-to-force-reloading-a-page-when-using-browser-back-button

     //Support for our Archive functionality
    let $toggleArchiveButton = $('.toggle-archive');
    if($toggleArchiveButton.attr('id') === 'archiveShow') {
        hideTagsWithNoHabits();
    }


    loadAllDateElements();



    

})