//Global Month and Year trackers
var currentMonth;
var currentYear;


const loadCalendarData = (displayMonth, displayYear) => {

    //Update HTML to show month and year
    $('.calendar-month').text(moment().month(displayMonth).format('MMMM'));
    $('.calendar-year').text(displayYear);

    let habitId = $('#habit-title').attr('habit-id');

    $.get(`/habits/month/${habitId}?month=${displayMonth}&year=${displayYear}`, (data, status) => {
        console.log(data);

        if(status === 'success'){
            generateCalendar(displayMonth, displayYear, data);
        }

    });
}

const generateCalendar = (month, year, data) => {
    
    //Empty any previous calendar dates
    $('.calendar-row').remove();
    
    let firstDay = moment(`${month+1}-01-${year}`, 'MM-DD-YYYY').startOf('month');
    let firstDayOfMonth = firstDay.day();
    let lastDay = moment(`${month+1}-01-${year}`, 'MM-DD-YYYY').endOf('month');
    let lastDayOfMonth = lastDay.day();

    let numDaysInMonth = firstDay.daysInMonth();

    // console.log(firstDay, lastDay);
    // console.log(firstDayOfMonth);
    // console.log(lastDayOfMonth);
    // console.log(numDaysInMonth);

    let $calendarContainer = $('.calendar-container');

    let dateCount = 1;
    let finishedMonth = false;

    for(let i = 0; i < 6; i++) {
        // //create row
        let $newRow = $('<div>').addClass('calendar-row row');
        $calendarContainer.append($newRow);
        //column loop
        for(let j = 0; j < 7; j++) {
            let $newCol = $('<div>').addClass('calendar-dates col');
            //first row logic
            if(i === 0 && j < firstDayOfMonth) {
                //Add blank spaces - do nothing for now, maybe blank icon later?
                
            } 
            //otherwise add cell with date unless 
            else {
                if(dateCount <= numDaysInMonth) {
                    $newCol.text(dateCount);
                    let dateString = `${month+1}-${dateCount}-${year}`
                    let calMoment = moment(dateString, 'MM-DD-YYYY')//.toDate();

                    let index = data.findIndex( (e) => {
                        return moment(e).isSame(calMoment, 'day')
                    })
                    //console.log('index result on '+ dateCount+': '+index);
                    
                    if(index !== -1){
                        $newCol.addClass('calendar-checked');
                    } else {
                        $newCol.addClass('calendar-unchecked');
                    }
                    let habitDate = moment(dateString, 'MM-DD-YYYY').startOf('day').format();
                    $newCol.attr('habit-date',habitDate);

                    $newCol.on('click', calendarClick);

                    dateCount++;

                }
                else {
                    finishedMonth = true;
                }
            }
            $newRow.append($newCol);
        }
        if(finishedMonth) {i = 7}
    }

};

const calendarClick = (event) => {
    let $date = $(event.target);
    let rawDate = $(event.target).attr('habit-date');
    let habitId = $('#habit-title').attr('habit-id');
    let sendObj = {
        "date": rawDate,
        "habitId": habitId
    }

    console.log(rawDate);
    if($date.hasClass('calendar-checked')) {
        //// Do unchecking code here
        $.post(`/habits/uncheck/${habitId}`, sendObj, (data, status) => {
            console.log('data?',data);
            console.log(status);
    
            //Switch the class
            $date.removeClass('calendar-checked').addClass('calendar-unchecked');
        });
        
    }
    else if ($date.hasClass('calendar-unchecked')) {
        //// Do checking code here
        $.post(`/habits/check/${habitId}`, sendObj, (data, status) => {
            console.log('data?',data);
            console.log(status);
            
            //Eventually switch the class
            $date.removeClass('calendar-unchecked').addClass('calendar-checked');
        });
    }   


}

const prevMonth = (event) => {
    console.log('Before: '+ currentMonth + ' ' + currentYear);
    if(currentMonth === 0) {
        currentMonth = 11;
        currentYear = currentYear -1;
    }
    else {
        currentMonth = currentMonth - 1
    }
    console.log(currentMonth, currentYear);

    loadCalendarData(currentMonth, currentYear)
}
const nextMonth = (event) => {
    console.log('Before: '+ currentMonth + ' ' + currentYear);
    if(currentMonth === 11) {
        currentMonth = 0;
        currentYear = currentYear + 1;
    }
    else {
        currentMonth = currentMonth + 1
    }
    console.log(currentMonth, currentYear);

    loadCalendarData(currentMonth, currentYear)
}

const generateChart = (type) => {
    let ctx = $('#showChart')
    let habitId = $('#habit-title').attr('habit-id');

    $.get(`/habits/${habitId}?dataOnly=true`, (habitData,status) =>{

        console.log(habitData);
        let labelData = getChartLabels(type);
        let chartData = getChartData(type, habitData);

        let chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labelData,
            datasets: [{
                // label: 'My First dataset',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: chartData
                }]
            },
            // Configuration options go here
            options: {
                //hide legend
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: 0,
                            max: 100,
                            maxTicksLimit: 5
                        }
                    }]
                }
            }
        });

    } )

    
}

const getChartLabels = (type) => {
    let retArr = [];

    if(type === '6month') {
        for(let i=0; i < 6; i++) {
            retArr.unshift(moment().subtract(i, 'month').format("MMM"));
        }
    }
    return retArr;
}

const getChartData = (type, data) => {
    let retArr = []
    let goalFreqPerWeek = data.weekly_goal;

    let expectedScoreMonths = [];
    let realScoreMonths = [0 ,0, 0, 0, 0, 0];

    console.log(data);

    if(type === '6month') {
        for(let i =0; i < 6; i++) {
            let daysThisMonth = moment().subtract(i, 'month').daysInMonth()
            expectedScoreMonths.unshift( daysThisMonth * (goalFreqPerWeek/7));
        
            for(let j=0; j < data.date_data.length; j++) {
                console.log('Checking date:',data.date_data[j]);
                if(moment(data.date_data[j]).isSame(moment().subtract(i, 'month'),'month')){
                    console.log('Month matched');
                    realScoreMonths[(realScoreMonths.length) - (i + 1)] += 1;
                }
            }
            console.log(realScoreMonths);
        }
        
        retArr = realScoreMonths.map( (element, index) => {
            return ((element / expectedScoreMonths[index])*100).toFixed(2);
        });

               
    }

    console.log(expectedScoreMonths);
    console.log(retArr);
    return retArr
}

$( ()=> {
    //console.log('connected to show js file');

    let displayMonth = moment().month();
    currentMonth = displayMonth;
    let displayYear = moment().year();
    currentYear = displayYear; 

    
    loadCalendarData(displayMonth, displayYear);

    $('.prev-month-btn').on('click', prevMonth)
    $('.next-month-btn').on('click', nextMonth)

    generateChart('6month');

})
