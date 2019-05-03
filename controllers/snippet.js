const testArr = [
    {
        date_data: [
            "2019-04-28T06:00:00.000Z",
            "2019-04-29T06:00:00.000Z",
            "2019-04-30T06:00:00.000Z",
            "2019-05-01T06:00:00.000Z",
            "2019-05-02T06:00:00.000Z",
            "2019-05-03T06:00:00.000Z"
        ],
        _id: "5cccbded56b9dc2bde227633",
        name: "Running",
        description: "",
        tag: "Fitness",
        userRef: "5cccbdde56b9dc2bde227632",
        __v: 2
    },
    {
        date_data: [
            "2019-04-28T06:00:00.000Z",
            "2019-04-29T06:00:00.000Z",
            "2019-04-30T06:00:00.000Z",
            "2019-05-01T06:00:00.000Z",
            "2019-05-02T06:00:00.000Z",
            "2019-05-02T06:00:00.000Z",
            "2019-05-03T06:00:00.000Z"
        ],
        _id: "5cccbdf556b9dc2bde227635",
        name: "Basketball",
        description: "",
        tag: "Fitness",
        userRef: "5cccbdde56b9dc2bde227632",
        __v: 1
    },
    {
        date_data: [
            "2019-04-28T06:00:00.000Z",
            "2019-04-29T06:00:00.000Z",
            "2019-04-30T06:00:00.000Z",
            "2019-05-01T06:00:00.000Z",
            "2019-05-02T06:00:00.000Z",
            "2019-05-03T06:00:00.000Z"
        ],
        _id: "5cccbdfc56b9dc2bde227637",
        name: "Swimming",
        description: "",
        tag: "Fitness",
        userRef: "5cccbdde56b9dc2bde227632",
        __v: 3
    },
    {
        date_data: [
            "2019-04-29T06:00:00.000Z",
            "2019-04-30T06:00:00.000Z",
            "2019-05-01T06:00:00.000Z",
            "2019-05-02T06:00:00.000Z",
            "2019-05-03T06:00:00.000Z"
        ],
        _id: "5cccbe1456b9dc2bde22763b",
        name: "Text Friends",
        description: "",
        tag: "Social",
        userRef: "5cccbdde56b9dc2bde227632",
        __v: 2
    },
    {
        date_data: [
            "2019-04-29T06:00:00.000Z",
            "2019-04-30T06:00:00.000Z",
            "2019-05-02T06:00:00.000Z"
        ],
        _id: "5cccbe0b56b9dc2bde227639",
        name: "Seeing Friends",
        description: "",
        tag: "Social",
        userRef: "5cccbdde56b9dc2bde227632",
        __v: 5
    },
    {
        date_data: [
            "2019-05-01T06:00:00.000Z",
            "2019-05-02T06:00:00.000Z"
        ],
        _id: "5cccbe1b56b9dc2bde22763d",
        name: "Pet Cat",
        description: "",
        tag: "Cat",
        userRef: "5cccbdde56b9dc2bde227632",
        __v: 1
    }
];

let habitId = '5cccbdfc56b9dc2bde227637'

let origIndex = testArr.findIndex( (e) => {
    return e._id === habitId
})

console.log(origIndex);
