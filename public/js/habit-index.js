
const uncheckHabitDate = (event) => {
    console.log('Add code to uncheck habit date...');

    $(event.target).off('click', uncheckHabitDate)
    $(event.target).on('click', checkHabitDate)

    let rawDate = $(event.target).attr('habit-date');
    let habitId = $(event.target).attr('habit-id');
    let sendObj = {
        "date": moment(rawDate).format('MM-DD-YYYY'),
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
        "date": moment(rawDate).format('MM-DD-YYYY'),
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

$( ()=> {
    

    $(`div[habit-checked='false'`).on('click', checkHabitDate)
    $(`div[habit-checked='true'`).on('click', uncheckHabitDate)

})