
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
                    $eachCheckField.on('click', uncheckHabitDate)
                }
                else {
                    $eachCheckField.on('click', checkHabitDate)
                }

                console.log(pageDate);
            }
        }
        
    })
    

}

$( ()=> {
    
    $(window).on('popstate', function() {
        location.reload(true);
    }); //via - https://stackoverflow.com/questions/43043113/how-to-force-reloading-a-page-when-using-browser-back-button

    loadAllDateElements();

    //$(`div[habit-checked='false'`).on('click', checkHabitDate)
    //$(`div[habit-checked='true'`).on('click', uncheckHabitDate)
    $('.inlinesparkline').sparkline(); 

})