
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



        // $.get('/habits/allData', (data,status)=>{
        //     //console.log(data);
        //     for(let i = 0; i < data.length; i++) {
        //         for(let d = 0; d < data[i].date_data.length; d++){
        //             let dbDate = moment(data[i].date_data[d]).startOf('day');
        //             console.log(dbDate._i);
        //         }
        //     }
        // })


        //Update all the elements
        let $allCheckboxes = $('.habit-checkbox')
        for(let i = 0; i < $allCheckboxes.length; i++) {
            

        }
    })
}

$( ()=> {
    

    // console.log('Before get');
    // $.get('/test', (data, status)=> {
    //     console.log('In get');
    //     console.log("Data: " + data + "\nStatus: " + status);

    //     for(let user of data) {
    //         console.log(user);
    //         let $username = $('<h2>').text(user.username);
    //         $('body').append($username);
    //     }
    // });

    $(`div[habit-checked='false'`).on('click', checkHabitDate)
    $(`div[habit-checked='true'`).on('click', uncheckHabitDate)

    // //$('.habit-checkbox').on('click', (event)=> {
    // $(`div[habit-checked='false'`).on('click', (event)=> {
    //     console.log(event.currentTarget);
    //     console.log(event.target);
  
    //     $(event.target).off()
    //     $(event.target).on('click', uncheckHabit)

    //     let rawDate = $(event.target).attr('habit-date');
    //     let habitId = $(event.target).attr('habit-id');
        
    //     let sendObj = {
    //         "date": rawDate,
    //         "habitId": habitId
    //     }

    //     console.log('Right before post');
    //     console.log(sendObj);
    //     $.post(`/habits/click/${habitId}`, sendObj, (data, status) => {
    //         console.log('data?',data);
    //         console.log(status);

    //         $(event.target).attr('habit-checked','true');



    //         // $.get('/habits/allData', (data,status)=>{
    //         //     //console.log(data);
    //         //     for(let i = 0; i < data.length; i++) {
    //         //         for(let d = 0; d < data[i].date_data.length; d++){
    //         //             let dbDate = moment(data[i].date_data[d]).startOf('day');
    //         //             console.log(dbDate._i);
    //         //         }
    //         //     }
    //         // })


    //         //Update all the elements
    //         let $allCheckboxes = $('.habit-checkbox')
    //         for(let i = 0; i < $allCheckboxes.length; i++) {
                

    //         }
    //     })
    // })

})