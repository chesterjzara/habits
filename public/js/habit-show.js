
const loadCalendarData = (displayMonth) => {

    let habitId = $('#habit-title').attr('habit-id');

    $.get(`/habits/month/${habitId}?month=${displayMonth}`, (data, status) => {
        console.log(data);
    });
}


$( ()=> {
    //console.log('connected to show js file');

    let displayMonth = moment().month();
    console.log(displayMonth);
    
    loadCalendarData(displayMonth);
})
