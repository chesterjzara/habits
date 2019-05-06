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
                //Add blank spaces
                
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


$( ()=> {
    //console.log('connected to show js file');

    let displayMonth = moment().month();
    currentMonth = displayMonth;
    let displayYear = moment().year();
    currentYear = displayYear; 

    
    loadCalendarData(displayMonth, displayYear);

    $('.prev-month-btn').on('click', prevMonth)
    $('.next-month-btn').on('click', nextMonth)

})
